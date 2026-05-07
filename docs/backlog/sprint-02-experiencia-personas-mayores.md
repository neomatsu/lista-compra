# Sprint 02 - Experiencia para personas mayores

## Objetivo

Reducir friccion, errores y dudas durante el uso diario, especialmente en movil y para personas mayores. La app debe sentirse obvia: abrir, anadir, comprar, marcar y terminar.

## Alcance

- Mejorar legibilidad y jerarquia visual.
- Ajustar barra inferior fija.
- Crear confirmaciones mas claras.
- Pulir modo compra.
- Reforzar accesibilidad tactil y de teclado.

## Fuera de alcance

- Cambios profundos de sincronizacion.
- Nuevas funcionalidades de catalogo compartido.
- Redisenar toda la identidad visual.

## Tareas

### LC-201 - Corregir solape de barra inferior

**Diseno funcional**

La barra inferior con "Anadir productos" y "Compartir" no debe tapar contenido al final de la lista. Debe quedar claro que la pagina se puede leer completa.

**Diseno tecnico**

- Revisar `ListaCompraPage`.
- Ajustar `pb-28` o crear una clase CSS basada en la altura real de la barra.
- Comprobar `safe-area-inset-bottom`.
- Validar en 360 x 740, 400 x 850 y desktop.

**Criterios de aceptacion**

- El ultimo boton o tarjeta no queda debajo de la barra fija.
- En movil pequeno se puede pulsar "Eliminar productos comprados" sin interferencias.
- La barra mantiene botones grandes.

### LC-202 - Modo compra mas claro

**Diseno funcional**

En modo compra, la pantalla debe centrarse en marcar productos comprados. Conviene mostrar menos controles y destacar lo pendiente.

Propuesta:

- Cambiar texto del boton a "Terminar compra" cuando esta activo.
- Ocultar compartir y ajustes secundarios si distraen, o mantenerlos menos prominentes.
- Mostrar cantidades grandes junto al producto.
- Mantener categorias visibles.

**Diseno tecnico**

- Modificar `ListaCompraPage`.
- Revisar `ListaSection` para que el modo compra tenga una variante visual especifica.
- Evitar cambios que rompan el flujo actual de marcar comprado.

**Criterios de aceptacion**

- Al activar modo compra, desaparecen controles de cantidad.
- Es evidente como salir del modo compra.
- Marcar un producto comprado requiere un solo toque.

### LC-203 - Confirmaciones grandes y comprensibles

**Diseno funcional**

Sustituir `window.confirm` por un modal propio para acciones delicadas:

- Eliminar productos comprados.
- Unirse a otro codigo.
- Desvincular dispositivo.

Los textos deben ser concretos y sin tono tecnico.

**Diseno tecnico**

- Crear componente `ConfirmDialog`.
- Props sugeridas:
  - `title`
  - `message`
  - `confirmLabel`
  - `cancelLabel`
  - `danger?: boolean`
  - `onConfirm`
  - `onCancel`
- Reutilizar estilos de `Card` y `Button`.

**Criterios de aceptacion**

- El modal se puede cerrar con cancelar.
- El boton peligroso se distingue visualmente.
- El foco no queda perdido al cerrar.

### LC-204 - Ajustar textos visibles

**Diseno funcional**

Simplificar textos para que sean mas directos:

- "Lista de hoy" puede cambiar a "Hoy".
- "Sin codigo de familia" puede cambiar a "No compartida".
- "Crear codigo" puede cambiar a "Compartir esta lista".
- "Unirme" puede cambiar a "Usar codigo".

**Diseno tecnico**

- Revisar `ListaCompraPage` y `SyncPanel`.
- Mantener consistencia entre botones y mensajes toast.
- Evitar textos largos en botones.

**Criterios de aceptacion**

- No hay botones con texto que se parta de forma fea en movil.
- Los estados de sincronizacion se entienden sin conocer Firebase.

### LC-205 - Accesibilidad basica

**Diseno funcional**

La app debe poder usarse con menor precision tactil, buena lectura y lectores de pantalla basicos.

**Diseno tecnico**

- Revisar nombres accesibles de botones con emoji.
- Anadir `aria-label` donde el texto visible no sea suficiente.
- Asegurar contraste suficiente en estados verde, gris y rojo.
- Evitar que nombres largos de productos se corten sin alternativa.

**Criterios de aceptacion**

- Todos los botones tienen nombre accesible claro.
- Los botones principales tienen altura tactil minima de 48 px.
- Un producto con nombre largo no rompe la fila.

## Pruebas recomendadas

- Probar con viewport 360 x 740.
- Probar solo con teclado.
- Activar modo compra y marcar varios productos.
- Ejecutar flujo de eliminar comprados.
- Revisar snapshot de accesibilidad con Playwright.

## Resultado esperado

La app mantiene su sencillez, pero se vuelve mas robusta para el uso real en el supermercado y en moviles pequenos.
