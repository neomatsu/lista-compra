import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Card } from "../../components/Card";
import {
  CartIcon,
  CatalogIcon,
  CheckIcon,
  ListIcon,
  PlusIcon,
  ShareIcon,
  TrashIcon
} from "../../components/Icons";
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
  const [deleteCompradosOpen, setDeleteCompradosOpen] = useState(false);
  const toastTimerRef = useRef<number | null>(null);
  const sync = useSync();

  const {
    categorias,
    productosCatalogo,
    productosLista,
    addFromCatalog,
    addCatalogProduct,
    toggleCatalogFavorite,
    deleteCatalogProduct,
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

    setDeleteCompradosOpen(true);
  };

  const confirmDeleteComprados = async () => {
    setDeleteCompradosOpen(false);
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

  const totalCompra = pendientes.length + comprados.length;
  const progress = totalCompra ? Math.round((comprados.length / totalCompra) * 100) : 0;
  const isEmpty = !pendientes.length && !comprados.length;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-32 pt-3">
      {modoCompra ? (
        <header className="mb-5 rounded-[24px] bg-[var(--green-700)] p-5 text-[var(--ink-on-dark)] shadow-[var(--sh-card)]">
          <div className="mb-2 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] opacity-90">
            <CartIcon size={18} />
            Modo compra
          </div>
          <div className="mb-4 flex items-baseline gap-3">
            <span className="text-5xl font-black leading-none">{pendientes.length}</span>
            <span className="text-base font-bold opacity-90">
              por comprar · {comprados.length} en el carro
            </span>
          </div>
          <div className="mb-4 h-2 overflow-hidden rounded-[var(--r-pill)] bg-white/20">
            <div
              className="h-full rounded-[var(--r-pill)] bg-[#7BC79E] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Button
            fullWidth
            variant="secondary"
            className="border-transparent bg-[var(--bg)] text-[var(--green-700)] hover:bg-[var(--surface-2)]"
            onClick={() => setModoCompra(false)}
            aria-pressed={modoCompra}
          >
            <CheckIcon size={22} /> Terminar compra
          </Button>
        </header>
      ) : (
        <header className="mb-4 rounded-[24px] border border-[var(--surface-line)] bg-[var(--surface)] p-5 shadow-[var(--sh-card)]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-[var(--ink-3)]">
              Hoy
            </p>
          </div>
          <h1 className="text-[28px] font-black leading-tight text-[var(--ink)]">
            Lista de la compra
          </h1>
          <div className="mt-4 flex items-baseline gap-2">
            <span
              className={`text-5xl font-black leading-none ${
                pendientes.length ? "text-[var(--green-700)]" : "text-[var(--ink-3)]"
              }`}
            >
              {pendientes.length}
            </span>
            <span className="text-base font-bold text-[var(--ink-2)]">
              {pendientes.length === 1 ? "producto pendiente" : "productos pendientes"}
            </span>
          </div>
          <Button
            fullWidth
            variant="primary"
            className="mt-5"
            onClick={() => setModoCompra(true)}
            aria-pressed={modoCompra}
            disabled={!pendientes.length}
          >
            <CartIcon size={22} /> Empezar compra
          </Button>
        </header>
      )}

      {!modoCompra ? <SyncPanel sync={sync} onToast={pushToast} /> : null}

      <div className="space-y-5">
        {isEmpty && !modoCompra ? (
          <Card className="px-6 py-7 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[var(--green-50)] text-[var(--green-700)]">
              <CartIcon size={42} />
            </div>
            <h2 className="text-xl font-black text-[var(--ink)]">Tu lista está vacía</h2>
            <p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-[var(--ink-2)]">
              Añade productos desde el catálogo o crea uno nuevo.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Button fullWidth onClick={() => setCatalogoOpen(true)}>
                <PlusIcon size={20} /> Abrir catálogo
              </Button>
              <Button fullWidth variant="secondary" onClick={() => setCatalogoOpen(true)}>
                Crear producto nuevo
              </Button>
            </div>
          </Card>
        ) : (
          <ListaSection
            title="Por comprar"
            items={pendientes}
            categorias={categorias ?? []}
            emptyText="No hay productos pendientes."
            onToggle={toggleComprado}
            onCantidad={onCantidad}
            showQuantityControls={!modoCompra}
            purchaseMode={modoCompra}
          />
        )}

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
              variant="danger"
              onClick={() => void onDeleteComprados()}
            >
              <TrashIcon size={20} /> Eliminar productos comprados
            </Button>
          </>
        ) : comprados.length ? (
          <ListaSection
            title={`En el carro · ${comprados.length}`}
            items={comprados}
            categorias={categorias ?? []}
            emptyText=""
            onToggle={toggleComprado}
            onCantidad={onCantidad}
            showQuantityControls={false}
            purchaseMode={modoCompra}
          />
        ) : null}
      </div>

      <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--surface-line)] bg-[var(--surface)]/95 px-4 pt-2 shadow-[0_-8px_24px_rgba(31,42,38,0.08)] backdrop-blur">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-3 gap-1">
          <button className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-[var(--r-md)] bg-[var(--green-50)] text-sm font-extrabold text-[var(--green-700)]">
            <ListIcon size={22} />
            Mi lista
          </button>
          <button
            className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-[var(--r-md)] text-sm font-bold text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
            onClick={() => setCatalogoOpen(true)}
          >
            <CatalogIcon size={22} />
            Catálogo
          </button>
          {modoCompra ? (
            <button
              className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-[var(--r-md)] text-sm font-bold text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
              onClick={() => setModoCompra(false)}
            >
              <CheckIcon size={22} />
              Terminar
            </button>
          ) : (
            <button
              className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-[var(--r-md)] text-sm font-bold text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
              onClick={() => void onShare()}
            >
              <ShareIcon size={22} />
              Compartir
            </button>
          )}
        </div>
      </nav>

      <CatalogoPanel
        open={catalogoOpen}
        categorias={categorias ?? []}
        productos={productosCatalogo ?? []}
        onClose={() => setCatalogoOpen(false)}
        onAddCatalogo={(producto) => {
          void addFromCatalog(producto);
          pushToast(`${producto.nombre} añadido`);
        }}
        onToggleFavorito={(producto) => {
          void toggleCatalogFavorite(producto);
          const isFavorite = producto.favorito ?? ["Pan", "Leche", "Huevos", "Agua", "Papel higiénico", "Café"].includes(producto.nombre);
          pushToast(isFavorite ? `${producto.nombre} quitado de favoritos` : `${producto.nombre} añadido a favoritos`);
        }}
        onDeleteCatalogo={async (producto) => {
          const deleted = await deleteCatalogProduct(producto);
          pushToast(deleted ? `${producto.nombre} eliminado del catálogo` : "No se puede eliminar este producto");
        }}
        onCreateCatalogo={async (nombre, categoriaId, addToList) => {
          const result = await addCatalogProduct(nombre, categoriaId);
          if (result.status === "invalid-name") {
            pushToast("Escribe un producto");
            return false;
          }
          if (result.status === "invalid-category") {
            pushToast("Elige una categoría");
            return false;
          }
          if (result.status === "exists") {
            if (addToList) {
              await addFromCatalog(result.producto);
              pushToast(`${result.producto.nombre} añadido`);
              return true;
            }
            pushToast("Ese producto ya existe");
            return false;
          }

          if (addToList) {
            await addFromCatalog(result.producto);
            pushToast(`${result.producto.nombre} guardado y añadido`);
          } else {
            pushToast(`${result.producto.nombre} guardado`);
          }
          return true;
        }}
      />

      <Toast
        message={toast?.message ?? null}
        actionLabel={toast?.actionLabel}
        onAction={toast?.actionLabel === "Deshacer" ? () => void onUndoDelete() : undefined}
      />

      <ConfirmDialog
        open={deleteCompradosOpen}
        title="Eliminar comprados"
        message="Se quitarán de la lista todos los productos que ya has marcado como comprados."
        confirmLabel="Sí, eliminar"
        danger
        onCancel={() => setDeleteCompradosOpen(false)}
        onConfirm={() => void confirmDeleteComprados()}
      />
    </main>
  );
}
