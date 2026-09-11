import type { ReactNode } from "react";

interface PropiedadesEncabezado {
  titulo: string;
  descripcion?: string;
  acciones?: ReactNode;
}

export default function PageHeader({ titulo, descripcion, acciones }: PropiedadesEncabezado) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">{titulo}</h1>
        {descripcion ? <p className="mt-1 text-sm text-gray-400">{descripcion}</p> : null}
      </div>
      {acciones ? <div className="flex items-center gap-2">{acciones}</div> : null}
    </div>
  );
}