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

COPY --from=deps /app/node_modules ./node_modules
COPY packages/shared-types ./packages/shared-types
COPY apps/backend ./apps/backend
COPY package.json ./

# Generate the Prisma client (output lands inside node_modules/.prisma)
RUN cd apps/backend && npx prisma generate

# Compile TypeScript → dist/
RUN npm run build -w apps/backend

# ── Stage 3: production runtime ───────────────────────────────────────────────
FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Re-install production dependencies only (smaller image)
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared-types/package.json ./packages/shared-types/
RUN npm ci --omit=dev

# Copy compiled app and Prisma schema (needed for `prisma migrate deploy`)
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
# Copy the generated Prisma client into production node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3001

# Run pending migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy --schema=apps/backend/prisma/schema.prisma && node apps/backend/dist/index.js"]
