import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type TipoToast = "exito" | "error" | "info";

interface Toast {
  id: number;
  tipo: TipoToast;
  mensaje: string;
}

interface ToastContexto {
  mostrarToast: (mensaje: string, tipo?: TipoToast) => void;
}

const ToastContexto = createContext<ToastContexto>({ mostrarToast: () => {} });

const ESTILOS: Record<TipoToast, { clase: string; icono: ReactNode }> = {
  exito: { clase: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200", icono: <CheckCircle2 size={18} /> },
  error: { clase: "border-red-500/40 bg-red-500/10 text-red-200", icono: <AlertCircle size={18} /> },
  info: { clase: "border-sky-500/40 bg-sky-500/10 text-sky-200", icono: <Info size={18} /> },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const contador = useRef(0);

  const mostrarToast = useCallback((mensaje: string, tipo: TipoToast = "exito") => {
    const id = ++contador.current;

    setToasts((prev) => [...prev, { id, tipo, mensaje }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContexto.Provider value={{ mostrarToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex w-80 flex-col gap-2">
        {toasts.map((t) => {
          const estilo = ESTILOS[t.tipo];
          return (
            <div
              key={t.id}
              className={`flex items-start gap-2 rounded-lg border px-4 py-3 shadow-lg backdrop-blur ${estilo.clase}`}
            >
              <span className="mt-0.5 shrink-0">{estilo.icono}</span>
              <span className="text-sm font-medium leading-snug">{t.mensaje}</span>
            </div>
          );
        })}
      </div>
    </ToastContexto.Provider>
  );
}

export function useToast() {
  return useContext(ToastContexto);
}