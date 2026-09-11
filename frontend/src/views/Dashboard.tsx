import { ClipboardList, Package, UsersRound, Warehouse, AlertTriangle } from "lucide-react";

import EstadoBadge from "../components/common/EstadoBadge";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import { useAuth } from "../context/AuthContext";
import { useResumenDashboard } from "../hooks/useDashboard";

export default function Dashboard() {
  const { usuario } = useAuth();
  const { resumen, cargando } = useResumenDashboard();

  if (!usuario) return null;

  if (cargando) {
    return <Spinner etiqueta="Cargando panel principal..." />;
  }

  const tarjetas = [
    { etiqueta: "Productos registrados", valor: resumen?.productos ?? 0, icono: Package },
    { etiqueta: "Unidades en stock", valor: resumen?.unidadesEnStock ?? 0, icono: Warehouse },
    { etiqueta: "Pedidos", valor: resumen?.pedidos ?? 0, icono: ClipboardList },
    { etiqueta: "Clientes", valor: resumen?.clientes ?? 0, icono: UsersRound },
    { etiqueta: "Incidencias abiertas", valor: resumen?.incidencias ?? 0, icono: AlertTriangle },
  ];

  return (
    <div>
      <PageHeader
        titulo={`Hola, ${usuario.nombre.split(" ")[0]}`}
        descripcion="Resumen del estado actual del negocio"
      />

      <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
        Rol: <EstadoBadge activo={usuario.roles.length > 0} textoActivo={usuario.roles.join(", ")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {tarjetas.map((tarjeta) => (
          <div
            key={tarjeta.etiqueta}
            className="rounded-xl border border-gray-800 bg-gray-900 p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">{tarjeta.etiqueta}</p>
              <tarjeta.icono size={20} className="text-sky-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-100">{tarjeta.valor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}