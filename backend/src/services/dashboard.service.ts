import { dashboardRepository } from "../repositories/dashboard.repository.js";

export async function obtenerResumen() {
  const [productos, clientes, pedidos, stock, incidencias] = await Promise.all([
    dashboardRepository.contarProductos(),
    dashboardRepository.contarClientes(),
    dashboardRepository.contarPedidos(),
    dashboardRepository.sumarStock(),
    dashboardRepository.contarIncidencias(),
  ]);

  return {
    productos,
    clientes,
    pedidos,
    unidadesEnStock: stock._sum.stock ?? 0,
    incidencias,
  };
}