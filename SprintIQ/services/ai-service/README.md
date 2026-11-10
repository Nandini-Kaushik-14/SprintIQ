# SprintIQ AI service

FastAPI service owned by Mahak Bansal. The Express API calls this service internally; the React app must not call it directly.

Run:
```bash
python -m venv .venv
# activate the virtual environment
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Set `OPENAI_API_KEY` in the local `.env` to enable model-generated output. Without a key, deterministic demo responses are returned and marked `is_demo: true`.
Never commit the key. Validate all model output before persisting it. Human review is required before AI-generated stories are added to the backlog.
