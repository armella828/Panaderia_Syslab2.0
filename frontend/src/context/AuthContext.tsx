import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import httpClient, { TOKEN_KEY } from "../services/httpClient";
import type { RespuestaApi, UsuarioSesion } from "../interfaces";

interface ResultadoLogin {
  token: string;
  usuario: UsuarioSesion;
}

interface AuthContexto {
  usuario: UsuarioSesion | null;
  cargando: boolean;
  iniciarSesion: (correo: string, password: string) => Promise<void>;
  cerrarSesion: () => void;
  tienePermiso: (codigos: string | string[]) => boolean;
}

const AuthContexto = createContext<AuthContexto | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargando, setCargando] = useState(true);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUsuario(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setCargando(false);
      return;
    }

    httpClient
      .get<RespuestaApi<UsuarioSesion>>("/auth/perfil")
      .then((respuesta) => setUsuario(respuesta.data.data ?? null))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUsuario(null);
      })
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    const manejarNoAutorizado = () => setUsuario(null);

    window.addEventListener("auth_unauthorized", manejarNoAutorizado);

    return () => window.removeEventListener("auth_unauthorized", manejarNoAutorizado);
  }, []);

  const iniciarSesion = useCallback(async (correo: string, password: string) => {
    const respuesta = await httpClient.post<RespuestaApi<ResultadoLogin>>("/auth/login", {
      correo,
      password,
    });

    const datos = respuesta.data.data;

    if (!datos) {
      throw new Error("Respuesta de autenticación inválida");
    }

    localStorage.setItem(TOKEN_KEY, datos.token);
    setUsuario(datos.usuario);
  }, []);

  const tienePermiso = useCallback(
    (codigos: string | string[]) => {
      if (!usuario) return false;
      if (usuario.esGlobal) return true;

      const lista = Array.isArray(codigos) ? codigos : [codigos];

      return lista.some((codigo) => usuario.permisos.includes(codigo));
    },
    [usuario]
  );

  return (
    <AuthContexto.Provider
      value={{ usuario, cargando, iniciarSesion, cerrarSesion, tienePermiso }}
    >
      {children}
    </AuthContexto.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContexto);

  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return contexto;
}