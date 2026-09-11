import type { Request, Response } from "express";

import {
  actualizarRol,
  cambiarEstadoRol,
  crearRol,
  listarRoles,
} from "../services/rol.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responderExito } from "../utils/apiResponse.js";
import {
  exigirBooleano,
  exigirId,
  exigirTexto,
  textoOpcional,
} from "../utils/validadores.js";
import { AppError } from "../utils/AppError.js";

export const listar = asyncHandler(async (_req: Request, res: Response) => {
  const roles = await listarRoles();

  responderExito(res, roles);
});

export const crear = asyncHandler(async (req: Request, res: Response) => {
  const permisos = req.body?.permisos;

  if (!Array.isArray(permisos) || permisos.some((p) => typeof p !== "number")) {
    throw new AppError('El campo "permisos" debe ser una lista de números', 400);
  }

  const rol = await crearRol({
    nombre: exigirTexto(req.body?.nombre, "nombre", 80),
    descripcion: textoOpcional(req.body?.descripcion, "descripcion", 255),
    permisos,
  });

  responderExito(res, rol, 201);
});

export const actualizar = asyncHandler(async (req: Request, res: Response) => {
  const id = exigirId(req.params.id, "id");
  const permisos = req.body?.permisos;

  if (!Array.isArray(permisos) || permisos.some((p) => typeof p !== "number")) {
    throw new AppError('El campo "permisos" debe ser una lista de números', 400);
  }

  const rol = await actualizarRol(id, {
    nombre: exigirTexto(req.body?.nombre, "nombre", 80),
    descripcion: textoOpcional(req.body?.descripcion, "descripcion", 255),
    permisos,
  });

  responderExito(res, rol);
});

export const cambiarEstado = asyncHandler(async (req: Request, res: Response) => {
  const id = exigirId(req.params.id, "id");
  const activo = exigirBooleano(req.body?.activo, "activo");

  const rol = await cambiarEstadoRol(id, activo);

  responderExito(res, rol);
});