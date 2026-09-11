import { useCallback, useEffect, useState } from "react";

import httpClient from "../services/httpClient";
import type { RespuestaApi } from "../interfaces";

export function useApiLista<T>(url: string) {
  const [datos, setDatos] = useState<T[]>([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    setCargando(true);

    try {
      const respuesta = await httpClient.get<RespuestaApi<T[]>>(url);
      setDatos(respuesta.data.data ?? []);
    } catch {
      setDatos([]);
    } finally {
      setCargando(false);
    }
  }, [url]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { datos, cargando, recargar };
}