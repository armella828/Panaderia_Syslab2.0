import type {
  ActualizarProductoDTO,
  CrearProductoDTO,
} from "../interfaces/producto.interface.js";
import { categoriaRepository } from "../repositories/categoria.repository.js";
import { productoRepository, type FiltrosProducto } from "../repositories/producto.repository.js";
import { AppError } from "../utils/AppError.js";

async function validarCodigoProducto(codigo: string, ignorarId?: number): Promise<void> {
  const existente = await productoRepository.buscarPorCodigo(codigo);

  if (existente && existente.id !== ignorarId) {
    throw new AppError("Ya existe un producto con ese código", 409);
  }
}

async function validarCategoria(id: number): Promise<void> {
  const categoria = await categoriaRepository.buscarPorId(id);

  if (!categoria || !categoria.activo) {
    throw new AppError("La categoría no existe o está desactivada", 400);
  }
}

export async function listarProductos(filtros: FiltrosProducto) {
  return productoRepository.listar(filtros);
}

export async function crearProducto(datos: CrearProductoDTO) {
  await validarCodigoProducto(datos.codigo);
  await validarCategoria(datos.categoriaId);

  return productoRepository.crear({
    codigo: datos.codigo,
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    precio: datos.precio,
    stock: datos.stock,
    imagen: datos.imagen,
    categoriaId: datos.categoriaId,
  });
}

export async function actualizarProducto(id: number, datos: ActualizarProductoDTO) {
  const existente = await productoRepository.buscarPorId(id);

  if (!existente) {
    throw new AppError("El producto no fue encontrado", 404);
  }

  await validarCodigoProducto(datos.codigo, id);
  await validarCategoria(datos.categoriaId);

  return productoRepository.actualizar(id, {
    codigo: datos.codigo,
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    precio: datos.precio,
    stock: datos.stock,
    imagen: datos.imagen,
    categoriaId: datos.categoriaId,
  });
}

export async function cambiarEstadoProducto(id: number, activo: boolean) {
  const existente = await productoRepository.buscarPorId(id);

  if (!existente) {
    throw new AppError("El producto no fue encontrado", 404);
  }

  return productoRepository.cambiarEstado(id, activo);
}