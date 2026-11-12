# SprintIQ — AI-Assisted Agile Project Management Platform

A starter monorepo for the SprintIQ final-year project. It establishes the shared architecture,
folder ownership, environment conventions, API contracts, and a small working vertical slice.

## Technology
- Frontend: React + Vite + JavaScript + Tailwind CSS + Recharts
- Backend: Node.js 18+ + Express + Mongoose
- Database: MongoDB / MongoDB Atlas
- Authentication: bcrypt + JWT + role-based access control
- AI service: Python + FastAPI + OpenAI API (mock responses when no API key is configured)
- Quality/deployment: Jest + Supertest, GitHub Actions, Docker-ready service boundaries

## Repository layout
```text
SprintIQ/
├── apps/
│   ├── web/                 # Prachi: React UI, pages, components
│   └── api/                 # Ayushi: Express routes/controllers/business logic
├── services/
│   └── ai-service/          # Mahak Bansal: Python/FastAPI and LLM prompts
├── docs/
│   ├── API_CONTRACTS.md
│   ├── DATABASE_SCHEMA.md   # Nandini Kaushik : Database, Mongoose
│   ├── GIT_WORKFLOW.md
│   └── OWNERSHIP.md
├── .github/workflows/       # Mahak Goyal: CI checks
├── .env.example
└── .gitignore
```

## Before starting
1. Install Node.js 18 or later, Git, and Python 3.10+.
2. Copy `.env.example` to `apps/api/.env` and `services/ai-service/.env` as needed.
3. Create a MongoDB database (local MongoDB or MongoDB Atlas) and set `MONGO_URI`.
4. Never commit `.env` files, API keys, JWT secrets, database credentials, or real user data.

## Run locally

### 1. Backend API
```bash
cd apps/api
npm install
cp .env.example .env
npm run dev
```
API: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

### 2. AI service
```bash
cd services/ai-service
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```
AI health check: `http://localhost:8000/health`
If `OPENAI_API_KEY` is not configured, the service returns clearly labelled demo/mock responses.

### 3. Frontend
```bash
cd apps/web
npm install
cp .env.example .env
npm run dev
```
Frontend: `http://localhost:5173`

## First test flow
1. Start MongoDB.
2. Start the API and AI service.
3. Start the frontend.
4. Register a user. The first user can be assigned `Admin` only through a controlled seed/admin process; public registration defaults to `Developer`.
5. Log in, create a project, and add a story.
6. Move a story between board columns. Use the AI estimate form to call the AI service through the backend.

## Important project rules
- All browser-to-server requests go through `/api`; the browser must not connect to MongoDB or OpenAI.
- The Express API is the single public API boundary. It calls the private AI service server-to-server.
- Keep request/response shapes in `docs/API_CONTRACTS.md` stable. Discuss contract changes before changing them.
- Keep database models in `apps/api/src/models`; do not define duplicate Mongoose models in controllers.
- Use feature branches and pull requests. Do not work directly on `main`.
- All AI suggestions are drafts. A human must review and approve them before they become project records.
- Story-point estimates and sprint risk outputs are advisory, not guaranteed predictions.

## Current scope
This is a Phase 1 starter foundation, not the complete approved project. It includes a basic auth/project/story workflow, board status updates, basic analytics, and AI endpoint scaffolding. Epics, full sprint lifecycle, bugs, retrospectives, richer RBAC/project membership, audit logs, and production deployment hardening can be added incrementally.
