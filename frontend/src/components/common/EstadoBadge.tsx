interface PropiedadesEstado {
  activo: boolean;
  textoActivo?: string;
  textoInactivo?: string;
}

export default function EstadoBadge({
  activo,
  textoActivo = "Activo",
  textoInactivo = "Inactivo",
}: PropiedadesEstado) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        activo ? "bg-emerald-500/10 text-emerald-300" : "bg-gray-600/20 text-gray-400"
      }`}
    >
      {activo ? textoActivo : textoInactivo}
    </span>
  );
}