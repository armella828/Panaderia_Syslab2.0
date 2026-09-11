import type { UsuarioAutenticado } from "../interfaces/auth.interface.js";

declare global {
  namespace Express {
    interface Request {
      user?: UsuarioAutenticado;
    }
  }
}

export {};