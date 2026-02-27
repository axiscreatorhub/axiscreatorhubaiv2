# =========================
# 1) Build stage
# =========================
FROM node:20-slim AS build
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client (safe at build time)
RUN npx prisma generate

# Build frontend (Vite -> dist)
RUN npm run build

# Compile server.ts -> server.js
RUN npx tsc server.ts \
  --target ES2022 \
  --module commonjs \
  --moduleResolution node \
  --esModuleInterop \
  --skipLibCheck \
  --outDir /app


# =========================
# 2) Runtime stage
# =========================
FROM node:20-slim
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built assets + compiled server
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js

CMD ["node", "server.js"]
