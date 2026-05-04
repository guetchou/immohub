# ── Stage 1 : build frontend Vite ────────────────────────────────────────────
FROM node:20-bookworm-slim AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# ── Stage 2 : backend runtime Node + SQLite ──────────────────────────────────
FROM node:20-bookworm-slim AS backend

# Outils de compilation pour better-sqlite3 (natif)
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dépendances backend uniquement
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Code source backend
COPY server ./server

# Frontend buildé depuis le stage précédent
COPY --from=frontend /app/dist ./dist

WORKDIR /app/server

ENV NODE_ENV=production
ENV PORT=3011
ENV DATABASE_PATH=/data/immohub.sqlite
ENV STATIC_DIR=/app/dist

EXPOSE 3011

CMD ["node", "src/index.js"]
