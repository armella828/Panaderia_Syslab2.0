import type { ActualizarRolDTO, CrearRolDTO } from "../interfaces/rol.interface.js";
import { permisoRepository } from "../repositories/permiso.repository.js";
import { rolRepository } from "../repositories/rol.repository.js";
import { AppError } from "../utils/AppError.js";

async function validarPermisos(permisoIds: number[]): Promise<void> {
  if (permisoIds.length === 0) return;

  const encontrados = await permisoRepository.buscarPorIds(permisoIds);

  if (encontrados.length !== permisoIds.length) {
    throw new AppError("Uno o más permisos no existen", 400);
  }
}

async function validarNombreRol(nombre: string, ignorarId?: number): Promise<void> {
  const existente = await rolRepository.buscarPorNombre(nombre);

  if (existente && existente.id !== ignorarId) {
    throw new AppError("Ya existe un rol con ese nombre", 409);
  }
}

export async function listarRoles() {
  return rolRepository.listar();
}

export async function crearRol(datos: CrearRolDTO) {
  await validarNombreRol(datos.nombre);
  await validarPermisos(datos.permisos);

  const rol = await rolRepository.crear({ nombre: datos.nombre, descripcion: datos.descripcion });

  await rolRepository.reemplazarPermisos(rol.id, datos.permisos);

  return rolRepository.buscarPorId(rol.id);
}

export async function actualizarRol(id: number, datos: ActualizarRolDTO) {
  const existente = await rolRepository.buscarPorId(id);

  if (!existente) {
    throw new AppError("El rol no fue encontrado", 404);
  }

  await validarNombreRol(datos.nombre, id);
  await validarPermisos(datos.permisos);

  await rolRepository.actualizar(id, { nombre: datos.nombre, descripcion: datos.descripcion });
  await rolRepository.reemplazarPermisos(id, datos.permisos);

  return rolRepository.buscarPorId(id);
}

export async function cambiarEstadoRol(id: number, activo: boolean) {
  const existente = await rolRepository.buscarPorId(id);

  if (!existente) {
    throw new AppError("El rol no fue encontrado", 404);
  }

  if (existente.nombre === "Administrador" && !activo) {
    throw new AppError("El rol administrador no puede ser desactivado", 400);
  }

  return rolRepository.cambiarEstado(id, activo);
}