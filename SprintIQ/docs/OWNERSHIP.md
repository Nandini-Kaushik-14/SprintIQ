# Team ownership and file boundaries

| Member | Primary responsibility | Main folders |
|---|---|---|
| Prachi Agarwal | Frontend + UI/UX | `apps/web/src/` |
| Ayushi Jain | Backend + REST APIs | `apps/api/src/routes/`, `controllers/`, `services/` (except auth/db-owned files) |
| Nandini Kaushik | Database + Authentication + Security | `apps/api/src/models/`, `middleware/`, `config/`, `utils/auth.js` |
| Mahak Bansal | AI/NLP | `services/ai-service/` |
| Mahak Goyal | Analytics + Testing + DevOps/Deployment | `apps/api/src/modules/analytics/`, tests, `.github/`, deployment files and monitoring docs |

## Shared files: coordinate before editing
- `docs/API_CONTRACTS.md`
- `apps/api/src/app.js`
- `apps/api/src/server.js`
- root README and environment templates
- package manifests and CI workflows

## Integration rule
A member should create a feature branch, commit only their owned files where practical, open a pull request,
and request review from the owner of any shared file they changed. Avoid multiple members editing the same
large file. Add new routes/controllers/modules in separate files and register them through a small agreed
integration point.

## Definition of done for each feature
- Runs locally using the documented commands.
- Uses the agreed API contract and environment variables.
- Validates input and handles errors.
- Does not expose secrets or bypass authentication.
- Includes at least one relevant test or a documented manual test.
- PR description states files changed, how to test, and known limitations.
