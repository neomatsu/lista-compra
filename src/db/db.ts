import Dexie, { type Table } from "dexie";

export interface Categoria {
  id?: number;
  nombre: string;
  orden: number;
}

export interface ProductoCatalogo {
  id?: number;
  nombre: string;
  categoriaId: number;
}

export interface ProductoLista {
  id?: number;
  productoCatalogoId?: number;
  nombreLibre?: string;
  nombre: string;
  categoriaId?: number;
  cantidad: number;
  comprado: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Configuracion {
  clave: string;
  valor: string;
}

export type OutboxEventType = "upsert" | "delete";

export interface OutboxEvent {
  id?: number;
  type: OutboxEventType;
  remoteId: string;
  payload: {
    nombre: string;
    categoriaId?: number;
    cantidad: number;
    comprado: boolean;
    createdAt: number;
    updatedAt: number;
  };
  createdAt: number;
}

export interface SyncMap {
  remoteId: string;
  localId: number;
}

class ListaCompraDB extends Dexie {
  categorias!: Table<Categoria, number>;
  productosCatalogo!: Table<ProductoCatalogo, number>;
  productosLista!: Table<ProductoLista, number>;
  configuracion!: Table<Configuracion, string>;
  outbox!: Table<OutboxEvent, number>;
  syncMap!: Table<SyncMap, string>;

  constructor() {
    super("lista_compra_db");
    this.version(1).stores({
      categorias: "++id, orden, nombre",
      productosCatalogo: "++id, categoriaId, nombre",
      productosLista:
        "++id, productoCatalogoId, categoriaId, comprado, createdAt, updatedAt, nombre",
      configuracion: "&clave"
    });
    this.version(2).stores({
      categorias: "++id, orden, nombre",
      productosCatalogo: "++id, categoriaId, nombre",
      productosLista:
        "++id, productoCatalogoId, categoriaId, comprado, createdAt, updatedAt, nombre",
      configuracion: "&clave",
      outbox: "++id, type, createdAt, remoteId",
      syncMap: "&remoteId, localId"
    });
  }
}

export const db = new ListaCompraDB();
