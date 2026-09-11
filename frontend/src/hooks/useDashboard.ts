import { useCallback, useEffect, useState } from "react";

import httpClient from "../services/httpClient";
import type { RespuestaApi, ResumenDashboard } from "../interfaces";

export function useResumenDashboard() {
  const [resumen, setResumen] = useState<ResumenDashboard | null>(null);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    setCargando(true);

    try {
      const respuesta = await httpClient.get<RespuestaApi<ResumenDashboard>>("/dashboard/resumen");
      setResumen(respuesta.data.data ?? null);
    } catch {
      setResumen(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { resumen, cargando, recargar };
}