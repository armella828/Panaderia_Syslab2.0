import { AppError } from "./AppError.js";

export function exigirTexto(valor: unknown, campo: string, maxLongitud = 255): string {
  if (typeof valor !== "string" || valor.trim().length === 0) {
    throw new AppError(`El campo "${campo}" es obligatorio`, 400);
  }
  const texto = valor.trim();
  if (texto.length > maxLongitud) {
    throw new AppError(`El campo "${campo}" no puede superar ${maxLongitud} caracteres`, 400);
  }
  return texto;
}

export function textoOpcional(valor: unknown, campo: string, maxLongitud = 255): string | undefined {
  if (valor === undefined || valor === null || valor === "") return undefined;
  return exigirTexto(valor, campo, maxLongitud);
}

export function exigirNumero(valor: unknown, campo: string): number {
  const numero = typeof valor === "string" ? Number(valor) : valor;
  if (typeof numero !== "number" || Number.isNaN(numero)) {
    throw new AppError(`El campo "${campo}" debe ser numérico`, 400);
  }
  return numero;
}

export function exigirPrecio(valor: unknown, campo: string): number {
  const numero = exigirNumero(valor, campo);
  if (numero <= 0) {
    throw new AppError(`El campo "${campo}" debe ser mayor a 0`, 400);
  }
  return numero;
}

export function exigirEnteroNoNegativo(valor: unknown, campo: string): number {
  const numero = exigirNumero(valor, campo);
  if (!Number.isInteger(numero) || numero < 0) {
    throw new AppError(`El campo "${campo}" debe ser un entero mayor o igual a 0`, 400);
  }
  return numero;
}

export function exigirBooleano(valor: unknown, campo: string): boolean {
  if (typeof valor !== "boolean") {
    throw new AppError(`El campo "${campo}" debe ser verdadero o falso`, 400);
  }
  return valor;
}

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function exigirCorreo(valor: unknown, campo = "correo"): string {
  const correo = exigirTexto(valor, campo, 160).toLowerCase();
  if (!PATRON_CORREO.test(correo)) {
    throw new AppError(`El campo "${campo}" no tiene un formato válido`, 400);
  }
  return correo;
}

export function exigirContrasena(valor: unknown): string {
  const contrasena = exigirTexto(valor, "password", 100);
  if (contrasena.length < 6) {
    throw new AppError("La contraseña debe tener al menos 6 caracteres", 400);
  }
  return contrasena;
}

export function exigirId(valor: unknown, campo: string): number {
  const numero = exigirNumero(valor, campo);
  if (!Number.isInteger(numero) || numero <= 0) {
    throw new AppError(`El campo "${campo}" debe ser un identificador válido`, 400);
  }
  return numero;
}