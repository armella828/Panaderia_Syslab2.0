import { Router } from "express";

import * as usuarioController from "../controllers/usuario.controller.js";
import { verificarJWT } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/authorize.middleware.js";

const router = Router();

router.use(verificarJWT);

router.get("/", requirePermission("usuarios:listar"), usuarioController.listar);
router.get("/:id", requirePermission("usuarios:listar"), usuarioController.obtener);
router.post("/", requirePermission("usuarios:crear"), usuarioController.crear);
router.put("/:id", requirePermission("usuarios:editar"), usuarioController.actualizar);
router.patch("/:id/estado", requirePermission("usuarios:eliminar"), usuarioController.cambiarEstado);

export default router;