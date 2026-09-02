# Proyecto Sistemas Paralelos — SysLab 2.0

## Descripción
Entorno multi-contenedor (Backend, Frontend, PostgreSQL) con Prisma ORM
e integración de agente de IA con skills y reglas propias, aplicando
la arquitectura del sistema SysLab 2.0.

## Requisitos
- Docker y Docker Compose
- Node.js 18+

## Ejecución
\`\`\`bash
docker compose up --build -d
docker compose exec backend npx prisma migrate dev --name init
docker compose exec backend node prisma/seed.js
\`\`\`

## Estructura del proyecto
- /backend — API Node.js/Express + Prisma ORM
- /frontend — Cliente web (Vite)
- /agente — Skills de TasteSkill, skills personalizadas y reglas (rules.md)

## Endpoints principales
- GET /api/health — estado del backend y conexión a base de datos
- GET /api/usuarios — listado de usuarios registrados

## Autor
Isaias Edmundo Armella — RU: E115862
Materia: Sistemas Paralelos — Docente: Ing. Elias Cassal Baldiviezo
