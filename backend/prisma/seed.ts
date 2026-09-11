import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import {
  EstadoIncidencia,
  EstadoPedido,
  Prioridad,
  TipoMovimiento,
} from "../src/generated/prisma/enums.js";
import { env } from "../src/config/env.js";

const adapter = new PrismaPg({ connectionString: env.databaseUrl });
const prisma = new PrismaClient({ adapter });

const CONTRASENA_PRUEBA = "123456";

// ─────────────── DATOS ───────────────

const PERMISOS = [
  { codigo: "usuarios:listar", descripcion: "Ver usuarios del sistema" },
  { codigo: "usuarios:crear", descripcion: "Crear usuarios" },
  { codigo: "usuarios:editar", descripcion: "Editar usuarios" },
  { codigo: "usuarios:eliminar", descripcion: "Eliminar usuarios" },

  { codigo: "roles:listar", descripcion: "Ver roles y permisos" },
  { codigo: "roles:crear", descripcion: "Crear roles" },
  { codigo: "roles:editar", descripcion: "Editar roles y asignar permisos" },
  { codigo: "roles:eliminar", descripcion: "Eliminar roles" },

  { codigo: "productos:listar", descripcion: "Ver productos" },
  { codigo: "productos:crear", descripcion: "Crear productos" },
  { codigo: "productos:editar", descripcion: "Editar productos" },
  { codigo: "productos:eliminar", descripcion: "Eliminar productos" },

  { codigo: "categorias:listar", descripcion: "Ver categorias" },
  { codigo: "categorias:crear", descripcion: "Crear categorias" },
  { codigo: "categorias:editar", descripcion: "Editar categorias" },
  { codigo: "categorias:eliminar", descripcion: "Eliminar categorias" },

  { codigo: "clientes:listar", descripcion: "Ver clientes" },
  { codigo: "clientes:crear", descripcion: "Crear clientes" },
  { codigo: "clientes:editar", descripcion: "Editar clientes" },
  { codigo: "clientes:eliminar", descripcion: "Eliminar clientes" },

  { codigo: "pedidos:listar", descripcion: "Ver pedidos" },
  { codigo: "pedidos:crear", descripcion: "Crear pedidos" },
  { codigo: "pedidos:editar", descripcion: "Editar pedidos" },
  { codigo: "pedidos:cancelar", descripcion: "Cancelar pedidos" },

  { codigo: "inventario:listar", descripcion: "Ver movimientos de inventario" },
  { codigo: "inventario:registrar", descripcion: "Registrar movimientos" },
  { codigo: "inventario:editar", descripcion: "Editar movimientos" },

  { codigo: "incidencias:listar", descripcion: "Ver incidencias" },
  { codigo: "incidencias:crear", descripcion: "Crear incidencias" },
  { codigo: "incidencias:editar", descripcion: "Editar incidencias" },

  { codigo: "dashboard:ver", descripcion: "Ver resumen del panel principal" },
];

const CODIGOS_TOTALES = PERMISOS.map((p) => p.codigo);

const ROLES = [
  {
    nombre: "Administrador",
    descripcion: "Acceso total al sistema",
    permisos: CODIGOS_TOTALES,
  },
  {
    nombre: "Jefe de Panadería",
    descripcion: "Gestiona productos, pedidos, inventario e incidencias",
    permisos: [
      "productos:listar", "productos:crear", "productos:editar", "productos:eliminar",
      "categorias:listar", "categorias:crear", "categorias:editar", "categorias:eliminar",
      "clientes:listar", "clientes:crear", "clientes:editar",
      "pedidos:listar", "pedidos:crear", "pedidos:editar", "pedidos:cancelar",
      "inventario:listar", "inventario:registrar", "inventario:editar",
      "incidencias:listar", "incidencias:crear", "incidencias:editar",
      "dashboard:ver",
    ],
  },
  {
    nombre: "Vendedor",
    descripcion: "Registra pedidos y clientes",
    permisos: [
      "productos:listar",
      "categorias:listar",
      "clientes:listar", "clientes:crear", "clientes:editar",
      "pedidos:listar", "pedidos:crear", "pedidos:editar", "pedidos:cancelar",
      "incidencias:listar", "incidencias:crear",
      "dashboard:ver",
    ],
  },
  {
    nombre: "Encargado de Inventario",
    descripcion: "Controla stock y entradas/salidas",
    permisos: [
      "productos:listar", "productos:editar",
      "categorias:listar",
      "inventario:listar", "inventario:registrar", "inventario:editar",
      "incidencias:listar", "incidencias:crear", "incidencias:editar",
      "dashboard:ver",
    ],
  },
];

