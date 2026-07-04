import os
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("SwimCoachMCPServer")

@mcp.tool()
def get_swim_templates() -> list[dict]:
    """Get the standard swim exercise templates available in SwimmPlan Smart.
    
    These are the standard building blocks that can be placed in a swim workout.
    """
    return [
        {
            "id": "tpl-warmup-1",
            "title": "Warm-up Drills",
            "distance": 400,
            "time": 20,
            "category": "warmup",
            "details": "4x100m Medley | Easy Pace",
            "description": "Focus on form",
            "tags": ["Drills", "Warmup"]
        },
        {
            "id": "tpl-endurance-1",
            "title": "Endurance Free",
            "distance": 1600,
            "time": 30,
            "category": "mainset",
            "details": "8x200m Freestyle @ 3:00",
            "description": "75% Effort, Zone 3",
            "tags": ["Freestyle", "Mainset"]
        },
        {
            "id": "tpl-kick-1",
            "title": "Kick & Stroke Drills",
            "distance": 300,
            "time": 25,
            "category": "drills",
            "details": "6x50m Back/Breast",
            "description": "Catch focus, Fin Use",
            "tags": ["Kick", "Backstroke", "Drills"]
        },
        {
            "id": "tpl-speed-1",
            "title": "Speed Bursts",
            "distance": 250,
            "time": 15,
            "category": "sprint",
            "details": "10x25m @ 0:45",
            "description": "All Out Sprint",
            "tags": ["Sprint", "Butterfly", "Drills"]
        },
        {
            "id": "tpl-cooldown-1",
            "title": "Recovery Cooldown",
            "distance": 200,
            "time": 10,
            "category": "cooldown",
            "details": "4x50m Choice | Slow & Relaxed",
            "description": "Relaxed layout, focus on stroke rate",
            "tags": ["Cooldown", "Turns"]
        }
    ]

@mcp.tool()
def get_coaching_guidelines() -> dict:
    """Get the official coaching guidelines for creating a balanced swim training plan.
    
    This includes structural rules (such as warm-up, drills, mainset, and cooldown ordering)
    and duration/distance bounds to make sure the training is safe and effective.
    """
    return {
        "structure": [
            "Every workout must have a Warm-up block at the start (10-20 mins).",
            "A standard workout has a Technique/Drills block or Sprint block for skill/speed work.",
            "A standard workout has a Main Set block for endurance/aerobic work.",
            "Every workout should end with a Cooldown block (5-15 mins) for recovery."
        ],
        "limits": {
            "max_duration_minutes": 120,
            "min_duration_minutes": 30,
            "max_distance_meters": 6000
        }
    }

if __name__ == "__main__":
    # Start the server on stdio transport
    mcp.run()
