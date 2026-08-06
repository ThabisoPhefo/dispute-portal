# syntax=docker/dockerfile:1
# Build context must be the monorepo root: `docker build -f apps/frontend/Dockerfile .`

# ── Stage 1: install dependencies ─────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared-types/package.json ./packages/shared-types/
RUN npm ci

# ── Stage 2: build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# Copy the whole deps output (root node_modules AND any workspace-nested
# node_modules — npm workspaces don't always hoist every bin to the root)
# before overlaying real source.
COPY --from=deps /app ./
COPY packages/shared-types ./packages/shared-types
COPY apps/frontend ./apps/frontend

# VITE_API_URL is injected at build time so the browser bundle knows the API URL
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build -w apps/frontend

# ── Stage 3: production runtime (nginx) ───────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Copy the compiled static assets
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Use the project-specific nginx config
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
