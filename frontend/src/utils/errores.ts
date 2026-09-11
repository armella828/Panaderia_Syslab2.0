import axios, { type AxiosError } from "axios";

type ErrorApi = AxiosError<{ message?: string }>;

export function obtenerMensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const err = error as ErrorApi;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.status === 401) return "Tu sesión ha expirado. Inicia sesión nuevamente.";
    if (err.response?.status === 403) return "No tienes permisos para realizar esta acción.";
    if (err.response?.status === 404) return "El recurso solicitado no fue encontrado.";
    if (err.code === "ERR_NETWORK") return "No se pudo conectar con el servidor.";
  }
  return "Ocurrió un error inesperado.";
}