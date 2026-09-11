import { prisma } from "../config/prisma.js";

export interface NuevoProducto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagen?: string;
  categoriaId: number;
}

export interface CambiosProducto {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  imagen?: string;
  categoriaId?: number;
  activo?: boolean;
}

export interface FiltrosProducto {
  buscar?: string;
  categoriaId?: number;
  activo?: boolean;
}

export const productoRepository = {
  listar(filtros: FiltrosProducto = {}) {
    return prisma.producto.findMany({
      where: {
        ...(filtros.buscar
          ? {
              OR: [
                { nombre: { contains: filtros.buscar, mode: "insensitive" } },
                { codigo: { contains: filtros.buscar, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(filtros.categoriaId ? { categoriaId: filtros.categoriaId } : {}),
        ...(filtros.activo !== undefined ? { activo: filtros.activo } : {}),
      },
      include: { categoria: { select: { id: true, nombre: true } } },
      orderBy: { id: "asc" },
    });
  },

  buscarPorId(id: number) {
    return prisma.producto.findUnique({
      where: { id },
      include: { categoria: { select: { id: true, nombre: true } } },
    });
  },

  buscarPorCodigo(codigo: string) {
    return prisma.producto.findUnique({ where: { codigo } });
  },

  crear(datos: NuevoProducto) {
    return prisma.producto.create({ data: datos });
  },

  actualizar(id: number, datos: CambiosProducto) {
    return prisma.producto.update({ where: { id }, data: datos });
  },

  cambiarEstado(id: number, activo: boolean) {
    return prisma.producto.update({ where: { id }, data: { activo } });
  },
};