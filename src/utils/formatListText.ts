import type { Categoria, ProductoLista } from "../db/db";

export function formatListText(
  categorias: Categoria[],
  items: ProductoLista[]
): string {
  const pendientes = items.filter((item) => !item.comprado);
  const byCategory = new Map<number | "sin-categoria", ProductoLista[]>();

  for (const item of pendientes) {
    const key = item.categoriaId ?? "sin-categoria";
    const current = byCategory.get(key) ?? [];
    current.push(item);
    byCategory.set(key, current);
  }

  const lines: string[] = ["Lista de la compra:", ""];

  for (const categoria of categorias) {
    const categoryItems = byCategory.get(categoria.id ?? -1);
    if (!categoryItems?.length) {
      continue;
    }

    lines.push(`[${categoria.nombre}]`);
    for (const item of categoryItems) {
      lines.push(`- ${item.nombre} x${item.cantidad}`);
    }
    lines.push("");
  }

  const sinCategoria = byCategory.get("sin-categoria");
  if (sinCategoria?.length) {
    lines.push("[Otros]");
    for (const item of sinCategoria) {
      lines.push(`- ${item.nombre} x${item.cantidad}`);
    }
  }

  return lines.join("\n").trim();
}
