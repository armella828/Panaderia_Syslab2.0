import type { Request, Response } from "express";

import {
  actualizarUsuario,
  buscarUsuarioPorId,
  cambiarEstadoUsuario,
  crearUsuario,
  listarUsuarios,
} from "../services/usuario.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responderExito } from "../utils/apiResponse.js";
import {
  exigirBooleano,
  exigirContrasena,
  exigirCorreo,
  exigirId,
  exigirTexto,
  textoOpcional,
} from "../utils/validadores.js";

export const listar = asyncHandler(async (_req: Request, res: Response) => {
  const usuarios = await listarUsuarios();

  responderExito(res, usuarios);
});

export const obtener = asyncHandler(async (req: Request, res: Response) => {
  const id = exigirId(req.params.id, "id");
  const usuario = await buscarUsuarioPorId(id);

  responderExito(res, usuario);
});

export const crear = asyncHandler(async (req: Request, res: Response) => {
  const datos = {
    nombre: exigirTexto(req.body?.nombre, "nombre", 120),
    correo: exigirCorreo(req.body?.correo),
    rolId: exigirId(req.body?.rolId, "rolId"),
    esGlobal: req.body?.esGlobal,
    password: textoOpcional(req.body?.password, "password", 100),
  };

  const usuario = await crearUsuario(datos);

  responderExito(res, usuario, 201);
});

export const actualizar = asyncHandler(async (req: Request, res: Response) => {
  const id = exigirId(req.params.id, "id");
  const guardarPassword = req.body?.password !== undefined && req.body.password !== "";

  const datos = {
    nombre: exigirTexto(req.body?.nombre, "nombre", 120),
    correo: exigirCorreo(req.body?.correo),
    rolId: exigirId(req.body?.rolId, "rolId"),
    esGlobal: req.body?.esGlobal,
    password: guardarPassword ? exigirContrasena(req.body?.password) : undefined,
  };

  const usuario = await actualizarUsuario(id, datos, guardarPassword);

  responderExito(res, usuario);
});

export const cambiarEstado = asyncHandler(async (req: Request, res: Response) => {
  const id = exigirId(req.params.id, "id");
  const activo = exigirBooleano(req.body?.activo, "activo");

  const usuario = await cambiarEstadoUsuario(id, activo);

  responderExito(res, usuario);
});