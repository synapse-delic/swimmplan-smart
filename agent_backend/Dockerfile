FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:0.11.22 /uv /uvx /bin/

WORKDIR /app

# Copy dependency files
COPY pyproject.toml ./

# Install dependencies (creates .venv)
RUN uv sync --no-cache

# Copy application files
COPY . .

# Expose Cloud Run port
EXPOSE 8080

# Start ADK API server
CMD ["uv", "run", "adk", "api_server", "--host", "0.0.0.0", "--port", "8080", "--allow_origins", "*", "--auto_create_session", "."]
