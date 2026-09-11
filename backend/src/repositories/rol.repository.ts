import { prisma } from "../config/prisma.js";

export interface NuevoRol {
  nombre: string;
  descripcion?: string;
}

export interface CambiosRol {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}

export const rolRepository = {
  listar() {
    return prisma.rol.findMany({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        activo: true,
        rolPermisos: {
          select: {
            permiso: { select: { id: true, codigo: true, descripcion: true } },
          },
        },
      },
      orderBy: { id: "asc" },
    });
  },

  buscarPorId(id: number) {
    return prisma.rol.findUnique({
      where: { id },
      include: {
        rolPermisos: { include: { permiso: true } },
      },
    });
  },

  buscarPorNombre(nombre: string) {
    return prisma.rol.findFirst({ where: { nombre } });
  },

  crear(datos: NuevoRol) {
    return prisma.rol.create({ data: datos });
  },

  actualizar(id: number, datos: CambiosRol) {
    return prisma.rol.update({ where: { id }, data: datos });
  },

  cambiarEstado(id: number, activo: boolean) {
    return prisma.rol.update({ where: { id }, data: { activo } });
  },

  async reemplazarPermisos(rolId: number, permisoIds: number[]): Promise<void> {
    await prisma.$transaction([
      prisma.rolPermiso.deleteMany({ where: { rolId } }),
      ...(permisoIds.length > 0
        ? [
            prisma.rolPermiso.createMany({
              data: permisoIds.map((permisoId) => ({ rolId, permisoId })),
            }),
          ]
        : []),
    ]);
  },
};