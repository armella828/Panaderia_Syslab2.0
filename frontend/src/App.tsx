import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Categorias from "./views/Categorias";
import Dashboard from "./views/Dashboard";
import EnConstruccion from "./views/EnConstruccion";
import Login from "./views/Login";
import Productos from "./views/Productos";
import Roles from "./views/Roles";
import Usuarios from "./views/Usuarios";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/clientes" element={<EnConstruccion titulo="Clientes" />} />
          <Route path="/pedidos" element={<EnConstruccion titulo="Pedidos" />} />
          <Route path="/inventario" element={<EnConstruccion titulo="Inventario" />} />
          <Route path="/incidencias" element={<EnConstruccion titulo="Incidencias" />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}