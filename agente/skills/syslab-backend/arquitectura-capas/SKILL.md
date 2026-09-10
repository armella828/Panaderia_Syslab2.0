---
nombre: arquitectura-capas
descripcion: Genera y valida codigo del backend respetando la separacion de capas de Panaderia_Syslab2.0 (routes, controllers, services, repositories). Usar al crear un nuevo recurso o al refactorizar codigo que mezcla responsabilidades.
version: 1.0.0
autor: Grupo PanaderiaSyslab2.0
---

# Skill: Arquitectura por Capas (Panaderia_Syslab2.0)

## Cuando usar esta skill

- Se pide crear un recurso nuevo del backend (por ejemplo "agrega el CRUD de reservas").
- Se detecta un controlador que importa `PrismaClient` directamente.
- Se pide refactorizar codigo que mezcla HTTP con acceso a datos.

## Flujo de trabajo obligatorio

Para cada recurso nuevo `<Recurso>` se crean **cuatro** archivos, en este orden:

1. `src/repositories/<recurso>.repository.js` — unico archivo que habla con Prisma.
2. `src/services/<recurso>.service.js` — reglas de negocio; no conoce `req`/`res`.
3. `src/controllers/<recurso>.controller.js` — traduce HTTP a llamadas de servicio.
4. `src/routes/<recurso>.routes.js` — declara los endpoints.

## Plantilla de referencia

### Repositorio
```js
const prisma = require('../config/prisma');

const listar = () => prisma.reserva.findMany({ orderBy: { fechaInicio: 'asc' } });
const obtenerPorId = (id) => prisma.reserva.findUnique({ where: { id } });
const crear = (datos) => prisma.reserva.create({ data: datos });

module.exports = { listar, obtenerPorId, crear };
```

### Servicio
```js
const repo = require('../repositories/reserva.repository');

async function crearReserva(datos) {
  if (new Date(datos.fechaFin) <= new Date(datos.fechaInicio)) {
    throw Object.assign(new Error('La fecha final debe ser posterior a la inicial'), { status: 400 });
  }
  return repo.crear(datos);
}

module.exports = { crearReserva };
```

### Controlador
```js
const servicio = require('../services/reserva.service');

async function crear(req, res, next) {
  try {
    const reserva = await servicio.crearReserva(req.body);
    res.status(201).json(reserva);
  } catch (e) {
    next(e);
  }
}

module.exports = { crear };
```

### Rutas
```js
const { Router } = require('express');
const ctrl = require('../controllers/reserva.controller');

const router = Router();
router.post('/', ctrl.crear);

module.exports = router;
```

## Lista de verificacion antes de entregar

- [ ] Ningun controlador importa `@prisma/client`.
- [ ] Ningun servicio recibe `req` o `res`.
- [ ] Los errores se propagan con `next(e)` y llevan `status`.
- [ ] Los nombres de archivo siguen el patron `<recurso>.<capa>.js`.
- [ ] La ruta esta registrada en `src/index.js` bajo el prefijo `/api`.
