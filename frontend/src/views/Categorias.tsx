import { useState, type FormEvent } from "react";
import { Pencil, Plus, XCircle, CheckCircle } from "lucide-react";

import Can from "../components/common/Can";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EstadoBadge from "../components/common/EstadoBadge";
import Modal from "../components/common/Modal";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import { botonPrimario, botonSecundario, etiquetaClase, inputClase } from "../components/common/estilos";
import { useToast } from "../context/ToastContext";
import { useApiLista } from "../hooks/useApiLista";
import type { Categoria } from "../interfaces";
import httpClient from "../services/httpClient";
import { obtenerMensajeError } from "../utils/errores";

interface FormularioCategoria {
  nombre: string;
  descripcion: string;
}

const FORMULARIO_VACIO: FormularioCategoria = { nombre: "", descripcion: "" };

export default function Categorias() {
  const { datos: categorias, cargando, recargar } = useApiLista<Categoria>("/categorias");
  const { mostrarToast } = useToast();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [formulario, setFormulario] = useState<FormularioCategoria>(FORMULARIO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [confirmando, setConfirmando] = useState<Categoria | null>(null);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const abrirCrear = () => {
    setEditando(null);
    setFormulario(FORMULARIO_VACIO);
    setModalAbierto(true);
  };

  const abrirEditar = (categoria: Categoria) => {
    setEditando(categoria);
    setFormulario({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? "",
    });
    setModalAbierto(true);
  };

  const guardar = async (evento: FormEvent) => {
    evento.preventDefault();
    setGuardando(true);

    const cuerpo = {
      nombre: formulario.nombre,
      descripcion: formulario.descripcion || undefined,
    };

    try {
      if (editando) {
        await httpClient.put(`/categorias/${editando.id}`, cuerpo);
        mostrarToast("Categoría actualizada correctamente");
      } else {
        await httpClient.post("/categorias", cuerpo);
        mostrarToast("Categoría creada correctamente");
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
      await httpClient.patch(`/categorias/${confirmando.id}/estado`, {
        activo: !confirmando.activo,
      });
      mostrarToast(confirmando.activo ? "Categoría desactivada" : "Categoría activada");
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
        titulo="Categorías"
        descripcion="Clasifica los productos de la panadería"
        acciones={
          <Can codigos="categorias:crear">
            <button type="button" onClick={abrirCrear} className={botonPrimario}>
              <span className="flex items-center gap-2">
                <Plus size={16} />
                Nueva categoría
              </span>
            </button>
          </Can>
        }
      />

      {cargando ? (
        <Spinner etiqueta="Cargando categorías..." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id} className="border-b border-gray-800/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-100">{categoria.nombre}</td>
                  <td className="px-4 py-3 text-gray-400">{categoria.descripcion ?? "—"}</td>
                  <td className="px-4 py-3">
                    <EstadoBadge activo={categoria.activo} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Can codigos="categorias:editar">
                        <button
                          type="button"
                          onClick={() => abrirEditar(categoria)}
                          title="Editar"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-sky-300"
                        >
                          <Pencil size={16} />
                        </button>
                      </Can>
                      <Can codigos="categorias:eliminar">
                        <button
                          type="button"
                          onClick={() => setConfirmando(categoria)}
                          title={categoria.activo ? "Desactivar" : "Activar"}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-red-300"
                        >
                          {categoria.activo ? <XCircle size={16} /> : <CheckCircle size={16} />}
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
        titulo={editando ? "Editar categoría" : "Nueva categoría"}
        onCerrar={() => setModalAbierto(false)}
      >
        <form onSubmit={guardar} className="space-y-4">
          <div>
            <label htmlFor="nombre-cat" className={etiquetaClase}>
              Nombre
            </label>
            <input
              id="nombre-cat"
              required
              value={formulario.nombre}
              onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
              className={inputClase}
            />
          </div>

          <div>
            <label htmlFor="descripcion-cat" className={etiquetaClase}>
              Descripción
            </label>
            <textarea
              id="descripcion-cat"
              rows={3}
              value={formulario.descripcion}
              onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
              className={inputClase}
            />
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
              {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear categoría"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        abierto={confirmando !== null}
        titulo={confirmando?.activo ? "Desactivar categoría" : "Activar categoría"}
        mensaje={
          confirmando
            ? `¿Seguro que deseas ${confirmando.activo ? "desactivar" : "activar"} la categoría "${confirmando.nombre}"?`
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