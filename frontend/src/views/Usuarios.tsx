import { useState, type FormEvent } from "react";
import { Pencil, Plus, UserX, UserCheck } from "lucide-react";

import Can from "../components/common/Can";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EstadoBadge from "../components/common/EstadoBadge";
import Modal from "../components/common/Modal";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import { botonPrimario, botonSecundario, etiquetaClase, inputClase } from "../components/common/estilos";
import { useToast } from "../context/ToastContext";
import { useApiLista } from "../hooks/useApiLista";
import type { Rol, Usuario } from "../interfaces";
import httpClient from "../services/httpClient";
import { obtenerMensajeError } from "../utils/errores";

interface FormularioUsuario {
  nombre: string;
  correo: string;
  password: string;
  rolId: string;
  esGlobal: boolean;
}

const FORMULARIO_VACIO: FormularioUsuario = {
  nombre: "",
  correo: "",
  password: "",
  rolId: "",
  esGlobal: false,
};

export default function Usuarios() {
  const { datos: usuarios, cargando, recargar } = useApiLista<Usuario>("/usuarios");
  const { datos: roles } = useApiLista<Rol>("/roles");
  const { mostrarToast } = useToast();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [formulario, setFormulario] = useState<FormularioUsuario>(FORMULARIO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [confirmando, setConfirmando] = useState<Usuario | null>(null);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const abrirCrear = () => {
    setEditando(null);
    setFormulario({ ...FORMULARIO_VACIO, rolId: roles[0] ? String(roles[0].id) : "" });
    setModalAbierto(true);
  };

  const abrirEditar = (usuario: Usuario) => {
    setEditando(usuario);
    setFormulario({
      nombre: usuario.nombre,
      correo: usuario.correo,
      password: "",
      rolId: String(usuario.rolId),
      esGlobal: usuario.esGlobal,
    });
    setModalAbierto(true);
  };

  const guardar = async (evento: FormEvent) => {
    evento.preventDefault();
    setGuardando(true);

    const cuerpo = {
      nombre: formulario.nombre,
      correo: formulario.correo,
      rolId: Number(formulario.rolId),
      esGlobal: formulario.esGlobal,
      password: formulario.password || undefined,
    };

    try {
      if (editando) {
        await httpClient.put(`/usuarios/${editando.id}`, cuerpo);
        mostrarToast("Usuario actualizado correctamente");
      } else {
        await httpClient.post("/usuarios", cuerpo);
        mostrarToast("Usuario creado correctamente");
      }
      setModalAbierto(false);
      await recargar();
    } catch (e) {
      mostrarToast(obtenerMensajeError(e), "error");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async () => {
    if (!confirmando) return;

    setCambiandoEstado(true);

    try {
      await httpClient.patch(`/usuarios/${confirmando.id}/estado`, {
        activo: !confirmando.activo,
      });
      mostrarToast(
        confirmando.activo ? "Usuario desactivado" : "Usuario activado"
      );
      setConfirmando(null);
      await recargar();
    } catch (e) {
      mostrarToast(obtenerMensajeError(e), "error");
    } finally {
      setCambiandoEstado(false);
    }
  };

  return (
    <div>
      <PageHeader
        titulo="Usuarios"
        descripcion="Administra las cuentas que acceden al sistema"
        acciones={
          <Can codigos="usuarios:crear">
            <button type="button" onClick={abrirCrear} className={botonPrimario}>
              <span className="flex items-center gap-2">
                <Plus size={16} />
                Nuevo usuario
              </span>
            </button>
          </Can>
        }
      />

      {cargando ? (
        <Spinner etiqueta="Cargando usuarios..." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-gray-800/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-100">{usuario.nombre}</td>
                  <td className="px-4 py-3 text-gray-400">{usuario.correo}</td>
                  <td className="px-4 py-3 text-gray-300">{usuario.rol.nombre}</td>
                  <td className="px-4 py-3">
                    {usuario.esGlobal ? (
                      <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-300">
                        Global
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Normal</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge activo={usuario.activo} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Can codigos="usuarios:editar">
                        <button
                          type="button"
                          onClick={() => abrirEditar(usuario)}
                          title="Editar"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-sky-300"
                        >
                          <Pencil size={16} />
                        </button>
                      </Can>
                      <Can codigos="usuarios:eliminar">
                        <button
                          type="button"
                          onClick={() => setConfirmando(usuario)}
                          title={usuario.activo ? "Desactivar" : "Activar"}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-red-300"
                        >
                          {usuario.activo ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                      </Can>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        abierto={modalAbierto}
        titulo={editando ? "Editar usuario" : "Nuevo usuario"}
        onCerrar={() => setModalAbierto(false)}
      >
        <form onSubmit={guardar} className="space-y-4">
          <div>
            <label htmlFor="nombre" className={etiquetaClase}>
              Nombre completo
            </label>
            <input
              id="nombre"
              required
              value={formulario.nombre}
              onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
              className={inputClase}
            />
          </div>

          <div>
            <label htmlFor="correo" className={etiquetaClase}>
              Correo electrónico
            </label>
            <input
              id="correo"
              type="email"
              required
              value={formulario.correo}
              onChange={(e) => setFormulario({ ...formulario, correo: e.target.value })}
              className={inputClase}
            />
          </div>

          <div>
            <label htmlFor="rol" className={etiquetaClase}>
              Rol
            </label>
            <select
              id="rol"
              required
              value={formulario.rolId}
              onChange={(e) => setFormulario({ ...formulario, rolId: e.target.value })}
              className={inputClase}
            >
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="password" className={etiquetaClase}>
              {editando ? "Nueva contraseña (opcional)" : "Contraseña (vacío = autogenerada)"}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={formulario.password}
              onChange={(e) => setFormulario({ ...formulario, password: e.target.value })}
              className={inputClase}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={formulario.esGlobal}
              onChange={(e) => setFormulario({ ...formulario, esGlobal: e.target.checked })}
              className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-sky-600"
            />
            Acceso global (accede a todo sin restricciones)
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalAbierto(false)}
              disabled={guardando}
              className={botonSecundario}
            >
              Cancelar
            </button>
            <button type="submit" disabled={guardando} className={botonPrimario}>
              {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        abierto={confirmando !== null}
        titulo={confirmando?.activo ? "Desactivar usuario" : "Activar usuario"}
        mensaje={
          confirmando
            ? `¿Seguro que deseas ${confirmando.activo ? "desactivar" : "activar"} a "${confirmando.nombre}"?`
            : ""
        }
        textoConfirmar={confirmando?.activo ? "Desactivar" : "Activar"}
        onConfirmar={cambiarEstado}
        onCancelar={() => setConfirmando(null)}
        cargando={cambiandoEstado}
      />
    </div>
  );
}