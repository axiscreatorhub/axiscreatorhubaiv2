FROM node:20-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js
# If you compile server to dist instead, adjust to dist/server.js

ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]
