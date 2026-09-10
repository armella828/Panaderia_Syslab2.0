---
nombre: prisma-postgresql
descripcion: Skill base descargada de TasteSkill. Asiste en el modelado de datos con Prisma ORM sobre PostgreSQL, generacion de migraciones y consultas tipadas.
version: 1.0.0
origen: TasteSkill
---

# Skill base: Prisma + PostgreSQL

Skill de la libreria publica de TasteSkill, instalada como capacidad base del agente.

## Capacidades

- Definicion de `datasource` y `generator` para PostgreSQL.
- Modelado de relaciones uno a muchos y muchos a muchos.
- Generacion y aplicacion de migraciones con `prisma migrate`.
- Consultas con `findMany`, `include`, `select`, `where` y paginacion.
- Transacciones con `prisma.$transaction`.

## Uso tipico

```bash
npx prisma init --datasource-provider postgresql
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio
```

## Nota de integracion

En este proyecto esta skill queda **subordinada** a las reglas de `agente/rules.md`
y a la skill personalizada `panaderia-backend/persistencia-prisma`, que restringe
nomenclatura, indices y comandos permitidos.
