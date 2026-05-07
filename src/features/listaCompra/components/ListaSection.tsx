import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import type { Categoria, ProductoLista } from "../../../db/db";

interface ListaSectionProps {
  title: string;
  items: ProductoLista[];
  categorias: Categoria[];
  emptyText: string;
  onToggle: (id: number, comprado: boolean) => void;
  onCantidad: (id: number, current: number, delta: number) => void;
  showQuantityControls?: boolean;
  purchaseMode?: boolean;
}

export function ListaSection({
  title,
  items,
  categorias,
  emptyText,
  onToggle,
  onCantidad,
  showQuantityControls = true,
  purchaseMode = false
}: ListaSectionProps) {
  if (!items.length) {
    return (
      <Card title={title}>
        <p className="text-slate-700">{emptyText}</p>
      </Card>
    );
  }

  const grouped = groupByCategory(items, categorias);

  return (
    <Card title={title}>
      <div className="space-y-4">
        {grouped.map(({ categoryName, items: categoryItems }) => (
          <div key={categoryName} className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">{categoryName}</h3>
            <ul className="space-y-2">
              {categoryItems.map((item) => (
                <li
                  key={item.id}
                  className={`rounded-xl border-2 p-3 transition-all duration-200 ${
                    item.comprado
                      ? "border-green-500 bg-green-100"
                      : purchaseMode
                        ? "border-teal-700 bg-white"
                        : "border-slate-300 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      className={`flex flex-1 min-w-0 items-center gap-3 rounded-lg text-left ${
                        purchaseMode ? "min-h-16" : "min-h-14"
                      }`}
                      onClick={() => item.id && onToggle(item.id, item.comprado)}
                      aria-label={`${item.comprado ? "Marcar pendiente" : "Marcar comprado"} ${item.nombre}`}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          item.id && onToggle(item.id, item.comprado);
                        }
                      }}
                    >
                      {item.comprado ? (
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-700 text-2xl font-black text-white"
                          aria-hidden="true"
                        >
                          ✔
                        </span>
                      ) : null}
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block break-words text-lg font-semibold ${
                            item.comprado ? "text-slate-700 line-through" : "text-slate-900"
                          }`}
                        >
                          {item.nombre}
                        </span>
                      </span>
                    </button>

                    <div className="flex shrink-0 items-center gap-2">
                      {showQuantityControls ? (
                        <>
                          <Button
                            variant="primary"
                            className="h-12 w-12 border-slate-900 bg-slate-700 px-0 text-2xl leading-none hover:bg-slate-800"
                            onClick={(event) => {
                              event.stopPropagation();
                              item.id && onCantidad(item.id, item.cantidad, -1);
                            }}
                            aria-label={`Reducir cantidad de ${item.nombre}`}
                          >
                            -
                          </Button>
                          <span
                            className="min-w-10 text-center text-2xl font-extrabold text-slate-900"
                            aria-live="polite"
                          >
                            {item.cantidad}
                          </span>
                          <Button
                            variant="primary"
                            className="h-12 w-12 border-slate-900 bg-slate-700 px-0 text-2xl leading-none hover:bg-slate-800"
                            onClick={(event) => {
                              event.stopPropagation();
                              item.id && onCantidad(item.id, item.cantidad, +1);
                            }}
                            aria-label={`Aumentar cantidad de ${item.nombre}`}
                          >
                            +
                          </Button>
                        </>
                      ) : (
                        <span
                          className="min-w-12 rounded-lg bg-white px-3 py-2 text-center text-2xl font-extrabold text-slate-900"
                          aria-live="polite"
                          aria-label={`Cantidad ${item.cantidad}`}
                        >
                          {item.cantidad}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}

function groupByCategory(items: ProductoLista[], categorias: Categoria[]) {
  const nameById = new Map<number, string>(
    categorias
      .filter((c): c is Categoria & { id: number } => typeof c.id === "number")
      .map((c) => [c.id, c.nombre])
  );
  const grouped = new Map<string, ProductoLista[]>();

  for (const item of items) {
    const key = item.categoriaId ? (nameById.get(item.categoriaId) ?? "Otros") : "Otros";
    const existing = grouped.get(key) ?? [];
    existing.push(item);
    grouped.set(key, existing);
  }

  return Array.from(grouped.entries()).map(([categoryName, categoryItems]) => ({
    categoryName,
    items: categoryItems
  }));
}
