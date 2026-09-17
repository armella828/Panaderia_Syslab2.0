# Proyecto PanaderiaSyslab2.0 — Panaderia_Syslab2.0

## Descripción
Sistema de administración para una panadería (backend API + frontend web)
con autenticación JWT, control de roles y permisos, y PostgreSQL como base
de datos gestionada con Prisma ORM. Arquitectura del sistema en backend
por capas (repositories → services → controllers → routes) y frontend
con React + TypeScript y Context API.

## Requisitos
- Node.js 18+ (probado con Node 24)
- PostgreSQL 16 local (o Docker para la fase final de orquestación)

## Configuración inicial

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # ajustar DATABASE_URL, JWT_SECRET
npx prisma db push     # crear esquema en PostgreSQL
npx prisma db seed     # datos iniciales (roles, permisos, usuarios, productos...)
npm run dev
```
El backend queda en http://localhost:5000 (base `/api`).

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm run dev
```
El frontend queda en http://localhost:5173.

## Despliegue en Ubuntu (Docker Compose)

Modo producción con tres contenedores: PostgreSQL + backend (Node
compilado) + frontend servido por nginx (con proxy inverso `/api` hacia el
backend, por lo que el frontend usa la URL relativa `/api`).

### Requisitos en el servidor Ubuntu
```bash
sudo apt update && sudo apt install -y git curl
curl -fsSL https://get.docker.com | sudo sh       # instala Docker Engine
sudo usermod -aG docker $USER                     # permisos de docker (re-iniciar sesión)
```

### Puesta en marcha
```bash
git clone https://github.com/armella828/Panaderia_Syslab2.0.git
cd Panaderia_Syslab2.0

cp .env.example .env            # y ajusta POSTGRES_USER, POSTGRES_PASSWORD, JWT_SECRET
nano .env
#    FRONTEND_URL=http://<IP_DEL_SERVIDOR>:5173
#    JWT_SECRET=$(openssl rand -base64 48)   -> genera y pega una clave

docker compose up -d --build
docker compose ps                # 3 servicios arriba: db, backend, frontend
```

El sistema queda en `http://<IP_DEL_SERVIDOR>:5173`. El backend no se
expone al host; se accede a su API solo a través de nginx:
`http://<IP_DEL_SERVIDOR>:5173/api/health`.

### Comandos útiles
```bash
docker compose logs -f backend     # ver logs del backend (db push + seed al arrancar)
docker compose logs -f frontend    # ver logs de nginx
docker compose restart backend     # reiniciar el backend
docker compose down                # detener servicios (sin borrar datos)
docker compose down -v             # detener y BORRAR la base de datos (cuidado)
```

### Notas
- El contenedor `backend` ejecuta al arrancar `prisma db push` y el seed
  idempotente (`prisma db seed`), creadores del esquema y datos iniciales.
- Los datos persisten en el volumen `postgres_data`.
- Credenciales de acceso inicial: ver tabla de abajo (contraseña `123456`).

## Credenciales de desarrollo
Todos los usuarios semilla usan la contraseña **123456**:

| Correo | Rol | Alcance |
|---|---|---|
| admin@panaderia.edu.bo | Administrador | Acceso global (todos los permisos) |
| jefe@panaderia.edu.bo | Jefe de Panadería | Productos, pedidos, inventario, incidencias |
| vendedor@panaderia.edu.bo | Vendedor | Pedidos y clientes (solo lectura de productos) |
| inventario@panaderia.edu.bo | Encargado de Inventario | Productos e inventario |

## Endpoints principales
La API requiere el header `Authorization: Bearer <token>` salvo en el login.
Los permisos se validan por código (ej. `productos:crear`); los usuarios
con `esGlobal` acceden a todo.

| Método | Ruta | Descripción | Permiso |
|---|---|---|---|
| POST | /api/auth/login | Iniciar sesión y obtener token | — |
| GET | /api/auth/perfil | Datos del usuario autenticado | — |
| GET | /api/usuarios | Listar usuarios | usuarios:listar |
| POST | /api/usuarios | Crear usuario | usuarios:crear |
| PUT | /api/usuarios/:id | Editar usuario | usuarios:editar |
| PATCH | /api/usuarios/:id/estado | Activar/desactivar | usuarios:eliminar |
| GET | /api/roles | Listar roles y sus permisos | roles:listar |
| GET | /api/roles/permisos | Catálogo de permisos | roles:listar |
| GET, POST, PUT, PATCH /estado | /api/productos | CRUD productos | productos:* |
| GET, POST, PUT, PATCH /estado | /api/categorias | CRUD categorías | categorias:* |
| GET | /api/dashboard/resumen | Estadísticas del panel | dashboard:ver |
| GET | /api/health | Estado del backend y BD | — |

## Módulos del sistema
- **Implementados:** Autenticación (JWT), Roles y Permisos, Usuarios,
  Categorías, Productos, Dashboard.
- **Pendientes (siguientes fases):** Clientes, Pedidos, Inventario e
  Incidencias (los datos de semilla ya existen en BD).

## Estructura del proyecto
- `/backend` — API Express + Prisma, capas repository/service/controller/route
- `/backend/prisma` — esquema de datos y seed idempotente
- `/frontend` — Cliente React + Vite + Tailwind
- `/agente` — Skills de TasteSkill, skills personalizadas y reglas (rules.md)
- `docker-compose.yml` + `Dockerfile`s — despliegue de producción (Ubuntu/Docker)

## Autor
Isaias Edmundo Armella — RU: E115862
Materia: TEL420-SISTEMAS PARALELOS — Docente: Ing. Elias Cassal Baldiviezo