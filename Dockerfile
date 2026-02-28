# Multi-stage build for optimized image
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Frontend (Vite)
RUN npm run build

# Build Backend (TSC)
RUN npx tsc -p tsconfig.server.json

# --- Production Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client again for production environment
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start command: Run migrations then start server
CMD npx prisma migrate deploy && node dist-server/server.js
