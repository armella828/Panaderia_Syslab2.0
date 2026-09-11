import bcrypt from "bcryptjs";

import type {
  ActualizarUsuarioDTO,
  CrearUsuarioDTO,
} from "../interfaces/usuario.interface.js";
import { usuarioRepository } from "../repositories/usuario.repository.js";
import { rolRepository } from "../repositories/rol.repository.js";
import { AppError } from "../utils/AppError.js";

const numeroAleatorio = () => Math.floor(10 + Math.random() * 90);

export async function listarUsuarios() {
  return usuarioRepository.listar();
}

export async function crearUsuario(datos: CrearUsuarioDTO) {
  const correo = datos.correo;

  const correoExistente = await usuarioRepository.buscarPorCorreo(correo);

  if (correoExistente) {
    throw new AppError("Ya existe un usuario con ese correo", 409);
  }

  const rol = await rolRepository.buscarPorId(datos.rolId);

  if (!rol || !rol.activo) {
    throw new AppError("El rol no existe o está desactivado", 400);
  }

  const password =
    datos.password ??
    `${datos.nombre.trim().replace(/\s+/g, ".").toLowerCase()}${numeroAleatorio()}`;

  const passwordHash = await bcrypt.hash(password, 10);

  const creado = await usuarioRepository.crear({
    nombre: datos.nombre,
    correo,
    password: passwordHash,
    esGlobal: datos.esGlobal ?? false,
    rolId: datos.rolId,
  });

  return usuarioRepository.buscarPublicoPorId(creado.id);
}

export async function buscarUsuarioPorId(id: number) {
  const usuario = await usuarioRepository.buscarPublicoPorId(id);

  if (!usuario) {
    throw new AppError("El usuario no fue encontrado", 404);
  }

  return usuario;
}

export async function actualizarUsuario(
  id: number,
  datos: ActualizarUsuarioDTO,
  guardarPassword = false
) {
  const existente = await usuarioRepository.buscarPublicoPorId(id);

  if (!existente) {
    throw new AppError("El usuario no fue encontrado", 404);
  }

  if (datos.correo !== existente.correo) {
    const correoUsado = await usuarioRepository.buscarPorCorreo(datos.correo);

    if (correoUsado) {
      throw new AppError("Ya existe un usuario con ese correo", 409);
    }
  }

  if (datos.rolId !== existente.rolId) {
    const rol = await rolRepository.buscarPorId(datos.rolId);

    if (!rol || !rol.activo) {
      throw new AppError("El rol no existe o está desactivado", 400);
    }
  }

  const cambios: Parameters<typeof usuarioRepository.actualizar>[1] = {
    nombre: datos.nombre,
    correo: datos.correo,
    esGlobal: datos.esGlobal,
    rolId: datos.rolId,
  };

  if (guardarPassword && datos.password) {
    cambios.password = await bcrypt.hash(datos.password, 10);
  }

  const actualizado = await usuarioRepository.actualizar(id, cambios);

  return usuarioRepository.buscarPublicoPorId(actualizado.id);
}

export async function cambiarEstadoUsuario(id: number, activo: boolean) {
  const existente = await usuarioRepository.buscarPublicoPorId(id);

  if (!existente) {
    throw new AppError("El usuario no fue encontrado", 404);
  }

  return usuarioRepository.cambiarEstado(id, activo);
}