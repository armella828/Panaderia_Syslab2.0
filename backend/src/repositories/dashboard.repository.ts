import { prisma } from "../config/prisma.js";

export const dashboardRepository = {
  contarProductos() {
    return prisma.producto.count();
  },

  contarClientes() {
    return prisma.cliente.count();
  },

  contarPedidos() {
    return prisma.pedido.count();
  },

  sumarStock() {
    return prisma.producto.aggregate({ _sum: { stock: true } });
  },

  contarIncidencias() {
    return prisma.incidencia.count();
  },
};