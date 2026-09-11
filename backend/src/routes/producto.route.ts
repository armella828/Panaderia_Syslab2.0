import { Router } from "express";

import * as productoController from "../controllers/producto.controller.js";
import { verificarJWT } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/authorize.middleware.js";

const router = Router();

router.use(verificarJWT);

router.get("/", requirePermission("productos:listar"), productoController.listar);
router.post("/", requirePermission("productos:crear"), productoController.crear);
router.put("/:id", requirePermission("productos:editar"), productoController.actualizar);
router.patch(
  "/:id/estado",
  requirePermission("productos:eliminar"),
  productoController.cambiarEstado
);

export default router;