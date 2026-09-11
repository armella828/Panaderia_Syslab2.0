import type { NextFunction, Request, RequestHandler, Response } from "express";

export function asyncHandler(
  manejador: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(manejador(req, res, next)).catch(next);
  };
}