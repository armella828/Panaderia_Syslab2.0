import { Router } from "express";

import * as rolController from "../controllers/rol.controller.js";
import * as permisoController from "../controllers/permiso.controller.js";
import { verificarJWT } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/authorize.middleware.js";

const router = Router();

router.use(verificarJWT);

router.get("/", requirePermission("roles:listar"), rolController.listar);
router.get("/permisos", requirePermission("roles:listar"), permisoController.listar);
router.post("/", requirePermission("roles:crear"), rolController.crear);
router.put("/:id", requirePermission("roles:editar"), rolController.actualizar);
router.patch("/:id/estado", requirePermission("roles:eliminar"), rolController.cambiarEstado);

export default router;