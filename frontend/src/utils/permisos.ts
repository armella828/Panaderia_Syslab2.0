import type { UsuarioSesion } from "../interfaces";

export function can(codigos: string | string[], usuario?: UsuarioSesion | null): boolean {
  if (!usuario) return false;
  if (usuario.esGlobal) return true;

  const lista = Array.isArray(codigos) ? codigos : [codigos];

  return lista.some((codigo) => usuario.permisos.includes(codigo));
}