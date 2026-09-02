// SysLab 2.0 - Script de poblado inicial (Seed)
const { PrismaClient, Rol, EstadoEquipo, EstadoReserva } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando poblado de la base de datos...');

  // 1. Usuarios
  const passwordHash = await bcrypt.hash('123456', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@syslab.edu.bo' },
    update: {},
    create: {
      nombre: 'Administrador SysLab',
      email: 'admin@syslab.edu.bo',
      password: passwordHash,
      rol: Rol.ADMIN,
    },
  });

  const docente = await prisma.usuario.upsert({
    where: { email: 'elias.cassal@syslab.edu.bo' },
    update: {},
    create: {
      nombre: 'Ing. Elias Cassal Baldiviezo',
      email: 'elias.cassal@syslab.edu.bo',
      password: passwordHash,
      rol: Rol.DOCENTE,
    },
  });

  const estudiante = await prisma.usuario.upsert({
    where: { email: 'estudiante@syslab.edu.bo' },
    update: {},
    create: {
      nombre: 'Estudiante Sistemas Paralelos',
      email: 'estudiante@syslab.edu.bo',
      password: passwordHash,
      rol: Rol.ESTUDIANTE,
    },
  });

  console.log(`✅ Usuarios creados: ${admin.nombre}, ${docente.nombre}, ${estudiante.nombre}`);

  // 2. Laboratorios
  const labA = await prisma.laboratorio.upsert({
    where: { codigo: 'LAB-PAR-01' },
    update: {},
    create: {
      codigo: 'LAB-PAR-01',
      nombre: 'Laboratorio de Computo Paralelo',
      ubicacion: 'Bloque A - Piso 2',
      capacidad: 25,
    },
  });

  const labB = await prisma.laboratorio.upsert({
    where: { codigo: 'LAB-CLU-02' },
    update: {},
    create: {
      codigo: 'LAB-CLU-02',
      nombre: 'Laboratorio de Clusters y Contenedores',
      ubicacion: 'Bloque B - Piso 1',
      capacidad: 18,
    },
  });

  console.log(`✅ Laboratorios creados: ${labA.codigo}, ${labB.codigo}`);

  // 3. Equipos
  const equipos = [
    { codigoInterno: 'EQ-001', descripcion: 'Nodo maestro Xeon E5', nucleos: 16, memoriaGb: 32, estado: EstadoEquipo.DISPONIBLE, laboratorioId: labA.id },
    { codigoInterno: 'EQ-002', descripcion: 'Nodo trabajador Ryzen 7', nucleos: 8, memoriaGb: 16, estado: EstadoEquipo.DISPONIBLE, laboratorioId: labA.id },
    { codigoInterno: 'EQ-003', descripcion: 'Nodo trabajador Ryzen 5', nucleos: 6, memoriaGb: 16, estado: EstadoEquipo.EN_USO, laboratorioId: labA.id },
    { codigoInterno: 'EQ-004', descripcion: 'Servidor Docker Host', nucleos: 12, memoriaGb: 64, estado: EstadoEquipo.DISPONIBLE, laboratorioId: labB.id },
    { codigoInterno: 'EQ-005', descripcion: 'Estacion GPU NVIDIA T400', nucleos: 8, memoriaGb: 32, estado: EstadoEquipo.MANTENIMIENTO, laboratorioId: labB.id },
  ];

  for (const eq of equipos) {
    await prisma.equipo.upsert({
      where: { codigoInterno: eq.codigoInterno },
      update: {},
      create: eq,
    });
  }

  console.log(`✅ ${equipos.length} equipos registrados`);

  // 4. Reservas
  const totalReservas = await prisma.reserva.count();
  if (totalReservas === 0) {
    await prisma.reserva.createMany({
      data: [
        {
          motivo: 'Practica de despliegue multi-contenedor',
          fechaInicio: new Date('2026-09-05T08:00:00Z'),
          fechaFin: new Date('2026-09-05T10:00:00Z'),
          estado: EstadoReserva.CONFIRMADA,
          usuarioId: estudiante.id,
          laboratorioId: labA.id,
        },
        {
          motivo: 'Evaluacion de arquitectura SysLab 2.0',
          fechaInicio: new Date('2026-09-06T14:00:00Z'),
          fechaFin: new Date('2026-09-06T16:00:00Z'),
          estado: EstadoReserva.PENDIENTE,
          usuarioId: docente.id,
          laboratorioId: labB.id,
        },
      ],
    });
    console.log('✅ 2 reservas de ejemplo creadas');
  }

  console.log('🎉 Poblado finalizado correctamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
