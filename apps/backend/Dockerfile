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

COPY --from=deps /app ./
COPY packages/shared-types ./packages/shared-types
COPY apps/backend ./apps/backend

# Generate the Prisma client.
RUN npm run db:generate

# Compile TypeScript → dist/
RUN npm run build -w apps/backend

# ── Stage 3: production runtime ───────────────────────────────────────────────
FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy the full builder output as-is — `prisma migrate deploy` at container
# start needs the Prisma CLI, which is a devDependency and would be
# stripped out by a `--omit=dev` reinstall.
COPY --from=builder /app ./

EXPOSE 3001

# Run pending migrations then start the server.
CMD ["sh", "-c", "npm run db:migrate:deploy && node apps/backend/dist/index.js"]
