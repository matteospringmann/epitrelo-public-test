# --- build deps & app ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- runtime image ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma
RUN npx prisma generate

# Lancement
CMD sh -c "npx prisma migrate deploy && node src/index.js"
EXPOSE 4000
