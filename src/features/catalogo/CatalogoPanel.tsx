import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import {
  ChevronRightIcon,
  CloseIcon,
  PlusIcon,
  SearchIcon,
  StarIcon
} from "../../components/Icons";
import type { Categoria, ProductoCatalogo } from "../../db/db";

interface CatalogoPanelProps {
  open: boolean;
  categorias: Categoria[];
  productos: ProductoCatalogo[];
  onClose: () => void;
  onAddCatalogo: (producto: ProductoCatalogo) => void;
  onCreateCatalogo: (
    nombre: string,
    categoriaId: number,
    addToList: boolean
  ) => Promise<boolean>;
}

const HABITUALES = ["Pan", "Leche", "Huevos", "Agua", "Papel higiénico", "Café"];

export function CatalogoPanel({
  open,
  categorias,
  productos,
  onClose,
  onAddCatalogo,
  onCreateCatalogo
}: CatalogoPanelProps) {
  const [query, setQuery] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) {
      return productos;
    }
    return productos.filter((p) => normalize(p.nombre).includes(q));
  }, [productos, query]);

  const habituales = useMemo(
    () => filtered.filter((producto) => HABITUALES.includes(producto.nombre)),
    [filtered]
  );

  useEffect(() => {
    if (!categorias.length) {
      setSelectedCategoryId("");
      return;
    }

    const hasSelectedCategory = categorias.some(
      (categoria) => String(categoria.id ?? "") === selectedCategoryId
    );
    if (!hasSelectedCategory) {
      setSelectedCategoryId(String(categorias[0].id ?? ""));
    }
  }, [categorias, selectedCategoryId]);

  if (!open) {
    return null;
  }

  const toggleCategory = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isExpanded = (id: number) => expanded[id] ?? true;

  const handleCreateCatalogo = async (addToList: boolean) => {
    const categoryId = Number(selectedCategoryId);
    const saved = await onCreateCatalogo(newProductName, categoryId, addToList);
    if (saved) {
      setNewProductName("");
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-[var(--bg)]" role="dialog" aria-modal="true">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
        <div className="shrink-0 border-b border-[var(--surface-line)] bg-[var(--bg)] px-4 pb-3 pt-3">
          <div className="mb-3 flex items-center gap-3">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-[var(--r-md)] border border-[var(--surface-line)] bg-[var(--surface)] text-[var(--ink)]"
              onClick={onClose}
              aria-label="Cerrar catálogo"
            >
              <CloseIcon size={22} />
            </button>
            <h2 className="text-2xl font-black text-[var(--ink)]">Catálogo</h2>
          </div>
          <div className="relative">
            <SearchIcon
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-3)]"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto"
              className="min-h-14 w-full rounded-[var(--r-md)] border border-[var(--surface-line-strong)] bg-[var(--surface)] px-4 pl-12 text-[17px] text-[var(--ink)]"
            />
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 pb-36">
          {habituales.length ? (
            <Card className="border-[#F0DFAB] bg-[#FFF8E2]">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--amber-500)] text-white">
                  <StarIcon size={18} />
                </span>
                <h3 className="text-xl font-black text-[var(--ink)]">Lo habitual</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {habituales.map((producto) => (
                  <button
                    key={`habitual-${producto.id}`}
                    className="inline-flex min-h-11 items-center gap-1 rounded-[var(--r-pill)] border border-[#E6CF8E] bg-[#FFFDF5] px-4 text-base font-bold text-[#5C4514]"
                    onClick={() => onAddCatalogo(producto)}
                    aria-label={`Añadir ${producto.nombre}`}
                  >
                    <PlusIcon size={18} /> {producto.nombre}
                  </button>
                ))}
              </div>
            </Card>
          ) : null}

          <div className="space-y-3">
            {categorias.map((categoria) => {
              const id = categoria.id ?? -1;
              const catProducts = filtered.filter(
                (p) => p.categoriaId === id && !HABITUALES.includes(p.nombre)
              );
              if (!catProducts.length) {
                return null;
              }

              const openCat = isExpanded(id);
              return (
                <Card key={id} className="overflow-hidden p-0">
                  <button
                    className="flex min-h-16 w-full items-center gap-3 px-4 text-left"
                    onClick={() => toggleCategory(id)}
                  >
                    <CategoryBadge name={categoria.nombre} />
                    <span className="flex-1 text-lg font-black text-[var(--ink)]">
                      {categoria.nombre}
                    </span>
                    <span className="rounded-[var(--r-pill)] bg-[var(--surface-2)] px-2 py-0.5 text-sm font-bold text-[var(--ink-3)]">
                      {catProducts.length}
                    </span>
                    <ChevronRightIcon
                      size={20}
                      className={`text-[var(--ink-3)] transition ${openCat ? "rotate-90" : ""}`}
                    />
                  </button>
                  {openCat ? (
                    <div className="grid grid-cols-1 gap-2 border-t border-[var(--surface-line)] p-3 sm:grid-cols-2">
                      {catProducts.map((producto) => (
                        <button
                          key={producto.id}
                          className="flex min-h-12 items-center gap-2 rounded-[var(--r-md)] bg-[var(--surface-2)] px-4 text-left text-base font-bold text-[var(--ink)]"
                          onClick={() => onAddCatalogo(producto)}
                          aria-label={`Añadir ${producto.nombre}`}
                        >
                          <PlusIcon size={18} className="text-[var(--green-600)]" />
                          {producto.nombre}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </Card>
              );
            })}
          </div>

          <Card>
            <h3 className="mb-3 text-xl font-black text-[var(--ink)]">Nuevo producto</h3>
            <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
              <label className="flex flex-col gap-1 font-bold text-[var(--ink)]">
                Nombre
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Escribe un producto"
                  className="min-h-14 w-full rounded-[var(--r-md)] border border-[var(--surface-line-strong)] bg-[var(--surface)] px-4 font-normal"
                  aria-label="Nombre del nuevo producto"
                />
              </label>
              <label className="flex flex-col gap-1 font-bold text-[var(--ink)]">
                Categoría
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="min-h-14 w-full rounded-[var(--r-md)] border border-[var(--surface-line-strong)] bg-[var(--surface)] px-4 font-normal"
                >
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Button
                fullWidth
                onClick={() => void handleCreateCatalogo(true)}
                disabled={!categorias.length}
              >
                Guardar y añadir
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => void handleCreateCatalogo(false)}
                disabled={!categorias.length}
              >
                Solo guardar
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CategoryBadge({ name }: { name: string }) {
  const style = getCategoryStyle(name);
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-lg font-black"
      style={{ backgroundColor: style.bg, color: style.fg }}
      aria-hidden="true"
    >
      {style.icon}
    </span>
  );
}

function getCategoryStyle(name: string) {
  if (name.includes("Despensa")) {
    return { bg: "#F2EAD6", fg: "#7A5B1E", icon: "▣" };
  }
  if (name.includes("Lácteos")) {
    return { bg: "#EAF1F4", fg: "#2F5D6E", icon: "▯" };
  }
  if (name.includes("Frutas")) {
    return { bg: "#E6EFDC", fg: "#3F6B23", icon: "⌁" };
  }
  if (name.includes("Carne")) {
    return { bg: "#F4E2DC", fg: "#8C3A26", icon: "◒" };
  }
  if (name.includes("Panadería")) {
    return { bg: "#F4EAD8", fg: "#7A5821", icon: "◡" };
  }
  if (name.includes("Bebidas")) {
    return { bg: "#E5ECF1", fg: "#2E5475", icon: "♢" };
  }
  if (name.includes("Limpieza") || name.includes("Hogar")) {
    return { bg: "#EFE7DC", fg: "#6E5638", icon: "⌂" };
  }
  return { bg: "#EBE7DD", fg: "#5C5440", icon: "?" };
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
