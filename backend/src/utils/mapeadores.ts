import type { UsuarioAutenticado } from "../interfaces/auth.interface.js";
import type { usuarioRepository } from "../repositories/usuario.repository.js";

type UsuarioConAccesos = NonNullable<
  Awaited<ReturnType<typeof usuarioRepository.buscarPorIdConAccesos>>
>;

export function aUsuarioAutenticado(usuario: UsuarioConAccesos): UsuarioAutenticado {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    esGlobal: usuario.esGlobal,
    activo: usuario.activo,
    roles: [usuario.rol.nombre],
    permisos: usuario.rol.rolPermisos.map((rel) => rel.permiso.codigo),
  };
}