const USUARIOS = [
  {
    nombre: "Administrador del Sistema",
    correo: "admin@panaderia.edu.bo",
    rol: "Administrador",
    esGlobal: true,
  },
  {
    nombre: "María López",
    correo: "jefe@panaderia.edu.bo",
    rol: "Jefe de Panadería",
    esGlobal: false,
  },
  {
    nombre: "Pedro Sánchez",
    correo: "vendedor@panaderia.edu.bo",
    rol: "Vendedor",
    esGlobal: false,
  },
  {
    nombre: "Ana Condori",
    correo: "inventario@panaderia.edu.bo",
    rol: "Encargado de Inventario",
    esGlobal: false,
  },
];

const CATEGORIAS = [
  { nombre: "Pan", descripcion: "Panes artesanales" },
  { nombre: "Tortas", descripcion: "Tortas y bizcochos" },
  { nombre: "Pasteles", descripcion: "Pasteles y postres" },
  { nombre: "Masas", descripcion: "Masas dulces y saladas" },
  { nombre: "Repostería", descripcion: "Productos de repostería fina" },
  { nombre: "Bebidas", descripcion: "Bebidas calientes y frías" },
  { nombre: "Otros", descripcion: "Otros productos" },
];

const PRODUCTOS = [
  { codigo: "PAN-001", nombre: "Pan francés", descripcion: "Pan artesanal de corteza crujiente", precio: 1.5, stock: 50, categoria: "Pan" },
  { codigo: "PAN-002", nombre: "Pan integral", descripcion: "Pan elaborado con harina integral", precio: 2.0, stock: 40, categoria: "Pan" },
  { codigo: "MAS-001", nombre: "Croissant", descripcion: "Croissant de mantequilla", precio: 3.5, stock: 25, categoria: "Masas" },
  { codigo: "MAS-002", nombre: "Empanada", descripcion: "Empanada de carne", precio: 4.0, stock: 30, categoria: "Masas" },
  { codigo: "TOR-001", nombre: "Torta de chocolate", descripcion: "Torta de chocolate con relleno de chantilly", precio: 45.0, stock: 5, categoria: "Tortas" },
  { codigo: "TOR-002", nombre: "Torta de vainilla", descripcion: "Torta esponjosa de vainilla", precio: 40.0, stock: 6, categoria: "Tortas" },
  { codigo: "PAS-001", nombre: "Pastel de tres leches", descripcion: "Pastel bañado en tres leches", precio: 35.0, stock: 4, categoria: "Pasteles" },
  { codigo: "REP-001", nombre: "Galletas", descripcion: "Galletas de mantequilla", precio: 8.0, stock: 60, categoria: "Repostería" },
  { codigo: "REP-002", nombre: "Donas", descripcion: "Donas glaseadas", precio: 6.0, stock: 20, categoria: "Repostería" },
  { codigo: "BEB-001", nombre: "Café", descripcion: "Café de olla", precio: 7.5, stock: 80, categoria: "Bebidas" },
];

const CLIENTES = [
  { nombre: "María García", telefono: "71234567", correo: "maria.garcia@example.com", direccion: "Av. Principal 123" },
  { nombre: "Juan Pérez", telefono: "69876543", correo: "juan.perez@example.com", direccion: "Calle Los Olivos 45" },
  { nombre: "Lucía Fernández", telefono: "75551234", correo: "lucia.fernandez@example.com", direccion: "Barrio Central, Casa 12" },
  { nombre: "Carlos Rojas", telefono: "76668899", correo: "carlos.rojas@example.com", direccion: "Av. Las Américas 87" },
];

// ─────────────── POBLADO (idempotente) ───────────────

