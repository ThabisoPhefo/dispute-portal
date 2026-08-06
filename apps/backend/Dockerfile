# syntax=docker/dockerfile:1
# Build context must be the monorepo root: `docker build -f apps/backend/Dockerfile .`

# ── Stage 1: install dependencies ─────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

# Copy manifests only — this layer is cached until a package.json changes
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared-types/package.json ./packages/shared-types/
RUN npm ci

# ── Stage 2: build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# Copy the whole deps output (root node_modules AND any workspace-nested
# node_modules, e.g. apps/backend/node_modules/.bin/prisma — npm workspaces
# don't always hoist every bin to the root) before overlaying real source.
COPY --from=deps /app ./
COPY packages/shared-types ./packages/shared-types
COPY apps/backend ./apps/backend

# Generate the Prisma client (output lands inside node_modules/.prisma)
RUN cd apps/backend && npx prisma generate

# Compile TypeScript → dist/
RUN npm run build -w apps/backend

# ── Stage 3: production runtime ───────────────────────────────────────────────
FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy the full builder output as-is. npm workspaces nest some packages
# (e.g. the Prisma CLI/client) under apps/backend/node_modules instead of
# hoisting to the root, so a partial re-install/copy is error-prone — and
# `prisma migrate deploy` at container start needs the (devDependency)
# Prisma CLI anyway, which a `--omit=dev` install would strip out.
COPY --from=builder /app ./

EXPOSE 3001

# Run pending migrations then start the server.
# `cd` first: the Prisma CLI bin is nested under apps/backend/node_modules
# (npm workspaces don't hoist it to the root), and npx only searches upward
# from cwd, not into subdirectories.
CMD ["sh", "-c", "cd apps/backend && npx prisma migrate deploy && node dist/index.js"]
