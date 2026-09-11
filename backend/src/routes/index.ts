import { Router } from "express";

import healthRouter from "./health.route.js";
import authRouter from "./auth.route.js";
import usuarioRouter from "./usuario.route.js";
import rolRouter from "./rol.route.js";
import categoriaRouter from "./categoria.route.js";
import productoRouter from "./producto.route.js";
import dashboardRouter from "./dashboard.route.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/usuarios", usuarioRouter);
router.use("/roles", rolRouter);
router.use("/categorias", categoriaRouter);
router.use("/productos", productoRouter);
router.use("/dashboard", dashboardRouter);

export default router;