async function poblarPermisos(): Promise<void> {
  for (const permiso of PERMISOS) {
    await prisma.permiso.upsert({
      where: { codigo: permiso.codigo },
      update: { descripcion: permiso.descripcion },
      create: permiso,
    });
  }
  console.log(`Permisos: ${PERMISOS.length}`);
}

async function poblarRoles(): Promise<void> {
  for (const rol of ROLES) {
    await prisma.rol.upsert({
      where: { nombre: rol.nombre },
      update: { descripcion: rol.descripcion },
      create: { nombre: rol.nombre, descripcion: rol.descripcion },
    });

    const rolRegistrado = await prisma.rol.findUniqueOrThrow({
      where: { nombre: rol.nombre },
    });

    const permisoIds = await prisma.permiso.findMany({
      where: { codigo: { in: rol.permisos } },
      select: { id: true },
    });

    await prisma.rolPermiso.deleteMany({ where: { rolId: rolRegistrado.id } });
    await prisma.rolPermiso.createMany({
      data: permisoIds.map((p) => ({ rolId: rolRegistrado.id, permisoId: p.id })),
    });
  }
  console.log(`Roles: ${ROLES.length}`);
}

async function poblarUsuarios(): Promise<void> {
  const contrasenaHash = await bcrypt.hash(CONTRASENA_PRUEBA, 10);

  for (const usuario of USUARIOS) {
    const rol = await prisma.rol.findUniqueOrThrow({
      where: { nombre: usuario.rol },
    });

    await prisma.usuario.upsert({
      where: { correo: usuario.correo },
      update: { nombre: usuario.nombre, esGlobal: usuario.esGlobal, rolId: rol.id, activo: true },
      create: {
        nombre: usuario.nombre,
        correo: usuario.correo,
        password: contrasenaHash,
        esGlobal: usuario.esGlobal,
        rolId: rol.id,
      },
    });
  }
  console.log(`Usuarios: ${USUARIOS.length} (contraseña: ${CONTRASENA_PRUEBA})`);
}

async function poblarCategorias(): Promise<void> {
  for (const categoria of CATEGORIAS) {
    await prisma.categoria.upsert({
      where: { nombre: categoria.nombre },
      update: { descripcion: categoria.descripcion, activo: true },
      create: categoria,
    });
  }
  console.log(`Categorías: ${CATEGORIAS.length}`);
}

async function poblarProductos(): Promise<void> {
  for (const producto of PRODUCTOS) {
    const categoria = await prisma.categoria.findUniqueOrThrow({
      where: { nombre: producto.categoria },
    });

    await prisma.producto.upsert({
      where: { codigo: producto.codigo },
      update: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        categoriaId: categoria.id,
        activo: true,
      },
      create: {
        codigo: producto.codigo,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoriaId: categoria.id,
      },
    });
  }
  console.log(`Productos: ${PRODUCTOS.length}`);
}

async function poblarClientes(): Promise<void> {
  for (const cliente of CLIENTES) {
    if (cliente.correo) {
      await prisma.cliente.upsert({
        where: { correo: cliente.correo },
        update: { nombre: cliente.nombre, telefono: cliente.telefono, direccion: cliente.direccion, activo: true },
        create: cliente,
      });
    }
  }
  console.log(`Clientes: ${CLIENTES.length}`);
}

async function registrarStockInicial(): Promise<void> {
  const totalMovimientos = await prisma.movimientoInventario.count();
  if (totalMovimientos > 0) {
    console.log("Movimientos de inventario: ya existen, se omiten");
    return;
  }

  const admin = await prisma.usuario.findUniqueOrThrow({
    where: { correo: "admin@panaderia.edu.bo" },
  });

  const productos = await prisma.producto.findMany();

  for (const producto of productos) {
    await prisma.movimientoInventario.create({
      data: {
        productoId: producto.id,
        tipo: TipoMovimiento.ENTRADA,
        cantidad: producto.stock,
        stockResultante: producto.stock,
        motivo: "Stock inicial",
        usuarioId: admin.id,
      },
    });
  }
  console.log(`Movimientos de inventario iniciales: ${productos.length}`);
}

