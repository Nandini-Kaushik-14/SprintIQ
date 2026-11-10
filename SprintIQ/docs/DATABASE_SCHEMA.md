# Initial database schema

Mongoose models are owned by Nandini. Keep schema definitions in `apps/api/src/models/`.

## User
- `name`, `email` (unique, normalized), `password` (bcrypt hash), `role` (`Admin`, `Scrum Master`, `Developer`)
- timestamps

## Project
- `name`, `description`, `owner` (User ObjectId)
- timestamps

## Story
- `project` (Project ObjectId), `title`, `description`
- `acceptanceCriteria` (array of strings)
- `priority` (`Low`, `Medium`, `High`, `Critical`)
- `storyPoints` (0, 1, 2, 3, 5, 8, 13)
- `status` (`To Do`, `In Progress`, `Code Review`, `Done`)
- `createdBy` (User ObjectId)
- timestamps

## Planned next models
Epic, Sprint, Task, Bug, Retrospective, ProjectMembership and AuditLog.
Do not add all planned models prematurely; agree on each model's fields and relationships before implementation.
