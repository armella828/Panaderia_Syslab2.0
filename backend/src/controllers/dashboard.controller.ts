import type { Request, Response } from "express";

import { obtenerResumen } from "../services/dashboard.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responderExito } from "../utils/apiResponse.js";

export const resumen = asyncHandler(async (_req: Request, res: Response) => {
  const resumen = await obtenerResumen();

  responderExito(res, resumen);
});