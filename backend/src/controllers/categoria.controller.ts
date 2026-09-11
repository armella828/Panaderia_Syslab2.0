import type { Request, Response } from "express";

import {
  actualizarCategoria,
  cambiarEstadoCategoria,
  crearCategoria,
  listarCategorias,
} from "../services/categoria.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responderExito } from "../utils/apiResponse.js";
import {
  exigirBooleano,
  exigirId,
  exigirTexto,
  textoOpcional,
} from "../utils/validadores.js";

export const listar = asyncHandler(async (_req: Request, res: Response) => {
  const categorias = await listarCategorias();

  responderExito(res, categorias);
});

export const crear = asyncHandler(async (req: Request, res: Response) => {
  const categoria = await crearCategoria({
    nombre: exigirTexto(req.body?.nombre, "nombre", 80),
    descripcion: textoOpcional(req.body?.descripcion, "descripcion", 255),
  });

  responderExito(res, categoria, 201);
});

export const actualizar = asyncHandler(async (req: Request, res: Response) => {
  const id = exigirId(req.params.id, "id");

  const categoria = await actualizarCategoria(id, {
    nombre: exigirTexto(req.body?.nombre, "nombre", 80),
    descripcion: textoOpcional(req.body?.descripcion, "descripcion", 255),
  });

  responderExito(res, categoria);
});

export const cambiarEstado = asyncHandler(async (req: Request, res: Response) => {
  const id = exigirId(req.params.id, "id");
  const activo = exigirBooleano(req.body?.activo, "activo");

  const categoria = await cambiarEstadoCategoria(id, activo);

  responderExito(res, categoria);
});