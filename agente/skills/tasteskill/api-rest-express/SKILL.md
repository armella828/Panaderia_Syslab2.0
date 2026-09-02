---
nombre: api-rest-express
descripcion: Skill base descargada de TasteSkill. Asiste en la construccion de APIs REST con Express, enrutado modular, middlewares y codigos de estado HTTP.
version: 1.0.0
origen: TasteSkill
---

# Skill base: API REST con Express

Skill de la libreria publica de TasteSkill, instalada como capacidad base del agente.

## Capacidades

- Enrutado modular con `express.Router()`.
- Middlewares de CORS, parseo JSON y manejo centralizado de errores.
- Uso correcto de verbos y codigos de estado HTTP.
- Endpoints de salud (`/api/health`) para healthchecks de contenedores.

## Estructura sugerida

```
src/
  index.js
  routes/
  controllers/
  middlewares/
```

## Nota de integracion

En este proyecto la estructura sugerida se **amplia** con las capas `services/`
y `repositories/` exigidas por la arquitectura SysLab 2.0. Ver la skill
personalizada `syslab-backend/arquitectura-capas`.
