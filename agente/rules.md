# Reglas del Agente de IA — Arquitectura Panaderia_Syslab2.0

> Documento normativo que gobierna el comportamiento del agente de IA al
> generar, modificar o revisar código del **backend** y de la **capa de
> persistencia** de este proyecto.
> Materia: PanaderiaSyslab2.0 — Docente: Ing. Elias Cassal Baldiviezo

---

## 1. Principios generales

1. **Idioma:** todo el código, comentarios, mensajes de commit y documentación se escriben en **español**.
2. **Nunca inventar datos.** Si falta información del dominio, el agente debe preguntar antes de generar código.
3. **No romper contratos existentes.** Antes de modificar un endpoint o modelo, revisar quién lo consume.
4. **Cambios mínimos y verificables.** Una tarea = un cambio coherente = un commit.
5. **Prohibido exponer secretos.** Ninguna credencial, contraseña o token puede quedar escrita en el código fuente; siempre se leen desde variables de entorno.

---

## 2. Arquitectura por capas (Panaderia_Syslab2.0)

El backend respeta una separación estricta de responsabilidades. El flujo de una petición es **unidireccional**:

```
HTTP → routes → controllers → services → repositories → Prisma → PostgreSQL
```

| Capa | Carpeta | Responsabilidad | Prohibiciones |
|---|---|---|---|
| Rutas | `src/routes/` | Declarar endpoints y aplicar middlewares | No contiene lógica de negocio |
| Controladores | `src/controllers/` | Validar entrada, invocar servicios, formar respuesta HTTP | No accede a Prisma directamente |
| Servicios | `src/services/` | Reglas de negocio, orquestación, transacciones | No conoce `req` ni `res` |
| Repositorios | `src/repositories/` | Único punto de acceso a Prisma | No aplica reglas de negocio |
| Configuración | `src/config/` | Cliente Prisma, variables de entorno | — |

**Regla dura:** `PrismaClient` solo puede importarse en `src/config/` y en `src/repositories/`. Si el agente detecta un `import` de Prisma en un controlador, debe refactorizarlo.

---

## 3. Reglas de persistencia (Prisma + PostgreSQL)

1. **Proveedor obligatorio:** `postgresql`. No se acepta SQLite ni MySQL.
2. **Nomenclatura:**
   - Modelos en **PascalCase singular** (`Usuario`, `Laboratorio`, `Reserva`).
   - Campos en **camelCase** (`fechaInicio`, `laboratorioId`).
   - Tablas y columnas físicas en **snake_case** vía `@@map` y `@map`.
3. **Todo modelo debe tener** `id` autoincremental y campo de auditoría `creadoEn`.
4. **Relaciones:** siempre declarar `onDelete` de forma explícita.
5. **Índices:** toda clave foránea y todo campo usado en filtros frecuentes lleva `@@index`.
6. **Enums** para estados cerrados (`EstadoEquipo`, `EstadoReserva`) — nunca strings libres.
7. **Migraciones:** el esquema se cambia únicamente con `npx prisma migrate dev --name <descripcion>`. Está prohibido ejecutar `ALTER TABLE` manual.
8. **Nunca** usar `prisma migrate reset` ni `db push --force-reset` sobre datos que no sean de desarrollo local.
9. **Seed idempotente:** `prisma/seed.js` debe poder ejecutarse varias veces sin duplicar registros (usar `upsert` o verificar existencia).
10. **Contraseñas** siempre almacenadas con hash (`bcryptjs`), nunca en texto plano.

---

## 4. Reglas de API

1. Prefijo obligatorio: `/api`.
2. Recursos en **plural** (`/api/usuarios`, `/api/laboratorios`, `/api/reservas`).
3. Códigos de estado correctos: `200` OK, `201` creado, `400` entrada inválida, `401` sin autenticar, `403` sin permiso, `404` no encontrado, `409` conflicto, `500` error interno.
4. Endpoint `/api/health` obligatorio; debe verificar la conexión real a la base de datos.
5. Los errores se devuelven con forma uniforme: `{ "error": "mensaje legible" }`. Nunca se filtra el stack trace al cliente.
6. Toda entrada del cliente se valida antes de llegar a la capa de servicios.

---

## 5. Reglas de contenedores

1. Dentro de la red de Docker los servicios se referencian por **nombre de servicio** (`db`, `backend`), nunca por `localhost`.
2. `depends_on` con `condition: service_healthy` para que el backend no arranque antes que PostgreSQL.
3. Los datos de PostgreSQL persisten en un **volumen nombrado** (`postgres_data`).
4. Cada servicio expone sus puertos de forma explícita: db `5432`, backend `4000`, frontend `5173`.
5. `node_modules` nunca se copia desde el host: se declara como volumen anónimo.

---

## 6. Reglas de variables de entorno

1. Cada carpeta tiene su propio archivo: `./.env` (raíz, para Compose), `./backend/.env`, `./frontend/.env`.
2. Todo archivo `.env` va acompañado de un `.env.example` **sin valores reales**, que sí se sube al repositorio.
3. Los `.env` reales están listados en `.gitignore`. **Jamás se commitean.**
4. En el frontend, solo las variables con prefijo `VITE_` llegan al navegador; por lo tanto **ningún secreto** puede llevar ese prefijo.

---

## 7. Reglas de control de versiones

1. Convención obligatoria: **Conventional Commits** en español.
2. Prefijos permitidos: `feat`, `fix`, `docs`, `chore`.
3. Formato: `tipo(alcance): descripcion en minusculas y en presente`.
4. Un commit no puede mezclar propósitos distintos (por ejemplo, esquema de base de datos + documentación).
5. Prohibido para el agente: `git push --force`, `git reset --hard` y `git clean -f` sin autorización explícita.

---

## 8. Límites del agente

El agente **no debe** hacer nada de lo siguiente sin confirmación del desarrollador:

- Borrar migraciones, volúmenes o bases de datos.
- Cambiar el proveedor de base de datos.
- Añadir dependencias nuevas sin versión fijada.
- Reescribir historial de Git.
- Modificar archivos `.env` reales.
- Desactivar autenticación, CORS o validaciones existentes.
