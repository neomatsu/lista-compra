import { useLiveQuery } from "dexie-react-hooks";
import { db, type ProductoCatalogo, type ProductoLista } from "../../../db/db";
import {
  enqueueCatalogUpsert,
  enqueueDelete,
  enqueueUpsert
} from "../../../sync/syncService";

export type AddCatalogProductResult =
  | { status: "created"; producto: ProductoCatalogo & { id: number } }
  | { status: "exists"; producto: ProductoCatalogo & { id: number } }
  | { status: "invalid-name" }
  | { status: "invalid-category" };

export function useListaCompra() {
  const categorias = useLiveQuery(() => db.categorias.orderBy("orden").toArray(), []);
  const productosCatalogo = useLiveQuery(
    () =>
      db.productosCatalogo
        .orderBy("nombre")
        .filter((producto) => !producto.deleted)
        .toArray(),
    []
  );
  const productosLista = useLiveQuery(
    () => db.productosLista.orderBy("createdAt").toArray(),
    []
  );

  const addFromCatalog = async (producto: ProductoCatalogo) => {
    const now = Date.now();
    const existingByCatalogId = await db.productosLista
      .where("productoCatalogoId")
      .equals(producto.id ?? -1)
      .first();
    const existing =
      existingByCatalogId ??
      (await db.productosLista
        .filter((item) => normalizeText(item.nombre) === normalizeText(producto.nombre))
        .first());

    if (existing?.id && typeof existing.id === "number") {
      const updatedItem: ProductoLista = {
        ...existing,
        cantidad: existing.cantidad + 1,
        comprado: false,
        updatedAt: now
      };
      await db.productosLista.put(updatedItem);
      await enqueueUpsert({ ...updatedItem, id: existing.id });
      return;
    }

    const created: ProductoLista = {
      productoCatalogoId: producto.id,
      nombre: producto.nombre,
      categoriaId: producto.categoriaId,
      cantidad: 1,
      comprado: false,
      createdAt: now,
      updatedAt: now
    };
    const id = await db.productosLista.add(created);
    await enqueueUpsert({ ...created, id });
  };

  const addCustomProduct = async (nombre: string) => {
    const cleanName = nombre.trim();
    if (!cleanName) {
      return;
    }

    const now = Date.now();
    const normalized = cleanName.toLowerCase();
    const existing = await db.productosLista
      .filter((item) => item.nombre.toLowerCase() === normalized)
      .first();

    if (existing?.id && typeof existing.id === "number") {
      const updatedItem: ProductoLista = {
        ...existing,
        cantidad: existing.cantidad + 1,
        comprado: false,
        updatedAt: now
      };
      await db.productosLista.put(updatedItem);
      await enqueueUpsert({ ...updatedItem, id: existing.id });
      return;
    }

    const created: ProductoLista = {
      nombreLibre: cleanName,
      nombre: cleanName,
      cantidad: 1,
      comprado: false,
      createdAt: now,
      updatedAt: now
    };
    const id = await db.productosLista.add(created);
    await enqueueUpsert({ ...created, id });
  };

  const addCatalogProduct = async (
    nombre: string,
    categoriaId: number
  ): Promise<AddCatalogProductResult> => {
    const cleanName = nombre.trim();
    if (!cleanName) {
      return { status: "invalid-name" };
    }

    const category = await db.categorias.get(categoriaId);
    if (!category) {
      return { status: "invalid-category" };
    }

    const normalized = normalizeText(cleanName);
    const existing = await db.productosCatalogo
      .filter(
        (producto) =>
          !producto.deleted &&
          producto.categoriaId === categoriaId &&
          normalizeText(producto.nombre) === normalized
      )
      .first();

    if (existing?.id && typeof existing.id === "number") {
      return { status: "exists", producto: { ...existing, id: existing.id } };
    }

    const now = Date.now();
    const created: ProductoCatalogo = {
      nombre: cleanName,
      categoriaId,
      origen: "usuario",
      createdAt: now,
      updatedAt: now
    };
    const id = await db.productosCatalogo.add(created);
    const producto = { ...created, id };
    await enqueueCatalogUpsert(producto);
    return { status: "created", producto };
  };

  const toggleComprado = async (id: number, comprado: boolean) => {
    const item = await db.productosLista.get(id);
    if (!item) {
      return;
    }
    const updatedItem: ProductoLista = {
      ...item,
      comprado: !comprado,
      updatedAt: Date.now()
    };
    await db.productosLista.put({ ...updatedItem, id });
    await enqueueUpsert({ ...updatedItem, id });
  };

  const changeCantidad = async (id: number, current: number, delta: number) => {
    const item = await db.productosLista.get(id);
    if (!item) {
      return;
    }
    const nuevaCantidad = Math.max(1, current + delta);
    const updatedItem: ProductoLista = {
      ...item,
      cantidad: nuevaCantidad,
      updatedAt: Date.now()
    };
    await db.productosLista.put({ ...updatedItem, id });
    await enqueueUpsert({ ...updatedItem, id });
  };

  const removeComprados = async () => {
    const items = await db.productosLista.filter((item) => item.comprado).toArray();
    if (!items.length) {
      return;
    }
    await db.transaction("rw", db.productosLista, db.outbox, db.syncMap, async () => {
      for (const item of items) {
        if (!item.id) {
          continue;
        }
        await db.productosLista.delete(item.id);
        await enqueueDelete(item);
      }
    });
  };

  const removeItemById = async (id: number): Promise<ProductoLista | null> => {
    const item = await db.productosLista.get(id);
    if (!item) {
      return null;
    }
    await db.productosLista.delete(id);
    await enqueueDelete({ ...item, id });
    return item;
  };

  const restoreDeletedItem = async (item: ProductoLista) => {
    const { id, ...withoutId } = item;
    void id;
    const restored: ProductoLista = {
      ...withoutId,
      updatedAt: Date.now()
    };
    const restoredId = await db.productosLista.add(restored);
    await enqueueUpsert({ ...restored, id: restoredId });
  };

  return {
    categorias,
    productosCatalogo,
    productosLista,
    addFromCatalog,
    addCustomProduct,
    addCatalogProduct,
    toggleComprado,
    changeCantidad,
    removeComprados,
    removeItemById,
    restoreDeletedItem
  };
}

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
