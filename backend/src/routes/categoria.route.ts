import { Router } from "express";

import * as categoriaController from "../controllers/categoria.controller.js";
import { verificarJWT } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/authorize.middleware.js";

const router = Router();

router.use(verificarJWT);

router.get("/", requirePermission("categorias:listar"), categoriaController.listar);
router.post("/", requirePermission("categorias:crear"), categoriaController.crear);
router.put("/:id", requirePermission("categorias:editar"), categoriaController.actualizar);
router.patch(
  "/:id/estado",
  requirePermission("categorias:eliminar"),
  categoriaController.cambiarEstado
);

export default router;