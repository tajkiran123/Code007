# Multi-stage Docker Build for WorkQuest AI

# Stage 1: Build Frontend Next.js Client
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Build Express Backend Server
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build

# Stage 3: Runner container
FROM node:20-alpine AS runner
WORKDIR /app

# Copy Backend artifacts
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy Frontend static export or next workspace
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/package*.json ./
COPY --from=frontend-builder /app/node_modules ./node_modules

EXPOSE 3000
EXPOSE 5000

CMD ["sh", "-c", "node backend/dist/server.js & npm run start"]
