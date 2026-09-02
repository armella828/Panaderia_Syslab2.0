---
nombre: docker-compose-orquestador
descripcion: Skill base descargada de TasteSkill. Asiste en la construccion de entornos multi-contenedor con Docker Compose, redes, volumenes y healthchecks.
version: 1.0.0
origen: TasteSkill
---

# Skill base: Orquestacion con Docker Compose

Skill de la libreria publica de TasteSkill, instalada como capacidad base del agente.

## Capacidades

- Definicion de servicios, redes tipo `bridge` y volumenes nombrados.
- Healthchecks y dependencias condicionales (`depends_on: condition: service_healthy`).
- Inyeccion de variables mediante `env_file` y `environment`.
- Bind mounts para desarrollo con recarga en caliente.
- Diagnostico con `logs`, `ps`, `exec`.

## Comandos de referencia

```bash
docker compose up --build -d      # construir y levantar en segundo plano
docker compose ps                 # estado de los contenedores
docker compose logs -f backend    # seguir logs de un servicio
docker compose exec backend sh    # abrir shell dentro del contenedor
docker compose down               # detener (conserva volumenes)
```

## Nota de integracion

Dentro de la red de Compose los servicios se resuelven por **nombre de servicio**
(`db`, `backend`, `frontend`), nunca por `localhost`. Los datos de PostgreSQL
deben persistir en el volumen nombrado `postgres_data`.
