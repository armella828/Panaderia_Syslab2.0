# SysLab 2.0 - Sistema de Gestion de Laboratorios

Practica de la materia **Sistemas Paralelos** - Despliegue de Arquitectura y Agentes de IA.
Docente: Ing. Elias Cassal Baldiviezo.

El proyecto implementa una arquitectura de **tres contenedores** orquestados con Docker Compose
(base de datos PostgreSQL, backend Node.js/Express con Prisma ORM y frontend React con Vite),
ademas de la configuracion de un **agente de IA** con skills personalizadas y reglas de proyecto.

---

## 1. Requisitos previos

| Herramienta | Version minima | Comando de verificacion |
|---|---|---|
| Docker Engine | 24.x | `docker --version` |
| Docker Compose | v2 (plugin) | `docker compose version` |
| Git | 2.x | `git --version` |
| Node.js (opcional, solo fuera de Docker) | 20.x | `node --version` |

---

## 2. Estructura del proyecto

```
proyecto-sistemas-paralelos/
├── docker-compose.yml          # Orquestacion de los 3 contenedores
├── .env                        # Variables de la raiz (credenciales de PostgreSQL)
├── .env.example                # Plantilla publica de la raiz
├── .gitignore                  # Excluye .env, node_modules y migraciones
├── README.md
│
├── backend/                    # API REST (Node.js + Express + Prisma)
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env                    # Variables propias del backend
│   ├── .env.example
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma       # Modelos de datos
│   │   └── seed.js             # Datos iniciales (idempotente)
│   └── src/
│       └── index.js            # Servidor Express y endpoints
│
├── frontend/                   # Interfaz de usuario (React + Vite)
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env                    # Variables propias del frontend
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       └── main.jsx
│
└── agente/                     # Configuracion del agente de IA
    ├── rules.md                # Reglas de comportamiento del agente
    └── skills/
        ├── syslab-backend/     # Skills personalizadas del proyecto
        │   ├── arquitectura-capas/SKILL.md
        │   ├── persistencia-prisma/SKILL.md
        │   └── validacion-endpoints/SKILL.md
        └── tasteskill/         # Skills base descargadas
            ├── prisma-postgresql/SKILL.md
            ├── docker-compose-orquestador/SKILL.md
            └── api-rest-express/SKILL.md
```

---

## 3. Variables de entorno

Cada carpeta tiene su **propio archivo `.env`**, separando responsabilidades. Los archivos
`.env` reales **no se versionan** (estan en `.gitignore`); solo se publican las plantillas
`.env.example`.

### Raiz (`./.env`) - consumida por Docker Compose

| Variable | Descripcion |
|---|---|
| `POSTGRES_USER` | Usuario de la base de datos |
| `POSTGRES_PASSWORD` | Contraseña de la base de datos |
| `POSTGRES_DB` | Nombre de la base de datos |
| `POSTGRES_PORT` | Puerto publicado de PostgreSQL |
| `COMPOSE_PROJECT_NAME` | Prefijo de los recursos de Compose |

### Backend (`./backend/.env`)

| Variable | Descripcion |
|---|---|
| `PORT` | Puerto del servidor Express |
| `NODE_ENV` | Entorno de ejecucion |
| `DATABASE_URL` | Cadena de conexion a PostgreSQL (host `db` dentro de Docker) |
| `CORS_ORIGIN` | Origen permitido para peticiones del frontend |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Firma y vigencia de los tokens |

### Frontend (`./frontend/.env`)

| Variable | Descripcion |
|---|---|
| `VITE_API_URL` | URL base de la API del backend |
| `VITE_APP_NOMBRE` | Nombre visible de la aplicacion |
| `VITE_PORT` | Puerto del servidor de desarrollo de Vite |

Para preparar el entorno:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

---

## 4. Puesta en marcha

