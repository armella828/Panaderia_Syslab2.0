import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "success",
      data: {
        servicio: "backend-panaderia",
        estado: "ok",
        db: "conectada",
      },
    });
  } catch {
    next(new AppError("No se pudo conectar con la base de datos", 503));
  }
});

export default router;