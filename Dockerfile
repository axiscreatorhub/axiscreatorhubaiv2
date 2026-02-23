# ---- Build stage ----
FROM node:20-bookworm-slim AS build
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build frontend + prisma
RUN npm run build

# ---- Run stage ----
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install runtime deps (include tsx so we can run server.ts)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built assets + runtime files
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.ts ./server.ts
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 8080

# Run TypeScript server safely
CMD ["npx", "tsx", "server.ts"]
