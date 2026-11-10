# API contracts (Phase 1)

Base URL: `http://localhost:5000/api`
All JSON responses use `{ "success": boolean, "message"?: string, "data"?: any }`.
Errors use `{ "success": false, "message": "..." }`.

## Authentication
- `POST /auth/register` body: `{ "name": string, "email": string, "password": string }`
- `POST /auth/login` body: `{ "email": string, "password": string }`
- `GET /auth/me` requires `Authorization: Bearer <JWT>`

Registration always assigns `Developer`; never accept a role from the public request body.

## Projects
- `GET /projects` — authenticated user's projects
- `POST /projects` body: `{ "name": string, "description"?: string }`
- `GET /projects/:projectId`

## Stories
- `GET /projects/:projectId/stories`
- `POST /projects/:projectId/stories` body:
  `{ "title": string, "description"?: string, "priority"?: "Low"|"Medium"|"High"|"Critical", "storyPoints"?: number }`
- `PATCH /stories/:storyId/status` body:
  `{ "status": "To Do"|"In Progress"|"Code Review"|"Done" }`

## Analytics
- `GET /projects/:projectId/analytics/summary`
Returns `{ totalStories, completedStories, completionRate, pointsCommitted, pointsCompleted, statusCounts }`.
Phase 1 uses deterministic calculations from stored stories. Historical sprint velocity/burndown will be added when sprint records exist.

## AI
- `POST /ai/estimate-story` body: `{ "rawRequirement": string }`
- `POST /ai/sprint-advisor` body: `{ "velocity": number, "committedPoints": number, "stories": [{ "title": string, "storyPoints": number, "priority": string }] }`
- `POST /ai/blocker-assistant` body: `{ "errorMessage": string, "taskContext"?: string }`

The Express backend proxies these requests to the private FastAPI service. The AI response is a suggestion only and must be reviewed by a human.
