export interface UsuarioSesion {
  id: number;
  nombre: string;
  correo: string;
  esGlobal: boolean;
  activo: boolean;
  roles: string[];
  permisos: string[];
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  esGlobal: boolean;
  activo: boolean;
  rolId: number;
  createdAt: string;
  updatedAt: string;
  rol: { id: number; nombre: string };
}

export interface Permiso {
  id: number;
  codigo: string;
  descripcion: string;
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  rolPermisos: { permiso: Permiso }[];
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  precio: string;
  stock: number;
  imagen: string | null;
  activo: boolean;
  categoriaId: number;
  createdAt: string;
  updatedAt: string;
  categoria: { id: number; nombre: string };
}

export interface ResumenDashboard {
  productos: number;
  clientes: number;
  pedidos: number;
  unidadesEnStock: number;
  incidencias: number;
}

export interface RespuestaApi<T> {
  status: "success" | "error";
  data?: T;
  message?: string;
}