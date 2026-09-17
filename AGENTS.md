# AGENTS.md

Instrucciones para agentes que trabajan en el proyecto Panaderia_Syslab2.0.

## Reglas para mensajes de commit

- Usar idioma español.
- Respetar los prefijos de tipo:
  - `feat:` — Nuevas características (ej. `feat(backend): agregar modelo de datos en schema.prisma`).
  - `fix:` — Corrección de errores (ej. `fix(docker): corregir puerto de conexión a postgres`).
  - `docs:` — Cambios en la documentación (ej. `docs(readme): agregar instrucciones de ejecución`).
  - `chore:` — Mantenimiento, dependencias o configuración (ej. `chore(agente): instalar skills de tasteskill`).

## Compilación y verificación obligatoria

Después de modificar código, ejecutar la verificación correspondiente:

- Backend: `npm run typecheck` y `npm run build` (en `backend/`).
- Frontend: `npm run build` (en `frontend/`).

## Stack y convenciones

- Backend: Express 4 + TypeScript estricto + Prisma 7, ESM, por capas (repositories → services → controllers → routes). Sin `any`, sin comentarios.
- Frontend: React 18 + TypeScript + Vite + Tailwind v4 + react-router-dom v7 + axios + lucide-react. Context API (sin Redux/Zustand).
- Base de datos: PostgreSQL local (puerto 5432), base `panaderia_db`.
- Credenciales solo en `backend/.env` (gitignoreado). No exponer secretos.
- Preferir "desactivar" (soft delete) sobre borrado físico.

## Archivos de configuración (.env)

Cada carpeta del proyecto debe tener su propia configuración de `.env`:

- `backend/.env` y `backend/.env.example`: PORT, DATABASE_URL, FRONTEND_URL, JWT_SECRET, JWT_EXPIRES_IN.
- `frontend/.env` y `frontend/.env.example`: variables con prefijo VITE_ (ej. VITE_API_URL).

El `.env` real no se sube al repositorio; el `.env.example` sí (es la plantilla).