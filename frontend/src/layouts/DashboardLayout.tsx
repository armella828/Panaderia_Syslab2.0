import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  ShieldCheck,
  Tags,
  Users,
  UsersRound,
  Warehouse,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const MENU = [
  { ruta: "/dashboard", etiqueta: "Panel", codigo: "dashboard:ver", icono: LayoutDashboard },
  { ruta: "/usuarios", etiqueta: "Usuarios", codigo: "usuarios:listar", icono: Users },
  { ruta: "/roles", etiqueta: "Roles y permisos", codigo: "roles:listar", icono: ShieldCheck },
  { ruta: "/productos", etiqueta: "Productos", codigo: "productos:listar", icono: Package },
  { ruta: "/categorias", etiqueta: "Categorías", codigo: "categorias:listar", icono: Tags },
  { ruta: "/clientes", etiqueta: "Clientes", codigo: "clientes:listar", icono: UsersRound },
  { ruta: "/pedidos", etiqueta: "Pedidos", codigo: "pedidos:listar", icono: ClipboardList },
  { ruta: "/inventario", etiqueta: "Inventario", codigo: "inventario:listar", icono: Warehouse },
  { ruta: "/incidencias", etiqueta: "Incidencias", codigo: "incidencias:listar", icono: AlertTriangle },
];

export default function DashboardLayout() {
  const { usuario, cerrarSesion, tienePermiso } = useAuth();
  const navegar = useNavigate();

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navegar("/login", { replace: true });
  };

  const items = MENU.filter((item) => tienePermiso(item.codigo));

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-800 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white">
            P
          </div>
          <div>
            <p className="text-base font-bold leading-tight">Panadería Syslab</p>
            <p className="text-xs text-gray-500">Sistema de administración</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.ruta}>
                <NavLink
                  to={item.ruta}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-sky-600/15 text-sky-300"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                    }`
                  }
                >
                  <item.icono size={18} />
                  {item.etiqueta}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="ml-64 flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-sky-300">
              {usuario?.nombre.charAt(0).toUpperCase() ?? "?"}
            </span>
            <div>
              <p className="text-sm font-semibold">{usuario?.nombre}</p>
              <p className="text-xs text-gray-500">{usuario?.roles.join(", ")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={manejarCerrarSesion}
            className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800"
          >
            <LogOut size={16} />
            Salir
          </button>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}