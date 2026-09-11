import type { Request, Response } from "express";

import { listarPermisos } from "../services/permiso.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responderExito } from "../utils/apiResponse.js";

export const listar = asyncHandler(async (_req: Request, res: Response) => {
  const permisos = await listarPermisos();

  responderExito(res, permisos);
});