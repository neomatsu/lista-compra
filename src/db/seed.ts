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
  { nombre: "Aguacate", categoriaId: 1 },
  { nombre: "Ajo", categoriaId: 1 },
  { nombre: "Apio", categoriaId: 1 },
  { nombre: "Brócoli", categoriaId: 1 },
  { nombre: "Calabacín", categoriaId: 1 },
  { nombre: "Espárragos verdes", categoriaId: 1 },
  { nombre: "Espinacas", categoriaId: 1 },
  { nombre: "Frambuesas", categoriaId: 1 },
  { nombre: "Fresas", categoriaId: 1 },
  { nombre: "Fruta de temporada", categoriaId: 1 },
  { nombre: "Judías verdes", categoriaId: 1 },
  { nombre: "Kiwi", categoriaId: 1 },
  { nombre: "Limones", categoriaId: 1 },
  { nombre: "Mandarinas", categoriaId: 1 },
  { nombre: "Naranjas", categoriaId: 1 },
  { nombre: "Pera", categoriaId: 1 },
  { nombre: "Pimiento verde", categoriaId: 1 },
  { nombre: "Pimientos", categoriaId: 1 },
  { nombre: "Puerro", categoriaId: 1 },
  { nombre: "Tomates cherry", categoriaId: 1 },
  { nombre: "Zanahorias", categoriaId: 1 },
  { nombre: "Pollo", categoriaId: 2 },
  { nombre: "Carne picada", categoriaId: 2 },
  { nombre: "Atún", categoriaId: 2 },
  { nombre: "Salmón", categoriaId: 2 },
  { nombre: "Bacalao", categoriaId: 2 },
  { nombre: "Dorada", categoriaId: 2 },
  { nombre: "Lubina", categoriaId: 2 },
  { nombre: "Marisco", categoriaId: 2 },
  { nombre: "Merluza", categoriaId: 2 },
  { nombre: "Pechuga de pollo", categoriaId: 2 },
  { nombre: "Pescado blanco", categoriaId: 2 },
  { nombre: "Sardinas", categoriaId: 2 },
  { nombre: "Leche", categoriaId: 3 },
  { nombre: "Yogur", categoriaId: 3 },
  { nombre: "Queso", categoriaId: 3 },
  { nombre: "Mantequilla", categoriaId: 3 },
  { nombre: "Leche semidesnatada", categoriaId: 3 },
  { nombre: "Leche vegetal", categoriaId: 3 },
  { nombre: "Yogur griego 0%", categoriaId: 3 },
  { nombre: "Yogur griego light", categoriaId: 3 },
  { nombre: "Yogur natural 0%", categoriaId: 3 },
  { nombre: "Pan", categoriaId: 4 },
  { nombre: "Pan de molde", categoriaId: 4 },
  { nombre: "Croissants", categoriaId: 4 },
  { nombre: "Pan integral", categoriaId: 4 },
  { nombre: "Tostadas integrales", categoriaId: 4 },
  { nombre: "Arroz", categoriaId: 5 },
  { nombre: "Pasta", categoriaId: 5 },
  { nombre: "Aceite de oliva", categoriaId: 5 },
  { nombre: "Café", categoriaId: 5 },
  { nombre: "Azúcar", categoriaId: 5 },
  { nombre: "Harina", categoriaId: 5 },
  { nombre: "Huevos", categoriaId: 5 },
  { nombre: "Almendras", categoriaId: 5 },
  { nombre: "Avena", categoriaId: 5 },
  { nombre: "Cacao puro", categoriaId: 5 },
  { nombre: "Caldo de verduras", categoriaId: 5 },
  { nombre: "Caldo desgrasado", categoriaId: 5 },
  { nombre: "Canela", categoriaId: 5 },
  { nombre: "Chocolate negro 85%", categoriaId: 5 },
  { nombre: "Dátiles", categoriaId: 5 },
  { nombre: "Eneldo", categoriaId: 5 },
  { nombre: "Fideos finos", categoriaId: 5 },
  { nombre: "Garbanzos", categoriaId: 5 },
  { nombre: "Judías blancas", categoriaId: 5 },
  { nombre: "Laurel", categoriaId: 5 },
  { nombre: "Lentejas pardinas", categoriaId: 5 },
  { nombre: "Miel", categoriaId: 5 },
  { nombre: "Nueces", categoriaId: 5 },
  { nombre: "Olivas", categoriaId: 5 },
  { nombre: "Perejil", categoriaId: 5 },
  { nombre: "Pimentón dulce", categoriaId: 5 },
  { nombre: "Pimienta", categoriaId: 5 },
  { nombre: "Sal", categoriaId: 5 },
  { nombre: "Stevia", categoriaId: 5 },
  { nombre: "Tomillo", categoriaId: 5 },
  { nombre: "Vinagre", categoriaId: 5 },
  { nombre: "Agua", categoriaId: 6 },
  { nombre: "Zumo", categoriaId: 6 },
  { nombre: "Refrescos", categoriaId: 6 },
  { nombre: "Infusiones", categoriaId: 6 },
  { nombre: "Infusión de canela", categoriaId: 6 },
  { nombre: "Infusión de jengibre", categoriaId: 6 },
  { nombre: "Infusión de manzanilla", categoriaId: 6 },
  { nombre: "Infusión de menta", categoriaId: 6 },
  { nombre: "Infusión de rooibos", categoriaId: 6 },
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
].map((producto) => ({ ...producto, origen: "seed" }));

const SEED_VERSION = "3";

export async function ensureSeedData(): Promise<void> {
  const existing = await db.configuracion.get("seedVersion");
  if (existing?.valor === SEED_VERSION) {
    return;
  }

  const now = Date.now();

  await db.transaction(
    "rw",
    db.categorias,
    db.productosCatalogo,
    db.configuracion,
    async () => {
      await db.categorias.bulkPut(categoriasSeed);

      const existingProducts = await db.productosCatalogo
        .filter((producto) => !producto.deleted)
        .toArray();
      const existingProductKeys = new Set(
        existingProducts.map((producto) => getProductKey(producto))
      );
      const productsToAdd = productosSeed
        .filter((producto) => !existingProductKeys.has(getProductKey(producto)))
        .map((producto) => ({
          ...producto,
          createdAt: producto.createdAt ?? now,
          updatedAt: producto.updatedAt ?? now
        }));

      if (productsToAdd.length > 0) {
        await db.productosCatalogo.bulkAdd(productsToAdd);
      }

      await db.configuracion.put({ clave: "seedVersion", valor: SEED_VERSION });
    }
  );
}

function getProductKey(producto: Pick<ProductoCatalogo, "nombre" | "categoriaId">) {
  return `${producto.categoriaId}:${normalizeText(producto.nombre)}`;
}

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
