import { prisma } from "../config/prisma.js";

export const permisoRepository = {
  listar() {
    return prisma.permiso.findMany({ orderBy: { codigo: "asc" } });
  },

  buscarPorIds(ids: number[]) {
    return prisma.permiso.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
  },
};