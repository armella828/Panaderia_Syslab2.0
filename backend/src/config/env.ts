import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "syslab_secreto_desarrollo",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
};