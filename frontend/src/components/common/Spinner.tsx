export default function Spinner({ etiqueta }: { etiqueta?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      {etiqueta ? <p className="text-sm text-gray-400">{etiqueta}</p> : null}
    </div>
  );
}