import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { usuarioRepository } from "../repositories/usuario.repository.js";
import { AppError } from "../utils/AppError.js";
import { aUsuarioAutenticado } from "../utils/mapeadores.js";

export async function verificarJWT(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const autorizacion = req.headers.authorization;

    if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
      throw new AppError("No se proporcionó un token de autenticación", 401);
    }

    const token = autorizacion.slice(7);

    let payload: { id: number };
    try {
      const verificado = jwt.verify(token, env.jwtSecret);
      if (typeof verificado === "string" || typeof verificado.id !== "number") {
        throw new Error("Payload inválido");
      }
      payload = { id: verificado.id };
    } catch {
      throw new AppError("El token no es válido o ha expirado", 401);
    }

    const usuario = await usuarioRepository.buscarPorIdConAccesos(payload.id);

    if (!usuario) {
      throw new AppError("El usuario asociado al token ya no existe", 401);
    }

    if (!usuario.activo) {
      throw new AppError("La cuenta del usuario está desactivada", 403);
    }

    if (!usuario.rol.activo) {
      throw new AppError("El rol del usuario está desactivado", 403);
    }

    req.user = aUsuarioAutenticado(usuario);
    next();
  } catch (error) {
    next(error);
  }
}