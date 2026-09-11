import { Construction, Lock } from "lucide-react";

interface Propiedades {
  titulo: string;
  sinPermiso?: boolean;
}

export default function EnConstruccion({ titulo, sinPermiso = false }: Propiedades) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      {sinPermiso ? <Lock size={48} className="text-gray-600" /> : <Construction size={48} className="text-gray-600" />}
      <div>
        <h2 className="text-xl font-semibold text-gray-200">{titulo}</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          {sinPermiso
            ? "No tienes permisos para acceder a este módulo."
            : "Este módulo se implementará en las próximas fases del proyecto."}
        </p>
      </div>
    </div>
  );
}