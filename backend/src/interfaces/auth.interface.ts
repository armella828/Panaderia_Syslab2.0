export interface UsuarioAutenticado {
  id: number;
  nombre: string;
  correo: string;
  esGlobal: boolean;
  activo: boolean;
  roles: string[];
  permisos: string[];
}