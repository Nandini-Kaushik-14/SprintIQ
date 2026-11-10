# Git and GitHub workflow

## One repository
All members work in the same `SprintIQ` repository. Do not create five copies of the repository as separate projects.

## Branch naming
- `feature/frontend-login`
- `feature/api-stories`
- `feature/database-auth`
- `feature/ai-story-estimator`
- `feature/analytics-dashboard`
- `fix/<short-description>`

## Daily workflow
```bash
git clone <repository-url>
cd SprintIQ
git checkout -b feature/<your-task>
# edit only your assigned area
git status
git add <your-owned-files>
git commit -m "feat: add <feature>"
git push -u origin feature/<your-task>
```
Open a Pull Request into `main`. Do not force-push shared branches or commit directly to `main`.

## Avoiding conflicts
1. Pull the latest `main` before creating a branch.
2. Keep ownership boundaries from `OWNERSHIP.md`.
3. Do not edit shared configuration files without informing the team.
4. Prefer one file per route/controller/component over one giant file.
5. Keep API request and response formats stable.
6. Resolve conflicts locally, run tests, then push.

## Suggested GitHub protection
Enable a pull request requirement for `main`, require at least one reviewer, and prevent force pushes.
