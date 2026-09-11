import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

const server = app.listen(env.port, "0.0.0.0", () => {
  console.log(`Backend Panaderia_Syslab2.0 escuchando en el puerto ${env.port}`);
});

async function apagarServidor(): Promise<void> {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", apagarServidor);
process.on("SIGTERM", apagarServidor);