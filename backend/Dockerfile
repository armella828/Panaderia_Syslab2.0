# Panaderia_Syslab2.0 - Imagen del Backend
FROM node:20-alpine

# Dependencias del sistema requeridas por Prisma (OpenSSL)
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Instalar dependencias primero (aprovecha la cache de capas)
COPY package*.json ./
RUN npm install

# Copiar el esquema y generar el cliente de Prisma
COPY prisma ./prisma
RUN npx prisma generate

# Copiar el resto del codigo fuente
COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
