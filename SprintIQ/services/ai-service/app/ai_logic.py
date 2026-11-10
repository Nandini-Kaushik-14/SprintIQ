import json
import os
from openai import OpenAI

MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

def _client():
    key = os.getenv("OPENAI_API_KEY")
    return OpenAI(api_key=key) if key else None

def _ask_json(system_prompt: str, user_prompt: str):
    client = _client()
    if not client:
        return None
    response = client.chat.completions.create(
        model=MODEL,
        temperature=0.2,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    return json.loads(response.choices[0].message.content)

def estimate_story(raw: str):
    result = _ask_json(
        "You are an Agile requirements assistant. Return JSON with keys: title, user_story, "
        "acceptance_criteria (array of {given,when,then}), story_points (one of 0,1,2,3,5,8,13), "
        "complexity_reason, clarity_score (0-100). Do not invent business rules; flag assumptions.",
        raw
    )
    if result:
        result["is_demo"] = False
        return result
    clean = raw.strip()
    return {
        "title": clean[:80],
        "user_story": f"As a user, I want {clean[0].lower() + clean[1:] if clean else 'to complete this requirement'} so that I can achieve the intended outcome.",
        "acceptance_criteria": [
            {"given": "the user is signed in", "when": "the user performs the requested action", "then": "the system responds successfully"},
            {"given": "the input is invalid", "when": "the user submits it", "then": "the system displays a helpful validation message"}
        ],
        "story_points": 3,
        "complexity_reason": "Demo estimate only. Confirm dependencies and edge cases with the team.",
        "clarity_score": 45 if len(clean.split()) < 12 else 65,
        "is_demo": True
    }

def sprint_advice(velocity: int, committed: int, stories: list[dict]):
    over = committed > velocity
    excess = max(0, committed - velocity)
    ordered = sorted(stories, key=lambda s: {"Low": 0, "Medium": 1, "High": 2, "Critical": 3}.get(s.get("priority", "Medium"), 1))
    suggestions = []
    removed = 0
    for story in ordered:
        if removed >= excess:
            break
        suggestions.append(story["title"])
        removed += story["storyPoints"]
    return {
        "risk": "High" if committed > velocity * 1.25 else ("Moderate" if over else "Low"),
        "velocity": velocity,
        "committed_points": committed,
        "excess_points": excess,
        "suggested_stories_to_reconsider": suggestions if over else [],
        "recommendation": "Review lower-priority work with the team before sprint start." if over else "Commitment is within the historical velocity reference.",
        "is_demo": True
    }

def blocker_help(error: str, context: str):
    result = _ask_json(
        "You are a careful developer troubleshooting assistant. Return JSON with keys: "
        "likely_root_causes (array of strings), troubleshooting_steps (array of strings), "
        "safety_note (string). Do not claim certainty from limited logs.",
        f"Task context: {context}\nError: {error}"
    )
    if result:
        result["is_demo"] = False
        return result
    lower = error.lower()
    causes = ["The error may be caused by a configuration mismatch or missing dependency."]
    if "mongo" in lower or "database" in lower:
        causes = ["MongoDB may be unreachable.", "The connection string or database credentials may be incorrect."]
    elif "401" in lower or "token" in lower or "jwt" in lower:
        causes = ["The authentication token may be missing, expired, or invalid."]
    elif "module" in lower or "import" in lower:
        causes = ["A package may be missing or the import path may be incorrect."]
    return {
        "likely_root_causes": causes,
        "troubleshooting_steps": [
            "Read the complete error message and identify the first application stack-trace line.",
            "Verify environment variables and service availability.",
            "Reproduce the issue with the smallest possible input.",
            "Apply one change at a time and rerun the failing operation."
        ],
        "safety_note": "Demo guidance only. Verify against logs and official documentation before changing production systems.",
        "is_demo": True
    }
