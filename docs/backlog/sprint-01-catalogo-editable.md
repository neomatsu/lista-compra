# Sprint 01 - Catalogo editable

## Objetivo

Permitir que la familia amplie el catalogo de productos desde la propia app, indicando una categoria para que la lista siga apareciendo ordenada y facil de comprar.

Este sprint convierte el campo "Producto personalizado" en una funcionalidad reutilizable: si una persona anade un producto que compra a menudo, no tendra que escribirlo cada vez.

## Alcance

- Crear productos nuevos en el catalogo local.
- Elegir categoria al crear un producto.
- Mostrar los productos creados dentro de su categoria.
- Evitar duplicados sencillos.
- Permitir anadir el producto nuevo directamente a la lista.

## Fuera de alcance

- Sincronizar catalogo entre dispositivos.
- Editar o borrar productos existentes.
- Crear categorias nuevas.

## Tareas

### LC-101 - Ampliar modelo local de catalogo

**Diseno funcional**

El catalogo debe distinguir entre productos de seed y productos creados por el usuario, aunque visualmente se muestren juntos.

**Diseno tecnico**

- Ampliar `ProductoCatalogo` en `src/db/db.ts` con campos opcionales:
  - `createdAt?: number`
  - `updatedAt?: number`
  - `origen?: "seed" | "usuario"`
- Crear una nueva version de Dexie si se necesita indexar algun campo nuevo.
- Mantener compatibilidad con datos ya existentes.

**Criterios de aceptacion**

- La app arranca con datos existentes sin perder catalogo.
- Los productos seed siguen apareciendo.
- Los productos nuevos pueden guardarse con categoria.

### LC-102 - Crear producto de catalogo con categoria

**Diseno funcional**

En el panel "Anadir productos", la zona inferior debe permitir:

- Escribir nombre del producto.
- Elegir categoria.
- Guardar en catalogo.
- Opcionalmente anadirlo tambien a la lista actual.

Para personas mayores, el selector debe ser claro y tener una opcion por defecto razonable, por ejemplo "Despensa" u "Otros" si se crea esa categoria.

**Diseno tecnico**

- Anadir funcion `addCatalogProduct(nombre, categoriaId)` en `useListaCompra`.
- Validar `nombre.trim()`.
- Normalizar para detectar duplicados ignorando mayusculas y acentos.
- Si ya existe un producto igual en el catalogo, no duplicarlo y mostrar aviso.

**Criterios de aceptacion**

- Al crear "Galletas" en "Despensa", aparece dentro de "Despensa".
- Si se busca "Galletas", aparece en resultados.
- Si se intenta crear "galletas", no se duplica.
- Si se marca "Anadir tambien a la lista", aparece en "Por comprar".

### LC-103 - Redisenar bloque de producto personalizado

**Diseno funcional**

Sustituir el bloque actual por una seccion mas explicita:

- Titulo: "Nuevo producto"
- Campo: "Nombre"
- Selector: "Categoria"
- Boton principal: "Guardar y anadir"
- Boton secundario: "Solo guardar"

El texto debe ser corto y directo. Evitar explicaciones largas dentro de la interfaz.

**Diseno tecnico**

- Modificar `src/features/catalogo/CatalogoPanel.tsx`.
- Mantener botones grandes y tactiles.
- En movil, los controles deben apilarse verticalmente.
- En desktop, pueden colocarse en dos columnas si cabe.

**Criterios de aceptacion**

- En un viewport de 400 px de ancho no se corta ningun boton.
- El formulario se puede usar solo con teclado.
- Tras guardar, se limpia el campo de nombre.

### LC-104 - Feedback claro al usuario

**Diseno funcional**

El usuario debe saber que ha pasado despues de guardar:

- "Producto guardado"
- "Producto guardado y anadido"
- "Ese producto ya existe"
- "Elige una categoria"

**Diseno tecnico**

- Reutilizar `Toast`.
- Evitar mensajes simultaneos que tapen el estado de deshacer borrado.
- No bloquear el flujo con `alert`.

**Criterios de aceptacion**

- Cada accion relevante muestra un mensaje breve.
- No se pierde la opcion de deshacer cuando se acaba de borrar un producto.

## Pruebas recomendadas

- Crear producto nuevo en cada categoria.
- Buscar producto creado.
- Anadir producto creado a la lista.
- Refrescar la pagina y comprobar que sigue en catalogo.
- Intentar crear duplicado con mayusculas o acentos distintos.

## Resultado esperado

Al terminar el sprint, una familia puede adaptar el catalogo a su compra real sin tocar codigo ni depender del listado inicial.
