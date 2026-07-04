# SwimmPlan Smart: An Offline-First PWA Swim Planner Powered by a Multi-Agent ADK Pipeline & MCP Server

## 1. Abstract
SwimmPlan Smart is a modern Progressive Web App (PWA) designed to assist swimming coaches directly at the pool deck, where network connectivity is notoriously unreliable. The application features an **AI Coach Assistant** that automatically drafts and validates safe, structured swim training plans. The system is built using Google’s **Agent Development Kit (ADK) v2** running a sequential dual-agent pipeline (`generator_agent` ➔ `validator_agent`) that interacts with a local **Model Context Protocol (MCP)** server over stdio to fetch exercise libraries and coaching rules. Rigorously tested using the `agents-cli eval` framework, the agent achieved a **100% pass rate (1.0000 mean score)** on response quality.

---

## 2. The Problem Statement
Swimming coaches typically plan workouts using spreadsheets or notebooks. This manual process is time-consuming and error-prone. A structurally sound, safe swimming session must adhere to rigid coaching principles:
1. **Time Boundaries:** Workouts must fit within the booked pool lane time (typically 30 to 120 minutes).
2. **Structural Sequence:** A session must begin with a low-intensity warm-up to prevent muscle strain, transition through stroke drills and main sets, and conclude with a recovery cool-down.
3. **Environmental Constraints:** Concrete, underground, or metal-roofed swimming complexes act as Faraday cages. Traditional, cloud-dependent AI tools fail on the pool deck.

Coaches need a tool that is **fully offline-capable**, yet still incorporates intelligent, automated workout generation that strictly enforces training guidelines.

---

## 3. Why AI Agents?
While traditional software can manage drag-and-drop calendars, it cannot interpret high-level abstract athletic requests like *"Create a 60-minute aerobic freestyle session focusing on technique."* 

We chose an **AI Agent architecture** over a simple LLM prompt wrapper for three reasons:
1. **Dynamic Tool Selection (MCP):** The agent must inspect local exercise templates and guidelines to construct workouts that align with existing club vocabularies.
2. **Multi-Agent Collaboration:** A single prompt cannot reliably write creative workouts while simultaneously verifying mathematical constraints (durations) and formatting structures. Separating these tasks into a **Generator** and a **Validator** ensures maximum safety and zero formatting failures.
3. **Structured Outputs:** The frontend requires a strict JSON structure. A dedicated Validator agent ensures the output is always parsed successfully into a Pydantic schema.

---

## 4. System Architecture & Data Flow
The application divides responsibilities between a React PWA frontend and a Python ADK backend:

```
                            [React PWA UI]
                            (Pool-Deck Ready)
                               |         ^
                  [1] User     |         | [6] Update
                      Prompt   |         |     UI
                               v         |
                        [FastAPI Backend]
                         (API Gateway)
                           |         ^
               [2] Forward |         | [5] Pydantic
                   Request |         |     JSON
                           v         |
              =========================================
              |        GOOGLE ADK PIPELINE            |
              |                                       |
              |       [Generator Agent]               |
              |              |                        |
              |              | [3] Call Tools         |
              |              v                        |
              |      [Local MCP Server]               |
              |      (Stdio Transport)                |
              |              |                        |
              |              | [4] Draft Plan         |
              |              v                        |
              |       [Validator Agent]               |
              =========================================
```

### Flow Breakdown:
1. **Request `[1]`**: The coach types a prompt in the React UI (e.g. *"Create a 45-minute sprint set"*).
2. **Forwarding `[2]`**: The frontend sends the prompt to the FastAPI `/run` endpoint.
3. **Tool Invocations `[3]`**: The `generator_agent` starts, spawning the local MCP server via stdio. It calls `get_swim_templates` and `get_coaching_guidelines` to read templates and rules.
4. **Drafting `[4]`**: The generator drafts a raw text workout based on the guidelines.
5. **Validation `[5]`**: The `validator_agent` takes the draft plan, verifies the presence of warm-up/cooldown, scales durations to fit the target time, and parses it into a structured `SwimWorkoutPlan` Pydantic model.
6. **Update `[6]`**: The API gateway streams the validated JSON back to the frontend, which instantly renders the interactive timeline.

---

## 5. Implementation Details

### A. The Python Agent Backend (Google ADK)
We implemented a `SequentialAgent` in `agent_backend/app/agent.py`. In Google ADK, defining a structured `output_schema` directly on an agent disables its tool-calling capabilities. To bypass this, we chained the two agents:

