# Sprint 03 - Sincronizacion de catalogo familiar

## Objetivo

Hacer que el catalogo personalizado sea compartido por la familia, igual que la lista. Si una persona anade un producto frecuente, los demas dispositivos deben verlo sin repetir trabajo.

## Alcance

- Guardar productos personalizados del catalogo en Firestore.
- Descargar catalogo familiar al unirse a una lista.
- Resolver cambios offline mediante outbox.
- Soportar borrado logico para evitar reapariciones.

## Fuera de alcance

- Roles avanzados de administracion.
- Auditoria detallada de quien cambio cada producto.
- Sincronizar categorias personalizadas.

## Tareas

### LC-301 - Disenar coleccion remota de catalogo

**Diseno funcional**

El catalogo familiar debe ser comun para todos los dispositivos vinculados al mismo codigo.

**Diseno tecnico**

Crear documentos en:

```txt
families/{familyId}/catalogItems/{catalogItemId}
```

Campos sugeridos:

```ts
{
  id: string;
  name: string;
  categoryId: string;
  createdAt: number;
  updatedAt: number;
  updatedBy: string;
  deleted: boolean;
}
```

**Criterios de aceptacion**

- Las reglas existentes de familia permiten leer/escribir catalogo solo a miembros.
- El identificador remoto es estable.
- Los productos borrados no reaparecen.

### LC-302 - Ampliar Dexie para sincronizacion de catalogo

**Diseno funcional**

La app debe seguir funcionando sin conexion. El usuario puede crear productos de catalogo offline y se suben al volver la red.

**Diseno tecnico**

- Crear tabla `catalogOutbox` o generalizar `outbox`.
- Crear tabla `catalogSyncMap` o reutilizar `syncMap` con tipo.
- Anadir campos locales:
  - `remoteId?: string`
  - `updatedAt?: number`
  - `deleted?: boolean`
  - `origen?: "seed" | "usuario" | "familia"`

**Criterios de aceptacion**

- Crear producto offline lo guarda localmente.
- Al reconectar, aparece en otro dispositivo.
- No se duplican productos al recibir snapshot remoto.

### LC-303 - Pull inicial de catalogo al unirse

**Diseno funcional**

Cuando un dispositivo se une a una lista compartida, debe recibir tambien el catalogo familiar.

**Diseno tecnico**

- Ampliar `initialPull` o crear `initialCatalogPull`.
- Aplicar cambios remotos antes de mostrar estado como sincronizado.
- Mantener productos seed aunque no existan en Firestore.

**Criterios de aceptacion**

- Dispositivo B se une al codigo de A y ve productos personalizados de A.
- No se eliminan productos seed.
- No aparecen duplicados si el producto local ya existe con mismo nombre y categoria.

### LC-304 - Snapshot remoto de catalogo

**Diseno funcional**

Los cambios de catalogo deben verse en segundos en otros dispositivos conectados.

**Diseno tecnico**

- Crear suscripcion `onSnapshot` para `catalogItems`.
- Aplicar estrategia `last-write-wins` por `updatedAt`.
- Ignorar cambios remotos mas antiguos que el local.

**Criterios de aceptacion**

- Crear producto en A lo muestra en B sin refrescar.
- Borrar o desactivar producto en A lo oculta en B.
- Si B esta offline, recupera cambios al volver online.

### LC-305 - Reglas Firestore

**Diseno funcional**

Solo miembros de la familia deben poder leer y modificar el catalogo familiar.

**Diseno tecnico**

Extender reglas con:

```txt
match /catalogItems/{catalogItemId} {
  allow read, write: if isSignedIn() && isMember(familyId);
}
```

Actualizar `README.md` con la nueva estructura.

**Criterios de aceptacion**

- Usuario anonimo miembro puede crear producto.
- Usuario fuera de familia no puede leer ni escribir.
- La documentacion queda alineada con el codigo.

## Pruebas recomendadas

- Dos navegadores con almacenamiento aislado.
- Crear catalogo en A y comprobar B.
- Crear catalogo offline y reconectar.
- Unirse con B despues de que A tenga productos personalizados.
- Verificar que no hay duplicados tras refrescar.

## Resultado esperado

El catalogo pasa a ser un activo familiar compartido, no una configuracion aislada por dispositivo.
