import { db, type Categoria, type ProductoCatalogo } from "./db";

const categoriasSeed: Categoria[] = [
  { id: 1, nombre: "Frutas y verduras", orden: 1 },
  { id: 2, nombre: "Carne y pescado", orden: 2 },
  { id: 3, nombre: "Lácteos", orden: 3 },
  { id: 4, nombre: "Panadería", orden: 4 },
  { id: 5, nombre: "Despensa", orden: 5 },
  { id: 6, nombre: "Bebidas", orden: 6 },
  { id: 7, nombre: "Limpieza", orden: 7 },
  { id: 8, nombre: "Cuidado personal", orden: 8 },
  { id: 9, nombre: "Hogar", orden: 9 }
];

const productosSeed: ProductoCatalogo[] = [
  { nombre: "Plátanos", categoriaId: 1 },
  { nombre: "Manzanas", categoriaId: 1 },
  { nombre: "Tomates", categoriaId: 1 },
  { nombre: "Lechuga", categoriaId: 1 },
  { nombre: "Cebollas", categoriaId: 1 },
  { nombre: "Patatas", categoriaId: 1 },
  { nombre: "Pollo", categoriaId: 2 },
  { nombre: "Carne picada", categoriaId: 2 },
  { nombre: "Atún", categoriaId: 2 },
  { nombre: "Salmón", categoriaId: 2 },
  { nombre: "Leche", categoriaId: 3 },
  { nombre: "Yogur", categoriaId: 3 },
  { nombre: "Queso", categoriaId: 3 },
  { nombre: "Mantequilla", categoriaId: 3 },
  { nombre: "Pan", categoriaId: 4 },
  { nombre: "Pan de molde", categoriaId: 4 },
  { nombre: "Croissants", categoriaId: 4 },
  { nombre: "Arroz", categoriaId: 5 },
  { nombre: "Pasta", categoriaId: 5 },
  { nombre: "Aceite de oliva", categoriaId: 5 },
  { nombre: "Café", categoriaId: 5 },
  { nombre: "Azúcar", categoriaId: 5 },
  { nombre: "Harina", categoriaId: 5 },
  { nombre: "Huevos", categoriaId: 5 },
  { nombre: "Agua", categoriaId: 6 },
  { nombre: "Zumo", categoriaId: 6 },
  { nombre: "Refrescos", categoriaId: 6 },
  { nombre: "Detergente", categoriaId: 7 },
  { nombre: "Lavavajillas", categoriaId: 7 },
  { nombre: "Lejía", categoriaId: 7 },
  { nombre: "Esponjas", categoriaId: 7 },
  { nombre: "Bolsas de basura", categoriaId: 7 },
  { nombre: "Champú", categoriaId: 8 },
  { nombre: "Pasta de dientes", categoriaId: 8 },
  { nombre: "Jabón", categoriaId: 8 },
  { nombre: "Desodorante", categoriaId: 8 },
  { nombre: "Papel de cocina", categoriaId: 9 },
  { nombre: "Papel higiénico", categoriaId: 9 },
  { nombre: "Papel aluminio", categoriaId: 9 },
  { nombre: "Film transparente", categoriaId: 9 }
];

const SEED_VERSION = "2";

export async function ensureSeedData(): Promise<void> {
  const existing = await db.configuracion.get("seedVersion");
  if (existing?.valor === SEED_VERSION) {
    return;
  }

  await db.transaction(
    "rw",
    db.categorias,
    db.productosCatalogo,
    db.configuracion,
    async () => {
      await db.categorias.clear();
      await db.productosCatalogo.clear();
      await db.categorias.bulkAdd(categoriasSeed);
      await db.productosCatalogo.bulkAdd(productosSeed);
      await db.configuracion.put({ clave: "seedVersion", valor: SEED_VERSION });
    }
  );
}
