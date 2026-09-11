export interface CrearProductoDTO {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagen?: string;
  categoriaId: number;
}

export type ActualizarProductoDTO = CrearProductoDTO;