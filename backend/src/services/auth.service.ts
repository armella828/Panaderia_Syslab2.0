import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { usuarioRepository } from "../repositories/usuario.repository.js";
import { AppError } from "../utils/AppError.js";
import { aUsuarioAutenticado } from "../utils/mapeadores.js";

export interface CredencialesLogin {
  correo: string;
  password: string;
}

export async function iniciarSesion(credenciales: CredencialesLogin) {
  const usuario = await usuarioRepository.buscarPorCorreo(credenciales.correo);

  if (!usuario) {
    throw new AppError("Correo o contraseña incorrectos", 401);
  }

  const coincide = await bcrypt.compare(credenciales.password, usuario.password);

  if (!coincide) {
    throw new AppError("Correo o contraseña incorrectos", 401);
  }

  if (!usuario.activo) {
    throw new AppError("La cuenta del usuario está desactivada", 403);
  }

  if (!usuario.rol.activo) {
    throw new AppError("El rol del usuario está desactivado", 403);
  }

  const autenticado = aUsuarioAutenticado(usuario);

  const token = jwt.sign({ id: usuario.id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  return { token, usuario: autenticado };
}

export function usuarioDesdeRequest(id: number) {
  return usuarioRepository.buscarPorIdConAccesos(id).then((usuario) => {
    if (!usuario) {
      throw new AppError("El usuario no fue encontrado", 404);
    }
    return aUsuarioAutenticado(usuario);
  });
}