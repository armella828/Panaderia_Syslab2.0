import { prisma } from "../config/prisma.js";

export interface NuevaCategoria {
  nombre: string;
  descripcion?: string;
}

export interface CambiosCategoria {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}

export const categoriaRepository = {
  listar() {
    return prisma.categoria.findMany({ orderBy: { nombre: "asc" } });
  },

  buscarPorId(id: number) {
    return prisma.categoria.findUnique({ where: { id } });
  },

  buscarPorNombre(nombre: string) {
    return prisma.categoria.findFirst({ where: { nombre } });
  },

  crear(datos: NuevaCategoria) {
    return prisma.categoria.create({ data: datos });
  },

  actualizar(id: number, datos: CambiosCategoria) {
    return prisma.categoria.update({ where: { id }, data: datos });
  },

  cambiarEstado(id: number, activo: boolean) {
    return prisma.categoria.update({ where: { id }, data: { activo } });
  },
};