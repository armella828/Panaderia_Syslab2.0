import type { Request, Response } from "express";

import {
  actualizarProducto,
  cambiarEstadoProducto,
  crearProducto,
  listarProductos,
} from "../services/producto.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responderExito } from "../utils/apiResponse.js";
import {
  exigirBooleano,
  exigirEnteroNoNegativo,
  exigirId,
  exigirPrecio,
  exigirTexto,
  textoOpcional,
} from "../utils/validadores.js";
import type { FiltrosProducto } from "../repositories/producto.repository.js";

export const listar = asyncHandler(async (req: Request, res: Response) => {
  const filtros: FiltrosProducto = {
    buscar: typeof req.query?.buscar === "string" ? req.query.buscar : undefined,
    categoriaId: req.query?.categoria ? exigirId(req.query.categoria, "categoria") : undefined,
    activo: req.query?.activo !== undefined ? req.query.activo === "true" : undefined,
  };

  const productos = await listarProductos(filtros);

  responderExito(res, productos);
});

export const crear = asyncHandler(async (req: Request, res: Response) => {
  const producto = await crearProducto({
    codigo: exigirTexto(req.body?.codigo, "codigo", 50),
    nombre: exigirTexto(req.body?.nombre, "nombre", 120),
    descripcion: textoOpcional(req.body?.descripcion, "descripcion", 500),
    precio: exigirPrecio(req.body?.precio, "precio"),
    stock: exigirEnteroNoNegativo(req.body?.stock, "stock"),
    imagen: textoOpcional(req.body?.imagen, "imagen", 500),
    categoriaId: exigirId(req.body?.categoriaId, "categoriaId"),
  });

  responderExito(res, producto, 201);
});

export const actualizar = asyncHandler(async (req: Request, res: Response) => {
  const id = exigirId(req.params.id, "id");

  const producto = await actualizarProducto(id, {
    codigo: exigirTexto(req.body?.codigo, "codigo", 50),
    nombre: exigirTexto(req.body?.nombre, "nombre", 120),
    descripcion: textoOpcional(req.body?.descripcion, "descripcion", 500),
    precio: exigirPrecio(req.body?.precio, "precio"),
    stock: exigirEnteroNoNegativo(req.body?.stock, "stock"),
    imagen: textoOpcional(req.body?.imagen, "imagen", 500),
    categoriaId: exigirId(req.body?.categoriaId, "categoriaId"),
  });

  responderExito(res, producto);
});

export const cambiarEstado = asyncHandler(async (req: Request, res: Response) => {
  const id = exigirId(req.params.id, "id");
  const activo = exigirBooleano(req.body?.activo, "activo");

  const producto = await cambiarEstadoProducto(id, activo);

  responderExito(res, producto);
});