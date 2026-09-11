import { permisoRepository } from "../repositories/permiso.repository.js";

export async function listarPermisos() {
  return permisoRepository.listar();
}