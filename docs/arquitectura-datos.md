# Arquitectura de datos

## Objetivo

La app funciona como PWA offline-first. La interfaz lee y escribe primero en IndexedDB mediante Dexie, y Firebase Firestore actua como punto compartido entre dispositivos cuando hay codigo familiar.

## Capas

### Dexie

Base local: `lista_compra_db`.

Tablas principales:

- `categorias`: categorias seed para ordenar la compra.
- `productosCatalogo`: catalogo seed y productos personalizados.
- `productosLista`: lista actual del dispositivo/familia.
- `configuracion`: claves locales como version de seed y familia activa.
- `outbox`: eventos pendientes de lista.
- `syncMap`: relacion entre item remoto y local.
- `catalogOutbox`: eventos pendientes de catalogo familiar.
- `catalogSyncMap`: relacion entre producto de catalogo remoto y local.

Dexie es la fuente inmediata para la UI. Esto permite usar la app sin conexion.

### Firestore

Estructura remota:

```txt
families/{familyId}
families/{familyId}/members/{uid}
families/{familyId}/items/{itemId}
families/{familyId}/catalogItems/{catalogItemId}
```

`items` contiene productos de la lista compartida.

`catalogItems` contiene productos personalizados del catalogo familiar. Los productos seed no se suben a Firestore.

## Flujo de lista

1. La UI crea, actualiza o borra un producto en `productosLista`.
2. Se crea un evento en `outbox`.
3. `processOutbox` intenta subir eventos a `families/{familyId}/items`.
4. Otros dispositivos reciben cambios por `onSnapshot`.
5. Los cambios remotos se aplican en Dexie.

Los borrados usan tombstone remoto:

```ts
{
  deleted: true,
  updatedAt: number
}
```

Esto evita que un producto borrado reaparezca tras reconectar.

## Flujo de catalogo familiar

1. La UI crea un producto de catalogo con nombre y categoria.
2. Se guarda en `productosCatalogo` con `origen: "usuario"`.
3. Se crea un evento en `catalogOutbox`.
4. `processCatalogOutbox` lo sube a `families/{familyId}/catalogItems`.
5. Otros dispositivos reciben el producto por `onSnapshot`.
6. Se guarda localmente con `origen: "familia"`.

Al unirse a un codigo familiar, la app limpia lista local, outbox y catalogo personalizado local, pero conserva el catalogo seed. Despues descarga `items` y `catalogItems`.

## Conflictos

La estrategia actual es `last-write-wins` con `updatedAt`.

Si llega un cambio remoto mas antiguo que el local, se ignora. Si es mas nuevo, sustituye el dato local.

## Duplicados

La app deduplica:

- lista: por `productoCatalogoId` y tambien por nombre normalizado.
- catalogo: por nombre normalizado y categoria.

La normalizacion ignora mayusculas y acentos.

## Reglas Firestore

Las reglas deben permitir que solo miembros de una familia lean y escriban lista y catalogo:

```txt
match /items/{itemId} {
  allow read, write: if isSignedIn() && isMember(familyId);
}

match /catalogItems/{catalogItemId} {
  allow read, write: if isSignedIn() && isMember(familyId);
}
```

`families/{familyId}` permite lectura a usuarios autenticados para que `joinFamily(getDoc)` pueda comprobar si el codigo existe.

## Consideraciones

- No crear colecciones manualmente en Firebase: Firestore las crea al primer write.
- No subir productos seed a Firestore: todos los dispositivos los reciben desde `seed.ts`.
- No ejecutar migraciones destructivas sobre IndexedDB sin revisar `clearLocalDataForJoin`.
- Cualquier nueva entidad sincronizada deberia tener outbox propia o una outbox tipada.
