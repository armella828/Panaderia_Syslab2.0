import type { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/AppError.js";

export function requirePermission(...codigos: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const usuario = req.user;

    if (!usuario) {
      next(new AppError("No se proporcionó un token de autenticación", 401));
      return;
    }

    if (usuario.esGlobal || codigos.length === 0) {
      next();
      return;
    }

    const puede = codigos.some((codigo) => usuario.permisos.includes(codigo));

    if (!puede) {
      next(new AppError("No tienes permisos para realizar esta acción", 403));
      return;
    }

    next();
  };
}