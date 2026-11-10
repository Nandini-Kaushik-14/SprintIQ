from fastapi import FastAPI
from dotenv import load_dotenv
from .schemas import EstimateRequest, SprintAdvisorRequest, BlockerRequest
from .ai_logic import estimate_story, sprint_advice, blocker_help

load_dotenv()
app = FastAPI(title="SprintIQ AI Service", version="0.1.0")

@app.get("/health")
def health():
    return {"success": True, "service": "SprintIQ AI Service"}

@app.post("/estimate-story")
def estimate(payload: EstimateRequest):
    return estimate_story(payload.rawRequirement)

@app.post("/sprint-advisor")
def advisor(payload: SprintAdvisorRequest):
    return sprint_advice(payload.velocity, payload.committedPoints, [s.model_dump() for s in payload.stories])

@app.post("/blocker-assistant")
def blocker(payload: BlockerRequest):
    return blocker_help(payload.errorMessage, payload.taskContext)
