# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared-types/package.json ./packages/shared-types/
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app ./
COPY packages/shared-types ./packages/shared-types
COPY apps/backend ./apps/backend

RUN npm run db:generate
RUN npm run build -w apps/backend

FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3001

CMD ["sh", "-c", "npm run db:migrate:deploy && node apps/backend/dist/index.js"]
