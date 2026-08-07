# Dispute Portal

A transactions dispute portal: customers file claims against card transactions; staff can review and update claim status.

| Package | Stack |
|---|---|
| `apps/frontend` | React, Vite, TanStack Query |
| `apps/backend` | Express, Prisma, PostgreSQL |
| `packages/shared-types` | Shared Zod schemas / TypeScript types |

---

## Quick start (Docker) — recommended for reviewers

**You only need Docker Desktop.** No local Node or Postgres install required.

### 1. Clone

```bash
git clone https://github.com/ThabisoPhefo/dispute-portal.git
cd dispute-portal
```

### 2. Build and run

```bash
docker compose up --build
```

Wait until you see the backend log: `API listening on http://localhost:3001`.

### 3. Seed sample data

In a **second** terminal (from the same repo folder):

```bash
docker compose exec backend sh -c "npx tsx apps/backend/prisma/seed.ts"
```

You should see: `Upserted 25 transactions and 4 sample disputes...`

### 4. Open the app

- **UI:** [http://localhost](http://localhost)
- **API:** [http://localhost:3001/api/health](http://localhost:3001/api/health) → `{"ok":true}`

### 5. Stop

```bash
docker compose down
```

Ports used: **80** (UI), **3001** (API), **5433** (Postgres on the host). Free those ports before starting.

---

## How to test

Requires Node.js 22+. The backend tests need a real, migrated Postgres to connect to — pick **one** of the two setups below before running `npm test`.

**Option A — using the Docker Postgres** (from the Quick start above; the stack can stay running):

```bash
echo "DATABASE_URL=postgresql://postgres:password@localhost:5433/dispute_portal" > apps/backend/.env
```

**Option B — using local Postgres** (see [Local development](#local-development-optional) below for full setup):

```bash
cp apps/backend/.env.example apps/backend/.env
# then edit DATABASE_URL in that file for your machine
```

Then, from the repo root:

```bash
npm install
npm run db:generate
npm test
npm run typecheck
```

- `npm test` — backend API tests (needs the `DATABASE_URL` set above) + frontend unit tests
- `npm run typecheck` — TypeScript check across workspaces
- `npm run lint -w apps/frontend` — frontend lint (there's no backend lint config yet, so skip a root-level `npm run lint`)

---

## What you can do in the UI

- Browse transactions and file a dispute (reason + description)
- View / manage your claims (including cancel)
- Staff page: update dispute status (`OPEN` → `UNDER_REVIEW` / `APPROVED` / `REJECTED` / `CANCELLED`)

---

## Local development (optional)

Use this for day-to-day coding with hot reload. Reviewers can ignore this section.

### Prerequisites

- Node.js 22+
- PostgreSQL running locally
- Git

### Setup

```bash
git clone https://github.com/ThabisoPhefo/dispute-portal.git
cd dispute-portal
npm install

cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

Edit `apps/backend/.env`:

```env
DATABASE_URL=postgresql://YOUR_OS_USERNAME@localhost:5432/dispute_portal
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

Edit `apps/frontend/.env`:

```env
VITE_USE_MSW=false
```

(`true` = mock API in the browser, no backend needed.)

Create DB, generate the Prisma client, migrate, seed:

```bash
createdb dispute_portal
npm run db:generate
cd apps/backend && npx prisma migrate deploy && npx prisma db seed && cd ../..
```

Start (two terminals):

```bash
npm run dev:backend
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173).

Do **not** run local `npm run dev:*` and `docker compose up` at the same time — both want port **3001**.

---

## Useful scripts

| Command | Description |
|---|---|
| `docker compose up --build` | Full stack in Docker |
| `npm run dev:backend` | Local API on `:3001` |
| `npm run dev:frontend` | Local UI on `:5173` |
| `npm test` | Run tests |
| `npm run typecheck` | Typecheck all workspaces |
| `npm run db:generate` | (Re)generate the Prisma client |
| `npm run db:seed -w apps/backend` | Re-seed local Postgres |

---

## Project layout

```
apps/frontend/          React UI
apps/backend/           Express API + Prisma
packages/shared-types/  Shared Zod contracts
docker-compose.yml      Postgres + backend + frontend
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Empty UI after Docker start | Run the seed command (step 3 above) |
| `port is already allocated` | Stop local `npm run dev:*`, or free ports 80 / 3001 / 5433 |
| Vite `ECONNREFUSED` / proxy errors | Backend isn’t running — start `npm run dev:backend` (local mode) |
| Prisma connection errors (local) | Check `DATABASE_URL` username; confirm Postgres is up (`brew services list`) |
| Created disputes “vanished” | Restarting the server does **not** wipe data. Re-seeding used to wipe; current seed **upserts** and keeps user-created disputes |
