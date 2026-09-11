import type {
  ActualizarCategoriaDTO,
  CrearCategoriaDTO,
} from "../interfaces/categoria.interface.js";
import { categoriaRepository } from "../repositories/categoria.repository.js";
import { AppError } from "../utils/AppError.js";

async function validarNombreCategoria(nombre: string, ignorarId?: number): Promise<void> {
  const existente = await categoriaRepository.buscarPorNombre(nombre);

  if (existente && existente.id !== ignorarId) {
    throw new AppError("Ya existe una categoría con ese nombre", 409);
  }
}

export async function listarCategorias() {
  return categoriaRepository.listar();
}

export async function crearCategoria(datos: CrearCategoriaDTO) {
  await validarNombreCategoria(datos.nombre);

  return categoriaRepository.crear({
    nombre: datos.nombre,
    descripcion: datos.descripcion,
  });
}

export async function actualizarCategoria(id: number, datos: ActualizarCategoriaDTO) {
  const existente = await categoriaRepository.buscarPorId(id);

  if (!existente) {
    throw new AppError("La categoría no fue encontrada", 404);
  }

  await validarNombreCategoria(datos.nombre, id);

  return categoriaRepository.actualizar(id, {
    nombre: datos.nombre,
    descripcion: datos.descripcion,
  });
}

export async function cambiarEstadoCategoria(id: number, activo: boolean) {
  const existente = await categoriaRepository.buscarPorId(id);

  if (!existente) {
    throw new AppError("La categoría no fue encontrada", 404);
  }

  return categoriaRepository.cambiarEstado(id, activo);
}