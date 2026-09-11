import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail } from "lucide-react";

import Spinner from "../components/common/Spinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { obtenerMensajeError } from "../utils/errores";
import { botonPrimario, inputClase, etiquetaClase } from "../components/common/estilos";

interface EstadoUbicacion {
  desde?: string;
}

export default function Login() {
  const { usuario, cargando, iniciarSesion } = useAuth();
  const { mostrarToast } = useToast();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cargando) {
    return <Spinner />;
  }

  if (usuario) {
    return <Navigate to="/dashboard" replace />;
  }

  const manejarEnvio = async (evento: FormEvent) => {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      await iniciarSesion(correo.trim(), password);
      mostrarToast("Sesión iniciada correctamente");
      const estado = ubicacion.state as EstadoUbicacion | null;
      navegar(estado?.desde ?? "/dashboard", { replace: true });
    } catch (e) {
      setError(obtenerMensajeError(e));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600 text-3xl font-bold text-white shadow-lg shadow-sky-600/30">
            P
          </div>
          <h1 className="text-2xl font-bold text-gray-100">Panadería Syslab 2.0</h1>
          <p className="mt-1 text-sm text-gray-500">Inicia sesión para continuar</p>
        </div>

        <form
          onSubmit={manejarEnvio}
          className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur"
        >
          <div>
            <label htmlFor="correo" className={etiquetaClase}>
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="correo"
                type="email"
                autoComplete="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="usuario@panaderia.edu.bo"
                className={`${inputClase} pl-9`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={etiquetaClase}>
              Contraseña
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className={`${inputClase} pl-9`}
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <button type="submit" disabled={enviando} className={`${botonPrimario} w-full`}>
            {enviando ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-600">
          Usuarios de prueba: admin@panaderia.edu.bo / 123456
        </p>
      </div>
    </div>
  );
}