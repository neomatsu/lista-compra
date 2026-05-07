import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { CheckIcon, MinusIcon, PlusIcon } from "../../../components/Icons";
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
      <Card title={title} className="border-dashed bg-[var(--surface-2)] shadow-none">
        <p className="text-[var(--ink-2)]">{emptyText}</p>
      </Card>
    );
  }

  const grouped = groupByCategory(items, categorias);

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between px-1">
        <h2 className="text-xl font-extrabold text-[var(--ink)]">{title}</h2>
        <span className="text-sm font-bold text-[var(--ink-3)]">
          {grouped.length} {grouped.length === 1 ? "categoría" : "categorías"}
        </span>
      </div>
      <div className="space-y-6">
        {grouped.map(({ categoryName, items: categoryItems }) => (
          <div key={categoryName} className="space-y-2">
            <div className="flex items-center gap-3 px-1">
              <CategoryBadge name={categoryName} />
              <h3 className="text-[17px] font-extrabold text-[var(--ink)]">{categoryName}</h3>
              <span className="rounded-[var(--r-pill)] bg-[var(--surface-2)] px-2 py-0.5 text-sm font-bold text-[var(--ink-3)]">
                {categoryItems.length}
              </span>
            </div>
            <ul className="space-y-2">
              {categoryItems.map((item) => (
                <li
                  key={item.id}
                  className={`rounded-[var(--r-md)] border p-3 transition-all duration-200 ${
                    item.comprado
                      ? "border-[var(--surface-line)] bg-[var(--status-bought-bg)]"
                      : purchaseMode
                        ? "border-[var(--green-100)] bg-[var(--surface)]"
                        : "border-transparent bg-[var(--surface-2)]"
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
                      {purchaseMode || item.comprado ? (
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border-2 ${
                            item.comprado
                              ? "border-[var(--green-500)] bg-[var(--green-500)] text-white"
                              : "border-[var(--green-500)] bg-transparent text-transparent"
                          }`}
                          aria-hidden="true"
                        >
                          <CheckIcon size={20} />
                        </span>
                      ) : null}
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block break-words text-[19px] font-bold ${
                            item.comprado
                              ? "text-[var(--status-bought-fg)] line-through decoration-2"
                              : "text-[var(--ink)]"
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
                            className="h-12 w-12 min-h-12 rounded-xl px-0"
                            onClick={(event) => {
                              event.stopPropagation();
                              item.id && onCantidad(item.id, item.cantidad, -1);
                            }}
                            aria-label={`Reducir cantidad de ${item.nombre}`}
                          >
                            <MinusIcon size={22} />
                          </Button>
                          <span
                            className="min-w-10 text-center text-2xl font-extrabold text-[var(--ink)]"
                            aria-live="polite"
                          >
                            {item.cantidad}
                          </span>
                          <Button
                            variant="primary"
                            className="h-12 w-12 min-h-12 rounded-xl px-0"
                            onClick={(event) => {
                              event.stopPropagation();
                              item.id && onCantidad(item.id, item.cantidad, +1);
                            }}
                            aria-label={`Aumentar cantidad de ${item.nombre}`}
                          >
                            <PlusIcon size={22} />
                          </Button>
                        </>
                      ) : (
                        <span
                          className={`min-w-12 rounded-[10px] px-3 py-2 text-center text-2xl font-extrabold ${
                            item.comprado
                              ? "text-[var(--status-bought-fg)]"
                              : "bg-[var(--green-50)] text-[var(--green-700)]"
                          }`}
                          aria-live="polite"
                          aria-label={`Cantidad ${item.cantidad}`}
                        >
                          x{item.cantidad}
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
    </section>
  );
}

function CategoryBadge({ name }: { name: string }) {
  const style = getCategoryStyle(name);
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-lg font-black"
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