async function poblarPedidos(): Promise<void> {
  const totalPedidos = await prisma.pedido.count();
  if (totalPedidos > 0) {
    console.log("Pedidos: ya existen, se omiten");
    return;
  }

  const clienteMaria = await prisma.cliente.findUniqueOrThrow({
    where: { correo: "maria.garcia@example.com" },
  });
  const clienteJuan = await prisma.cliente.findUniqueOrThrow({
    where: { correo: "juan.perez@example.com" },
  });
  const vendedor = await prisma.usuario.findUniqueOrThrow({
    where: { correo: "vendedor@panaderia.edu.bo" },
  });
  const panFrances = await prisma.producto.findUniqueOrThrow({ where: { codigo: "PAN-001" } });
  const cafe = await prisma.producto.findUniqueOrThrow({ where: { codigo: "BEB-001" } });
  const tortaChocolate = await prisma.producto.findUniqueOrThrow({ where: { codigo: "TOR-001" } });
  const galletas = await prisma.producto.findUniqueOrThrow({ where: { codigo: "REP-001" } });

  const pedidos = [
    {
      clienteId: clienteMaria.id,
      usuarioId: vendedor.id,
      estado: EstadoPedido.PENDIENTE,
      observaciones: "Entregar antes de las 18:00",
      detalle: [
        { productoId: panFrances.id, cantidad: 5, precioUnitario: Number(panFrances.precio) },
        { productoId: cafe.id, cantidad: 2, precioUnitario: Number(cafe.precio) },
      ],
    },
    {
      clienteId: clienteJuan.id,
      usuarioId: vendedor.id,
      estado: EstadoPedido.CONFIRMADO,
      observaciones: "Torta con dedicatoria",
      detalle: [
        { productoId: tortaChocolate.id, cantidad: 1, precioUnitario: Number(tortaChocolate.precio) },
        { productoId: galletas.id, cantidad: 3, precioUnitario: Number(galletas.precio) },
      ],
    },
  ];

  for (const pedido of pedidos) {
    const detalleConSubtotal = pedido.detalle.map((d) => ({
      ...d,
      subtotal: Math.round(d.cantidad * d.precioUnitario * 100) / 100,
    }));
    const total = Math.round(
      detalleConSubtotal.reduce((suma, d) => suma + d.subtotal, 0) * 100
    ) / 100;

    await prisma.pedido.create({
      data: {
        clienteId: pedido.clienteId,
        usuarioId: pedido.usuarioId,
        estado: pedido.estado,
        observaciones: pedido.observaciones,
        total,
        detalle: {
          create: detalleConSubtotal,
        },
      },
    });
  }
  console.log(`Pedidos de ejemplo: ${pedidos.length}`);
}

async function poblarIncidencias(): Promise<void> {
  const totalIncidencias = await prisma.incidencia.count();
  if (totalIncidencias > 0) {
    console.log("Incidencias: ya existen, se omiten");
    return;
  }

  const vendedor = await prisma.usuario.findUniqueOrThrow({
    where: { correo: "vendedor@panaderia.edu.bo" },
  });
  const admin = await prisma.usuario.findUniqueOrThrow({
    where: { correo: "admin@panaderia.edu.bo" },
  });

  await prisma.incidencia.create({
    data: {
      codigo: "INC-0001",
      titulo: "Horno no enciende",
      descripcion: "El horno principal de la panadería no enciende desde esta mañana.",
      prioridad: Prioridad.ALTA,
      estado: EstadoIncidencia.EN_DIAGNOSTICO,
      reportadoPorId: vendedor.id,
      asignadoAId: admin.id,
    },
  });
  console.log("Incidencias de ejemplo: 1");
}

// ─────────────── ENTRADA ───────────────

async function main(): Promise<void> {
  console.log("Iniciando poblado de la base de datos...");

  await poblarPermisos();
  await poblarRoles();
  await poblarUsuarios();
  await poblarCategorias();
  await poblarProductos();
  await poblarClientes();
  await registrarStockInicial();
  await poblarPedidos();
  await poblarIncidencias();

  console.log("Poblado finalizado correctamente");
}

main()
  .catch((error) => {
    console.error("Error en el seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });