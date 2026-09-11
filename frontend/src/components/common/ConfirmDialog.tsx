import { AlertTriangle } from "lucide-react";

interface PropiedadesConfirmacion {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  cargando?: boolean;
}

export default function ConfirmDialog({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  onConfirmar,
  onCancelar,
  cargando = false,
}: PropiedadesConfirmacion) {
  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancelar}
    >
      <div
        className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-amber-500/10 p-2 text-amber-400">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-100">{titulo}</h2>
            <p className="mt-1 text-sm text-gray-400">{mensaje}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancelar}
            disabled={cargando}
            className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={cargando}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}