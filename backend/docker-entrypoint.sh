#!/bin/sh
set -e

echo ">>> Sincronizando esquema con la base de datos (prisma db push)"
npx prisma db push --skip-generate

echo ">>> Ejecutando seed idempotente"
npx prisma db seed

echo ">>> Iniciando backend"
exec node dist/server.js