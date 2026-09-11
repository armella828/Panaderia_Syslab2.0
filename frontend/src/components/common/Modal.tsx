import type { ReactNode } from "react";
import { X } from "lucide-react";

interface PropiedadesModal {
  abierto: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
}

export default function Modal({ abierto, titulo, onCerrar, children }: PropiedadesModal) {
  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
      onClick={onCerrar}
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 shadow-2xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-700 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-100">{titulo}</h2>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-800 hover:text-gray-200"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}