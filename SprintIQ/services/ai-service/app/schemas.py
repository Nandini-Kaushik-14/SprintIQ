from pydantic import BaseModel, Field
from typing import Literal

class EstimateRequest(BaseModel):
    rawRequirement: str = Field(min_length=8, max_length=4000)

class AcceptanceCriterion(BaseModel):
    given: str
    when: str
    then: str

class EstimateResponse(BaseModel):
    title: str
    user_story: str
    acceptance_criteria: list[AcceptanceCriterion]
    story_points: Literal[0, 1, 2, 3, 5, 8, 13]
    complexity_reason: str
    clarity_score: int = Field(ge=0, le=100)
    is_demo: bool = False

class SprintStory(BaseModel):
    title: str
    storyPoints: int = Field(ge=0, le=100)
    priority: str = "Medium"

class SprintAdvisorRequest(BaseModel):
    velocity: int = Field(ge=0, le=10000)
    committedPoints: int = Field(ge=0, le=10000)
    stories: list[SprintStory] = []

class BlockerRequest(BaseModel):
    errorMessage: str = Field(min_length=3, max_length=4000)
    taskContext: str = Field(default="", max_length=2000)
