import { useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import type { Categoria, ProductoCatalogo } from "../../db/db";

interface CatalogoPanelProps {
  open: boolean;
  categorias: Categoria[];
  productos: ProductoCatalogo[];
  onClose: () => void;
  onAddCatalogo: (producto: ProductoCatalogo) => void;
  onAddPersonalizado: (nombre: string) => void;
}

const HABITUALES = ["Pan", "Leche", "Huevos", "Agua", "Papel higiénico", "Café"];

export function CatalogoPanel({
  open,
  categorias,
  productos,
  onClose,
  onAddCatalogo,
  onAddPersonalizado
}: CatalogoPanelProps) {
  const [query, setQuery] = useState("");
  const [customName, setCustomName] = useState("");
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

  if (!open) {
    return null;
  }

  const toggleCategory = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isExpanded = (id: number) => expanded[id] ?? true;

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/40 p-2" role="dialog" aria-modal="true">
      <Card className="mx-auto flex h-full w-full max-w-2xl flex-col overflow-hidden border-2 border-slate-400">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Añadir productos</h2>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en el catálogo"
          className="mb-3 min-h-12 rounded-xl border-2 border-slate-400 px-4"
        />

        <div className="mb-3 flex-1 space-y-3 overflow-y-auto pr-1">
          {habituales.length ? (
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-2">
              <h3 className="mb-2 text-xl font-extrabold text-slate-900">⭐ Lo habitual</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {habituales.map((producto) => (
                  <Button
                    key={`habitual-${producto.id}`}
                    variant="secondary"
                    className="border-slate-600 bg-slate-200 text-left"
                    onClick={() => onAddCatalogo(producto)}
                  >
                    + {producto.nombre}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

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
              <div key={id} className="rounded-xl border-2 border-slate-300 bg-slate-50 p-2">
                <Button
                  variant="ghost"
                  fullWidth
                  className="justify-between text-left"
                  onClick={() => toggleCategory(id)}
                >
                  {categoria.nombre} {openCat ? "▲" : "▼"}
                </Button>
                {openCat ? (
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {catProducts.map((producto) => (
                      <Button
                        key={producto.id}
                        variant="secondary"
                        className="text-left"
                        onClick={() => onAddCatalogo(producto)}
                      >
                        + {producto.nombre}
                      </Button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="border-t-2 border-slate-300 pt-3">
          <p className="mb-2 font-semibold text-slate-900">Producto personalizado</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Escribe un producto"
              className="min-h-12 w-full flex-1 rounded-xl border-2 border-slate-400 px-4"
            />
            <Button
              fullWidth
              className="sm:w-auto"
              onClick={() => {
                onAddPersonalizado(customName);
                setCustomName("");
              }}
            >
              Añadir
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
