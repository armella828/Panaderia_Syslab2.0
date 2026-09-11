import { Navigate, Outlet, useLocation } from "react-router-dom";

import Spinner from "../components/common/Spinner";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { usuario, cargando } = useAuth();
  const ubicacion = useLocation();

  if (cargando) {
    return <Spinner />;
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ desde: ubicacion.pathname }} replace />;
  }

  return <Outlet />;
}