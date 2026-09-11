import { useMemo, useState, type FormEvent } from "react";
import { Pencil, Plus, ShieldOff, ShieldCheck } from "lucide-react";

import Can from "../components/common/Can";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EstadoBadge from "../components/common/EstadoBadge";
import Modal from "../components/common/Modal";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import { botonPrimario, botonSecundario, etiquetaClase, inputClase } from "../components/common/estilos";
import { useToast } from "../context/ToastContext";
import { useApiLista } from "../hooks/useApiLista";
import type { Permiso, Rol } from "../interfaces";
import httpClient from "../services/httpClient";
import { obtenerMensajeError } from "../utils/errores";

interface FormularioRol {
  nombre: string;
  descripcion: string;
  permisos: number[];
}

function agruparPermisos(permisos: Permiso[]): Record<string, Permiso[]> {
  return permisos.reduce<Record<string, Permiso[]>>((grupos, permiso) => {
    const modulo = permiso.codigo.split(":")[0] ?? "otros";
    (grupos[modulo] ??= []).push(permiso);
    return grupos;
  }, {});
}

export default function Roles() {
  const { datos: roles, cargando, recargar } = useApiLista<Rol>("/roles");
  const { datos: permisos } = useApiLista<Permiso>("/roles/permisos");
  const { mostrarToast } = useToast();

  const grupos = useMemo(() => agruparPermisos(permisos), [permisos]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Rol | null>(null);
  const [formulario, setFormulario] = useState<FormularioRol>({ nombre: "", descripcion: "", permisos: [] });
  const [guardando, setGuardando] = useState(false);
  const [confirmando, setConfirmando] = useState<Rol | null>(null);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const abrirCrear = () => {
    setEditando(null);
    setFormulario({ nombre: "", descripcion: "", permisos: [] });
    setModalAbierto(true);
  };

  const abrirEditar = (rol: Rol) => {
    setEditando(rol);
    setFormulario({
      nombre: rol.nombre,
      descripcion: rol.descripcion ?? "",
      permisos: rol.rolPermisos.map((rel) => rel.permiso.id),
    });
    setModalAbierto(true);
  };

  const alternarPermiso = (permisoId: number) => {
    setFormulario((prev) => ({
      ...prev,
      permisos: prev.permisos.includes(permisoId)
        ? prev.permisos.filter((id) => id !== permisoId)
        : [...prev.permisos, permisoId],
    }));
  };

  const guardar = async (evento: FormEvent) => {
    evento.preventDefault();
    setGuardando(true);

    const cuerpo = {
      nombre: formulario.nombre,
      descripcion: formulario.descripcion || undefined,
      permisos: formulario.permisos,
    };

    try {
      if (editando) {
        await httpClient.put(`/roles/${editando.id}`, cuerpo);
        mostrarToast("Rol actualizado correctamente");
      } else {
        await httpClient.post("/roles", cuerpo);
        mostrarToast("Rol creado correctamente");
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
      await httpClient.patch(`/roles/${confirmando.id}/estado`, { activo: !confirmando.activo });
      mostrarToast(confirmando.activo ? "Rol desactivado" : "Rol activado");
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
        titulo="Roles y permisos"
        descripcion="Define qué acciones puede realizar cada rol"
        acciones={
          <Can codigos="roles:crear">
            <button type="button" onClick={abrirCrear} className={botonPrimario}>
              <span className="flex items-center gap-2">
                <Plus size={16} />
                Nuevo rol
              </span>
            </button>
          </Can>
        }
      />

      {cargando ? (
        <Spinner etiqueta="Cargando roles..." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Permisos</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((rol) => (
                <tr key={rol.id} className="border-b border-gray-800/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-100">{rol.nombre}</td>
                  <td className="px-4 py-3 text-gray-400">{rol.descripcion ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-gray-300">
                      {rol.rolPermisos.length} permisos
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge activo={rol.activo} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Can codigos="roles:editar">
                        <button
                          type="button"
                          onClick={() => abrirEditar(rol)}
                          title="Editar"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-sky-300"
                        >
                          <Pencil size={16} />
                        </button>
                      </Can>
                      <Can codigos="roles:eliminar">
                        <button
                          type="button"
                          onClick={() => setConfirmando(rol)}
                          title={rol.activo ? "Desactivar" : "Activar"}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-red-300"
                        >
                          {rol.activo ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
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
        titulo={editando ? "Editar rol" : "Nuevo rol"}
        onCerrar={() => setModalAbierto(false)}
      >
        <form onSubmit={guardar} className="space-y-4">
          <div>
            <label htmlFor="nombre-rol" className={etiquetaClase}>
              Nombre
            </label>
            <input
              id="nombre-rol"
              required
              value={formulario.nombre}
              onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
              className={inputClase}
            />
          </div>

          <div>
            <label htmlFor="descripcion-rol" className={etiquetaClase}>
              Descripción
            </label>
            <input
              id="descripcion-rol"
              value={formulario.descripcion}
              onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
              className={inputClase}
            />
          </div>

          <div>
            <p className={etiquetaClase}>Permisos</p>
            <div className="max-h-72 space-y-3 overflow-y-auto rounded-lg border border-gray-700 p-3">
              {Object.entries(grupos).map(([modulo, lista]) => (
                <div key={modulo}>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-sky-400">
                    {modulo}
                  </p>
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {lista.map((permiso) => (
                      <label
                        key={permiso.id}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800"
                      >
                        <input
                          type="checkbox"
                          checked={formulario.permisos.includes(permiso.id)}
                          onChange={() => alternarPermiso(permiso.id)}
                          className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-sky-600"
                        />
                        <span title={permiso.descripcion}>{permiso.codigo}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

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
              {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear rol"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        abierto={confirmando !== null}
        titulo={confirmando?.activo ? "Desactivar rol" : "Activar rol"}
        mensaje={
          confirmando
            ? `¿Seguro que deseas ${confirmando.activo ? "desactivar" : "activar"} el rol "${confirmando.nombre}"?`
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