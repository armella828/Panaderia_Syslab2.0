---
nombre: validacion-endpoints
descripcion: Valida entradas, normaliza el manejo de errores y verifica los codigos de estado HTTP de la API del backend SysLab 2.0. Usar al crear endpoints nuevos o cuando la API devuelve errores poco claros.
version: 1.0.0
autor: Grupo Sistemas Paralelos
---

# Skill: Validacion y Manejo de Errores en Endpoints

## Cuando usar esta skill

- Se crea un endpoint que recibe datos del cliente.
- La API devuelve `500` en casos que deberian ser `400` o `404`.
- Se filtran stack traces al cliente.

## Contrato de respuestas

| Situacion | Codigo | Cuerpo |
|---|---|---|
| Lectura correcta | `200` | recurso o arreglo |
| Creacion correcta | `201` | recurso creado |
| Entrada invalida | `400` | `{ "error": "..." }` |
| Sin autenticar | `401` | `{ "error": "No autenticado" }` |
| Sin permiso | `403` | `{ "error": "No autorizado" }` |
| No encontrado | `404` | `{ "error": "Recurso no encontrado" }` |
| Conflicto de unicidad | `409` | `{ "error": "El registro ya existe" }` |
| Error interno | `500` | `{ "error": "Error interno del servidor" }` |

## Middleware central de errores

```js
// src/middlewares/error.middleware.js
function manejadorErrores(err, req, res, next) {
  // Errores de unicidad de Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'El registro ya existe' });
  }
  // Registro inexistente
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  const status = err.status || 500;
  const mensaje = status === 500 ? 'Error interno del servidor' : err.message;

  console.error('[error]', err.message);   // el detalle solo va al log
  res.status(status).json({ error: mensaje });
}

module.exports = manejadorErrores;
```

Se registra **al final** de `src/index.js`, despues de todas las rutas.

## Validacion de entrada

```js
function validarReserva(body) {
  const errores = [];
  if (!body.motivo || body.motivo.trim().length < 5) errores.push('El motivo es obligatorio (min. 5 caracteres)');
  if (!body.fechaInicio) errores.push('La fecha de inicio es obligatoria');
  if (!body.fechaFin) errores.push('La fecha de fin es obligatoria');
  if (!Number.isInteger(body.usuarioId)) errores.push('usuarioId debe ser un entero');
  if (!Number.isInteger(body.laboratorioId)) errores.push('laboratorioId debe ser un entero');
  if (errores.length) {
    throw Object.assign(new Error(errores.join('; ')), { status: 400 });
  }
}
```

## Reglas duras

1. Nunca confiar en el cliente: todo `req.body`, `req.params` y `req.query` se valida.
2. Los identificadores de ruta se convierten con `Number(req.params.id)` y se verifica que sean enteros validos.
3. Nunca devolver el campo `password`, ni siquiera hasheado.
4. Prohibido concatenar strings para armar consultas: se usa siempre la API de Prisma o `$queryRaw` parametrizado.
5. Todo controlador asincrono envuelve su cuerpo en `try/catch` y delega con `next(e)`.