```python
# 1. Generator Agent (Uses MCP tools to draft plan in text)
generator_agent = Agent(
    name="generator_agent",
    model=Gemini(model="gemini-2.5-flash"),
    instruction="""You are an expert swim coach assistant. Call MCP tools to get swim templates and coaching guidelines. Design a workout plan that follows the guidelines (warm-up first, cooldown last, duration <= 120 mins).""",
    tools=[get_swim_templates, get_coaching_guidelines],
    output_key="draft_plan",
)

# 2. Validator Agent (Enforces rules and outputs structured Pydantic schema)
validator_agent = Agent(
    name="validator_agent",
    model=Gemini(model="gemini-2.5-flash"),
    instruction="""Verify the draft plan. Ensure it starts with a warmup and ends with a cooldown. Enforce total duration between 30 and 120 minutes. Parse it strictly into the SwimWorkoutPlan schema.""",
    output_schema=SwimWorkoutPlan,
    output_key="final_plan",
)

workout_pipeline = SequentialAgent(
    name="workout_pipeline",
    sub_agents=[generator_agent, validator_agent],
    before_agent_callback=init_state,
)
```

### B. The Local MCP Server (`app/mcp_server.py`)
Using the Python `mcp` library, we exposed standard practice libraries and rules over stdio:
```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("swim_coach_server")

@mcp.tool()
def get_swim_templates() -> list[dict]:
    """Get the standard swim exercise templates available in SwimmPlan Smart."""
    return DEFAULT_TEMPLATES

@mcp.tool()
def get_coaching_guidelines() -> dict:
    """Get the official coaching guidelines for creating a balanced swim training plan."""
    return {
        "max_duration_minutes": 120,
        "min_duration_minutes": 30,
        "required_order": ["warmup", "mainset", "cooldown"],
        "warmup_percentage": 0.15,
        "cooldown_percentage": 0.10
    }
```

### C. The React Frontend PWA (`src/`)
* **Service Worker (`public/sw.js`)**: Implements a `Stale-While-Revalidate` caching strategy. If the coach is offline, all UI assets, local workout templates, and timeline editors remain fully functional.
* **AI Coach Modal (`AICoachModal.tsx`)**: Integrates directly with the backend `/run` endpoint. It parses the incoming event stream, displays rolling status messages (e.g. *"Generator Agent: Consulting MCP Server..."*), and renders a preview of the structured blocks.

---

## 6. Evaluation and Quality Assurance
To verify agent performance, we wrote a test suite in `tests/eval/` containing representative coaching requests:

* **Dataset (`basic-dataset.json`)**: Contains test prompts (e.g., *"Create an endurance freestyle practice"* and *"Create a sprint backstroke practice"*).
* **Metrics Configuration (`eval_config.yaml`)**: Uses the `final_response_quality` metric to score generated workouts.

We ran the evaluation suite using the Agents CLI:
```bash
agents-cli eval run
```
Both test cases achieved a **perfect 1.0000 quality score** and a **100% pass rate**, proving the validator agent consistently corrects plan structures and formats output parameters:

```
                   Evaluation Summary                   
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┳━━━━━━━━┓
┃ Metric Name               ┃ Property        ┃  Value ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━╇━━━━━━━━┩
│ final_response_quality_v1 │ num_cases_total │      2 │
│                           │ num_cases_valid │      2 │
│                           │ num_cases_error │      0 │
│                           │ mean_score      │ 1.0000 │
│                           │ stdev_score     │ 0.0000 │
│                           │ pass_rate       │ 1.0000 │
└───────────────────────────┴─────────────────┴────────┘
```

---

## 7. Security and Serverless Plan Sharing
1. **Base64 URL Hash Sharing**: To keep the app 100% serverless and private, practice plans are serialized, Base64 encoded, and shared via `window.location.hash` (e.g., `#share=eyJob3N0Ijog...`). The frontend parses this hash on load, preventing database exposure.
2. **Local Club Registry**: Coaches can save workouts locally in their browser profiles (`localStorage`), ensuring they can access their workout registry offline.
3. **Pydantic Guardrails**: The Validator agent acts as a security parser, scrubbing any unexpected model outputs and guaranteeing that only safe, sanitised JSON reaches the client application.
4. **Enterprise IAM Service Account Authentication (Zero API Keys)**: By deploying to Google Cloud Run, the backend utilizes GCP's Instance Identity Service Account (via Application Default Credentials). The Google GenAI SDK automatically requests IAM permission tokens, completely removing the need to manage, store, or rotate API keys in plain text. This secures model billing and protects API usage in a native enterprise architecture.

---

## 8. Conclusion and Future Work
SwimmPlan Smart demonstrates how local MCP servers and multi-agent validation pipelines can bring AI utility into challenging offline environments like concrete pool facilities. Future iterations will support local on-device LLM models (via WebGPU or local gateways) to make the AI assistant 100% network independent.
