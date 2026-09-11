import { prisma } from "../config/prisma.js";

export interface NuevoUsuario {
  nombre: string;
  correo: string;
  password: string;
  esGlobal: boolean;
  rolId: number;
}

export interface CambiosUsuario {
  nombre?: string;
  correo?: string;
  password?: string;
  esGlobal?: boolean;
  rolId?: number;
  activo?: boolean;
}

const incluirRolAccesos = {
  rol: {
    include: {
      rolPermisos: { include: { permiso: true } },
    },
  },
} as const;

const seleccionarPublico = {
  id: true,
  nombre: true,
  correo: true,
  esGlobal: true,
  activo: true,
  rolId: true,
  createdAt: true,
  updatedAt: true,
  rol: { select: { id: true, nombre: true } },
} as const;

export const usuarioRepository = {
  buscarPorCorreo(correo: string) {
    return prisma.usuario.findUnique({
      where: { correo },
      include: incluirRolAccesos,
    });
  },

  buscarPorIdConAccesos(id: number) {
    return prisma.usuario.findUnique({
      where: { id },
      include: incluirRolAccesos,
    });
  },

  buscarPublicoPorId(id: number) {
    return prisma.usuario.findUnique({
      where: { id },
      select: seleccionarPublico,
    });
  },

  listar() {
    return prisma.usuario.findMany({
      select: seleccionarPublico,
      orderBy: { id: "asc" },
    });
  },

  crear(datos: NuevoUsuario) {
    return prisma.usuario.create({ data: datos });
  },

  actualizar(id: number, datos: CambiosUsuario) {
    return prisma.usuario.update({ where: { id }, data: datos });
  },

  cambiarEstado(id: number, activo: boolean) {
    return prisma.usuario.update({ where: { id }, data: { activo } });
  },
};