import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/Button";
import { Toast } from "../../components/Toast";
import type { ProductoLista } from "../../db/db";
import { SyncPanel } from "../../sync/SyncPanel";
import { useSync } from "../../sync/useSync";
import { CatalogoPanel } from "../catalogo/CatalogoPanel";
import { ListaSection } from "./components/ListaSection";
import { useListaCompra } from "./hooks/useListaCompra";
import { formatListText } from "../../utils/formatListText";
import { shareList } from "../../utils/share";

interface ToastState {
  message: string;
  actionLabel?: string;
}

export function ListaCompraPage() {
  const [catalogoOpen, setCatalogoOpen] = useState(false);
  const [modoCompra, setModoCompra] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [lastDeleted, setLastDeleted] = useState<ProductoLista | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const sync = useSync();

  const {
    categorias,
    productosCatalogo,
    productosLista,
    addFromCatalog,
    addCustomProduct,
    toggleComprado,
    changeCantidad,
    removeComprados,
    removeItemById,
    restoreDeletedItem
  } = useListaCompra();

  const pendientes = useMemo(
    () => (productosLista ?? []).filter((item) => !item.comprado),
    [productosLista]
  );
  const comprados = useMemo(
    () => (productosLista ?? []).filter((item) => item.comprado),
    [productosLista]
  );

  const clearToastTimer = () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
  };

  const pushToast = (
    message: string,
    options?: { durationMs?: number; actionLabel?: string; keepUndo?: boolean }
  ) => {
    if (!options?.keepUndo && lastDeleted && options?.actionLabel !== "Deshacer") {
      return;
    }

    clearToastTimer();
    setToast({ message, actionLabel: options?.actionLabel });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      if (options?.actionLabel === "Deshacer") {
        setLastDeleted(null);
      }
      toastTimerRef.current = null;
    }, options?.durationMs ?? 2400);
  };

  useEffect(() => {
    return () => clearToastTimer();
  }, []);

  const onShare = async () => {
    try {
      if (pendientes.length === 0) {
        pushToast("La lista está vacía");
        return;
      }
      const text = formatListText(categorias ?? [], productosLista ?? []);
      const method = await shareList(text);
      if (method === "copied") {
        pushToast("Copiado al portapapeles");
      }
    } catch {
      pushToast("No se pudo compartir");
    }
  };

  const onDeleteComprados = async () => {
    if (!comprados.length) {
      pushToast("No hay productos comprados");
      return;
    }

    const confirmed = window.confirm("¿Eliminar todos los productos comprados?");
    if (!confirmed) {
      return;
    }

    await removeComprados();
    pushToast("Productos comprados eliminados");
  };

  const onCantidad = async (id: number, current: number, delta: number) => {
    if (delta < 0 && current === 1) {
      const deleted = await removeItemById(id);
      if (!deleted) {
        return;
      }
      setLastDeleted(deleted);
      pushToast(`${deleted.nombre} eliminado`, {
        durationMs: 7000,
        actionLabel: "Deshacer",
        keepUndo: true
      });
      return;
    }

    await changeCantidad(id, current, delta);
  };

  const onUndoDelete = async () => {
    if (!lastDeleted) {
      return;
    }

    await restoreDeletedItem(lastDeleted);
    const restoredName = lastDeleted.nombre;
    setLastDeleted(null);
    clearToastTimer();
    setToast(null);
    pushToast(`${restoredName} restaurado`);
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-3 pb-28 pt-3">
      <header className="mb-3 rounded-2xl border-2 border-slate-300 bg-white p-4 shadow-md">
        <h1 className="text-3xl font-extrabold text-slate-900">Lista de la compra</h1>
        <p className="mt-1 text-2xl font-bold text-slate-800">🛒 {pendientes.length} productos pendientes</p>
        <p className="mt-1 text-lg text-slate-700">Lista de hoy</p>
        <Button
          fullWidth
          variant={modoCompra ? "primary" : "secondary"}
          className="mt-3"
          onClick={() => setModoCompra((prev) => !prev)}
        >
          🛒 Modo compra {modoCompra ? "(Activo)" : ""}
        </Button>
      </header>

      <SyncPanel sync={sync} onToast={pushToast} />

      <div className="space-y-3">
        <ListaSection
          title="Por comprar"
          items={pendientes}
          categorias={categorias ?? []}
          emptyText="No hay productos pendientes."
          onToggle={toggleComprado}
          onCantidad={onCantidad}
          showQuantityControls={!modoCompra}
        />

        {!modoCompra ? (
          <>
            <ListaSection
              title="Comprados"
              items={comprados}
              categorias={categorias ?? []}
              emptyText="Aún no has marcado productos como comprados."
              onToggle={toggleComprado}
              onCantidad={onCantidad}
              showQuantityControls={!modoCompra}
            />
            <Button
              fullWidth
              variant="ghost"
              className="border-red-700 bg-red-50 text-red-800 hover:bg-red-100"
              onClick={() => void onDeleteComprados()}
            >
              🗑 Eliminar productos comprados
            </Button>
          </>
        ) : null}
      </div>

      <div className="safe-bottom fixed bottom-0 left-0 right-0 z-30 border-t-2 border-slate-400 bg-white p-3">
        <div className="mx-auto flex w-full max-w-3xl gap-2">
          <Button fullWidth onClick={() => setCatalogoOpen(true)}>
            Añadir productos
          </Button>
          <Button fullWidth variant="secondary" onClick={() => void onShare()}>
            Compartir
          </Button>
        </div>
      </div>

      <CatalogoPanel
        open={catalogoOpen}
        categorias={categorias ?? []}
        productos={productosCatalogo ?? []}
        onClose={() => setCatalogoOpen(false)}
        onAddCatalogo={(producto) => {
          void addFromCatalog(producto);
          pushToast(`${producto.nombre} añadido`);
        }}
        onAddPersonalizado={(nombre) => {
          void addCustomProduct(nombre);
          if (nombre.trim()) {
            pushToast(`${nombre.trim()} añadido`);
          }
        }}
      />

      <Toast
        message={toast?.message ?? null}
        actionLabel={toast?.actionLabel}
        onAction={toast?.actionLabel === "Deshacer" ? () => void onUndoDelete() : undefined}
      />
    </main>
  );
}
