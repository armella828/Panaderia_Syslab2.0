import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, XCircle, CheckCircle, Search } from "lucide-react";

import Can from "../components/common/Can";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EstadoBadge from "../components/common/EstadoBadge";
import Modal from "../components/common/Modal";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import { botonPrimario, botonSecundario, etiquetaClase, inputClase } from "../components/common/estilos";
import { useToast } from "../context/ToastContext";
import { useApiLista } from "../hooks/useApiLista";
import type { Categoria, Producto, RespuestaApi } from "../interfaces";
import httpClient from "../services/httpClient";
import { obtenerMensajeError } from "../utils/errores";

interface FormularioProducto {
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  imagen: string;
  categoriaId: string;
}

const FORMULARIO_VACIO: FormularioProducto = {
  codigo: "",
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagen: "",
  categoriaId: "",
};

const formatoMoneda = (valor: string) =>
  new Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB" }).format(Number(valor));

export default function Productos() {
  const { datos: categorias } = useApiLista<Categoria>("/categorias");
  const { mostrarToast } = useToast();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [buscar, setBuscar] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [recargando, setRecargando] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [formulario, setFormulario] = useState<FormularioProducto>(FORMULARIO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [confirmando, setConfirmando] = useState<Producto | null>(null);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);

    try {
      const respuesta = await httpClient.get<RespuestaApi<Producto[]>>("/productos");
      setProductos(respuesta.data.data ?? []);
    } catch {
      setProductos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  const recargar = async () => {
    setCargando(true);
    await cargar();
    setCargando(false);
  };

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const aplicarFiltro = async () => {
    setRecargando(true);

    try {
      const parametros = new URLSearchParams();

      if (buscar.trim()) parametros.set("buscar", buscar.trim());
      if (filtroCategoria) parametros.set("categoria", filtroCategoria);

      const respuesta = await httpClient.get<RespuestaApi<Producto[]>>("/productos", {
        params: parametros,
      });
      setProductos(respuesta.data.data ?? []);
    } catch (e) {
      mostrarToast(obtenerMensajeError(e), "error");
    } finally {
      setRecargando(false);
    }
  };

  const abrirCrear = () => {
    setEditando(null);
    setFormulario({ ...FORMULARIO_VACIO, categoriaId: categorias[0] ? String(categorias[0].id) : "" });
    setModalAbierto(true);
  };

  const abrirEditar = (producto: Producto) => {
    setEditando(producto);
    setFormulario({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? "",
      precio: String(producto.precio),
      stock: String(producto.stock),
      imagen: producto.imagen ?? "",
      categoriaId: String(producto.categoriaId),
    });
    setModalAbierto(true);
  };

  const guardar = async (evento: FormEvent) => {
    evento.preventDefault();
    setGuardando(true);

    const cuerpo = {
      codigo: formulario.codigo,
      nombre: formulario.nombre,
      descripcion: formulario.descripcion || undefined,
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
      imagen: formulario.imagen || undefined,
      categoriaId: Number(formulario.categoriaId),
    };

    try {
      if (editando) {
        await httpClient.put(`/productos/${editando.id}`, cuerpo);
        mostrarToast("Producto actualizado correctamente");
      } else {
        await httpClient.post("/productos", cuerpo);
        mostrarToast("Producto creado correctamente");
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
      await httpClient.patch(`/productos/${confirmando.id}/estado`, { activo: !confirmando.activo });
      mostrarToast(confirmando.activo ? "Producto desactivado" : "Producto activado");
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
        titulo="Productos"
        descripcion="Administra el catálogo de productos de la panadería"
        acciones={
          <Can codigos="productos:crear">
            <button type="button" onClick={abrirCrear} className={botonPrimario}>
              <span className="flex items-center gap-2">
                <Plus size={16} />
                Nuevo producto
              </span>
            </button>
          </Can>
        }
      />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="relative min-w-52 flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            placeholder="Buscar por nombre o código..."
            className={`${inputClase} pl-9`}
          />
        </div>
        <div className="w-52">
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className={inputClase}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={aplicarFiltro}
          disabled={recargando}
          className={botonSecundario}
        >
          {recargando ? "Buscando..." : "Filtrar"}
        </button>
      </div>

      {cargando ? (
        <Spinner etiqueta="Cargando productos..." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="border-b border-gray-800/60 last:border-0">
                  <td className="px-4 py-3 text-gray-400">{producto.codigo}</td>
                  <td className="px-4 py-3 font-medium text-gray-100">{producto.nombre}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-300">
                      {producto.categoria.nombre}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{formatoMoneda(producto.precio)}</td>
                  <td className="px-4 py-3">
                    <span className={producto.stock === 0 ? "font-semibold text-red-400" : "text-gray-300"}>
                      {producto.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge activo={producto.activo} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Can codigos="productos:editar">
                        <button
                          type="button"
                          onClick={() => abrirEditar(producto)}
                          title="Editar"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-sky-300"
                        >
                          <Pencil size={16} />
                        </button>
                      </Can>
                      <Can codigos="productos:eliminar">
                        <button
                          type="button"
                          onClick={() => setConfirmando(producto)}
                          title={producto.activo ? "Desactivar" : "Activar"}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-red-300"
                        >
                          {producto.activo ? <XCircle size={16} /> : <CheckCircle size={16} />}
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
        titulo={editando ? "Editar producto" : "Nuevo producto"}
        onCerrar={() => setModalAbierto(false)}
      >
        <form onSubmit={guardar} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="codigo-prod" className={etiquetaClase}>
                Código
              </label>
              <input
                id="codigo-prod"
                required
                value={formulario.codigo}
                onChange={(e) => setFormulario({ ...formulario, codigo: e.target.value })}
                className={inputClase}
              />
            </div>
            <div>
              <label htmlFor="categoria-prod" className={etiquetaClase}>
                Categoría
              </label>
              <select
                id="categoria-prod"
                required
                value={formulario.categoriaId}
                onChange={(e) => setFormulario({ ...formulario, categoriaId: e.target.value })}
                className={inputClase}
              >
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="nombre-prod" className={etiquetaClase}>
              Nombre
            </label>
            <input
              id="nombre-prod"
              required
              value={formulario.nombre}
              onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
              className={inputClase}
            />
          </div>

          <div>
            <label htmlFor="descripcion-prod" className={etiquetaClase}>
              Descripción
            </label>
            <textarea
              id="descripcion-prod"
              rows={2}
              value={formulario.descripcion}
              onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
              className={inputClase}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="precio-prod" className={etiquetaClase}>
                Precio (Bs)
              </label>
              <input
                id="precio-prod"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={formulario.precio}
                onChange={(e) => setFormulario({ ...formulario, precio: e.target.value })}
                className={inputClase}
              />
            </div>
            <div>
              <label htmlFor="stock-prod" className={etiquetaClase}>
                Stock
              </label>
              <input
                id="stock-prod"
                type="number"
                min="0"
                step="1"
                required
                value={formulario.stock}
                onChange={(e) => setFormulario({ ...formulario, stock: e.target.value })}
                className={inputClase}
              />
            </div>
          </div>

          <div>
            <label htmlFor="imagen-prod" className={etiquetaClase}>
              Imagen (URL opcional)
            </label>
            <input
              id="imagen-prod"
              value={formulario.imagen}
              onChange={(e) => setFormulario({ ...formulario, imagen: e.target.value })}
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
              {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        abierto={confirmando !== null}
        titulo={confirmando?.activo ? "Desactivar producto" : "Activar producto"}
        mensaje={
          confirmando
            ? `¿Seguro que deseas ${confirmando.activo ? "desactivar" : "activar"} el producto "${confirmando.nombre}"?`
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