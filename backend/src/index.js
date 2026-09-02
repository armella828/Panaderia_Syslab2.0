// SysLab 2.0 - Punto de entrada del Backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Healthcheck
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ estado: 'ok', servicio: 'backend-syslab', db: 'conectada' });
  } catch (e) {
    res.status(503).json({ estado: 'error', db: 'sin conexion' });
  }
});

// Usuarios
app.get('/api/usuarios', async (req, res) => {
  const usuarios = await prisma.usuario.findMany({
    select: { id: true, nombre: true, email: true, rol: true, activo: true },
    orderBy: { id: 'asc' },
  });
  res.json(usuarios);
});

// Laboratorios con sus equipos
app.get('/api/laboratorios', async (req, res) => {
  const laboratorios = await prisma.laboratorio.findMany({
    include: { equipos: true },
    orderBy: { id: 'asc' },
  });
  res.json(laboratorios);
});

// Equipos
app.get('/api/equipos', async (req, res) => {
  const equipos = await prisma.equipo.findMany({
    include: { laboratorio: { select: { codigo: true, nombre: true } } },
    orderBy: { id: 'asc' },
  });
  res.json(equipos);
});

// Reservas
app.get('/api/reservas', async (req, res) => {
  const reservas = await prisma.reserva.findMany({
    include: {
      usuario: { select: { nombre: true, email: true } },
      laboratorio: { select: { codigo: true, nombre: true } },
    },
    orderBy: { fechaInicio: 'asc' },
  });
  res.json(reservas);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend SysLab 2.0 escuchando en el puerto ${PORT}`);
});
