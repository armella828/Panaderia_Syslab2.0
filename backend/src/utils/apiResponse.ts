import type { Response } from "express";

export function responderExito(res: Response, data: unknown, statusCode = 200): void {
  res.status(statusCode).json({ status: "success", data });
}

export function responderMensaje(res: Response, message: string, statusCode = 200): void {
  res.status(statusCode).json({ status: "success", message });
}