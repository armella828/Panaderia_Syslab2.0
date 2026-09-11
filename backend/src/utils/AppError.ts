export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: "error";

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.status = "error";
  }
}