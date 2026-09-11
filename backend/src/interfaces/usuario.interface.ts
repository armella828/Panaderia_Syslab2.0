export interface CrearUsuarioDTO {
  nombre: string;
  correo: string;
  password?: string;
  rolId: number;
  esGlobal?: boolean;
}

export interface ActualizarUsuarioDTO {
  nombre: string;
  correo: string;
  rolId: number;
  esGlobal?: boolean;
  password?: string;
}