```bash
# 1. Clonar el repositorio
git clone https://github.com/<usuario>/proyecto-sistemas-paralelos.git
cd proyecto-sistemas-paralelos

# 2. Crear los archivos .env a partir de las plantillas (ver seccion 3)

# 3. Construir y levantar los tres contenedores
docker compose up --build -d

# 4. Comprobar que los tres servicios estan arriba
docker compose ps
```

### Migraciones y datos iniciales

```bash
# Crear y aplicar la migracion inicial
docker compose exec backend npx prisma migrate dev --name init

# Cargar los datos de prueba
docker compose exec backend node prisma/seed.js
```

### Servicios disponibles

| Servicio | URL | Puerto |
|---|---|---|
| Frontend (React + Vite) | http://localhost:5173 | 5173 |
| Backend (API REST) | http://localhost:4000/api/health | 4000 |
| PostgreSQL | localhost:5432 | 5432 |

---

## 5. Modelo de datos

Definido en `backend/prisma/schema.prisma`:

| Modelo | Descripcion | Relaciones |
|---|---|---|
| `Usuario` | Personas que reservan (estudiante, docente, administrador) | 1:N con `Reserva` |
| `Laboratorio` | Espacios fisicos disponibles | 1:N con `Equipo` y `Reserva` |
| `Equipo` | Equipamiento asignado a un laboratorio | N:1 con `Laboratorio` |
| `Reserva` | Solicitud de uso de un laboratorio | N:1 con `Usuario` y `Laboratorio` |

Enumeraciones: `RolUsuario`, `EstadoEquipo`, `EstadoReserva`.

---

## 6. Endpoints de la API

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/health` | Estado del servicio y de la conexion a la base de datos |
| GET | `/api/usuarios` | Lista de usuarios registrados |
| GET | `/api/laboratorios` | Laboratorios con sus equipos |
| GET | `/api/equipos` | Equipos registrados |
| GET | `/api/reservas` | Reservas con usuario y laboratorio asociados |

Ejemplo de verificacion:

```bash
curl http://localhost:4000/api/health
curl http://localhost:4000/api/laboratorios
```

---

## 7. Agente de IA

La carpeta `agente/` documenta la configuracion del asistente utilizado durante el desarrollo.

- **`rules.md`**: reglas obligatorias del proyecto (idioma, convenciones de nombres,
  estructura de capas, estilo de commits, manejo de secretos y limites de actuacion).
- **`skills/tasteskill/`**: skills base descargadas de la libreria publica
  (Prisma + PostgreSQL, orquestacion con Docker Compose y API REST con Express).
- **`skills/syslab-backend/`**: skills personalizadas creadas para este proyecto
  (arquitectura en capas, persistencia con Prisma y validacion de endpoints).

Ante un conflicto, las reglas de `rules.md` y las skills personalizadas tienen prioridad
sobre las skills base.

---

## 8. Comandos utiles

```bash
docker compose ps                       # estado de los contenedores
docker compose logs -f backend          # logs del backend en vivo
docker compose exec backend sh          # shell dentro del backend
docker compose exec db psql -U syslab_user -d syslab_db   # consola SQL
docker compose down                     # detener (conserva los datos)
docker compose down -v                  # detener y borrar el volumen de datos
```

---

## 9. Solucion de problemas

| Problema | Causa probable | Solucion |
|---|---|---|
| `Can't reach database server at db:5432` | El backend arranco antes que PostgreSQL | Esperar el healthcheck o reiniciar con `docker compose restart backend` |
| `port is already allocated` | El puerto esta ocupado por otro proceso | Cambiar el puerto publicado en `docker-compose.yml` |
| `Environment variable not found: DATABASE_URL` | Falta el archivo `backend/.env` | Copiarlo desde `backend/.env.example` |
| Prisma falla al generar el cliente en Alpine | Falta `openssl` | Ya incluido en el `Dockerfile` del backend |
| El frontend no responde en el navegador | Vite escuchando solo en localhost | `vite.config.js` ya expone `host: 0.0.0.0` |

---

## 10. Licencia

Proyecto academico de uso educativo, elaborado como practica de la materia Sistemas Paralelos.
