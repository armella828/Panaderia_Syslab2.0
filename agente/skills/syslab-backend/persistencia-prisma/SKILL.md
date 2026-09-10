---
nombre: persistencia-prisma
descripcion: Disena y modifica el esquema de Prisma sobre PostgreSQL segun las convenciones de Panaderia_Syslab2.0, y genera migraciones y scripts de seed idempotentes. Usar al agregar modelos, campos, relaciones o al poblar datos iniciales.
version: 1.0.0
autor: Grupo PanaderiaSyslab2.0
---

# Skill: Persistencia con Prisma ORM

## Cuando usar esta skill

- Se agrega o modifica un modelo, campo o relacion en `schema.prisma`.
- Se necesita crear o ampliar `prisma/seed.js`.
- Aparecen errores de migracion o de conexion a PostgreSQL.

## Convenciones de modelado

| Elemento | Convencion | Ejemplo |
|---|---|---|
| Modelo | PascalCase singular | `Laboratorio` |
| Campo | camelCase | `fechaInicio` |
| Tabla fisica | snake_case plural via `@@map` | `@@map("laboratorios")` |
| Columna fisica | snake_case via `@map` | `@map("fecha_inicio")` |
| Clave primaria | `id Int @id @default(autoincrement())` | — |
| Auditoria | `creadoEn DateTime @default(now())` | — |
| Estados | `enum`, nunca `String` libre | `EstadoReserva` |

Reglas adicionales:

- Toda relacion declara `onDelete` explicitamente.
- Toda clave foranea lleva `@@index`.
- Los campos de texto acotados usan `@db.VarChar(n)`.
- Los campos unicos de negocio llevan `@unique` (email, codigo interno).

## Comandos autorizados

```bash
# Generar el cliente tras cambiar el esquema
docker compose exec backend npx prisma generate

# Crear y aplicar una migracion
docker compose exec backend npx prisma migrate dev --name descripcion_corta

# Poblar datos iniciales
docker compose exec backend node prisma/seed.js

# Inspeccionar datos
docker compose exec backend npx prisma studio
```

## Comandos PROHIBIDOS sin autorizacion expresa

```bash
npx prisma migrate reset      # destruye todos los datos
npx prisma db push --force-reset
docker compose down -v        # elimina el volumen de PostgreSQL
```

## Reglas del seed

1. Debe ser **idempotente**: usar `upsert` sobre un campo `@unique`, o verificar con `count()` antes de `createMany`.
2. Las contrasenas se guardan con `bcrypt.hash(clave, 10)`.
3. Se puebla respetando el orden de dependencias: usuarios y laboratorios primero, luego equipos, al final reservas.
4. Debe imprimir un resumen legible de lo insertado.

## Diagnostico de fallos frecuentes

| Sintoma | Causa | Solucion |
|---|---|---|
| `Can't reach database server at db:5432` | El backend arranco antes que PostgreSQL | Usar `depends_on` con `service_healthy` |
| `Environment variable not found: DATABASE_URL` | Falta `.env` en `backend/` | Copiar `.env.example` a `.env` |
| `authentication failed for user` | Credenciales distintas entre `.env` raiz y `backend/.env` | Unificar usuario, clave y base |
| `PrismaClientInitializationError` sobre OpenSSL | Imagen Alpine sin OpenSSL | `apk add --no-cache openssl` en el Dockerfile |
