import type { Request, Response } from "express";

import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responderExito } from "../utils/apiResponse.js";
import { exigirCorreo, exigirContrasena } from "../utils/validadores.js";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const correo = exigirCorreo(req.body?.correo);
  const password = exigirContrasena(req.body?.password);

  const resultado = await authService.iniciarSesion({ correo, password });

  responderExito(res, resultado, 200);
});

export const perfil = asyncHandler(async (req: Request, res: Response) => {
  responderExito(res, req.user ?? null);
});