# Dispute Portal

Monorepo for a transactions dispute portal:

- `apps/frontend` — React + Vite + TanStack Query
- `apps/backend` — Express + Prisma + PostgreSQL
- `packages/shared-types` — shared Zod schemas / TypeScript types

## Prerequisites

- **Node.js 22+** and npm
- **PostgreSQL** (local install), **or** Docker Desktop if you prefer Compose
- Git

## Local setup (recommended for reviewers)

This path runs the real backend against Postgres so you see seeded transactions and disputes in the UI.

### 1. Clone and install

```bash
git clone https://github.com/ThabisoPhefo/dispute-portal.git
cd dispute-portal
npm install
```

### 2. Configure environment files

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

**Backend** (`apps/backend/.env`) — set `DATABASE_URL` for your machine:

```env
# macOS / Linux with Homebrew Postgres (replace USER with your OS username)
DATABASE_URL=postgresql://USER@localhost:5432/dispute_portal

PORT=3001
CORS_ORIGIN=http://localhost:5173
```

**Frontend** (`apps/frontend/.env`) — use the real API (not mocks):

```env
VITE_USE_MSW=false
```

> If `VITE_USE_MSW` is left as `true`, the UI uses in-browser mock data and will not hit the backend.

### 3. Create database, migrate, and seed

Make sure Postgres is running, then:

```bash
createdb dispute_portal
cd apps/backend
npx prisma migrate deploy
npx prisma db seed
cd ../..
```

You should see something like: `Upserted 25 transactions and 4 sample disputes...`.

The seed uses upserts (not a full wipe), so disputes you create in the UI are kept if you re-seed later.

### 4. Start the app

Use two terminals from the repo root:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

Open the URL Vite prints (usually [http://localhost:5173](http://localhost:5173)).

### 5. Sanity check

```bash
curl http://localhost:3001/api/health
# {"ok":true}

curl http://localhost:3001/api/transactions
# JSON array of seeded transactions
```

In the UI you should see transactions on the home / dispute flow, and disputes on the Disputes and Staff pages.

## Frontend-only (mock data)

If you only want to look at UI without Postgres/backend:

1. Set `VITE_USE_MSW=true` in `apps/frontend/.env` (or leave the example default).
2. Run only `npm run dev:frontend`.

## Docker Compose (full stack)

Builds and runs Postgres + backend + frontend:

```bash
docker compose up --build
```

- App: [http://localhost](http://localhost) (nginx on port 80)
- API: [http://localhost:3001](http://localhost:3001)
- Postgres on the host: port **5433** (container still uses 5432 internally)

Migrations run automatically when the backend container starts. Seed the database once:

```bash
docker compose exec backend sh -c "npx tsx apps/backend/prisma/seed.ts"
```

Stop with:

```bash
docker compose down
```

## Useful scripts

| Command | Description |
|---|---|
| `npm run dev:backend` | Start Express API on `:3001` |
| `npm run dev:frontend` | Start Vite on `:5173` |
| `npm run typecheck` | Typecheck all workspaces |
| `npm run lint` | Lint (workspaces that define it) |
| `npm test` | Run tests |
| `npm run db:seed -w apps/backend` | Re-seed sample data |

## Project layout

```
apps/
  frontend/     React UI
  backend/      Express API + Prisma
packages/
  shared-types/ Shared Zod contracts
docker-compose.yml
```

## Troubleshooting

| Symptom | Likely fix |
|---|---|
| Empty transactions / disputes in UI | Seed the DB, or set `VITE_USE_MSW=false` and ensure backend is running |
| Created disputes disappear after seed | Older seed wiped the DB; current seed upserts and keeps user-created disputes. Restarting the backend alone does **not** clear Postgres |
| Vite `http proxy error` / `ECONNREFUSED` | Start `npm run dev:backend` (frontend is proxying `/api` → `:3001`) |
| Prisma connection errors | Check `DATABASE_URL` username/db name; confirm Postgres is running |
| Port 5432 already in use with Docker | Compose uses host port **5433** by design to avoid clashing with local Postgres |
