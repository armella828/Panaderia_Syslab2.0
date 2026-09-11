import { Router } from "express";

import * as dashboardController from "../controllers/dashboard.controller.js";
import { verificarJWT } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get("/resumen", verificarJWT, requirePermission("dashboard:ver"), dashboardController.resumen);

export default router;