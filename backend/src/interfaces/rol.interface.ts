export interface CrearRolDTO {
  nombre: string;
  descripcion?: string;
  permisos: number[];
}

export type ActualizarRolDTO = CrearRolDTO;