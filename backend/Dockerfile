# Panaderia_Syslab2.0 - Imagen de produccion del Backend
# Etapa 1: compilacion de TypeScript y generacion del cliente Prisma
FROM node:20-alpine AS build

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

ENV DATABASE_URL="postgresql://usuario:contrasena@localhost:5432/panaderia_db?schema=public"

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

COPY . .
RUN npm run build

# Etapa 2: entorno de ejecucion minimo
FROM node:20-alpine AS runtime

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./
COPY --from=build /app/src/generated ./src/generated
COPY --from=build /app/package.json ./
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["docker-entrypoint.sh"]