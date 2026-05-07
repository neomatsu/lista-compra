# Plan de implementacion del rediseño visual

## Objetivo

Aplicar el rediseño propuesto en `docs/redesign` a la app real, manteniendo la usabilidad para personas mayores y sin cambiar la arquitectura funcional ya existente: React, Vite, TypeScript, TailwindCSS, Dexie y Firebase.

El rediseño debe sentirse mas calido, moderno y familiar, pero la prioridad sigue siendo comprar sin dudas: textos grandes, botones tactiles, estados claros y flujos simples.

## Referencias del diseñador

- `tokens.css`: paleta, radios, sombras, tipografia y tamaños.
- `atoms.jsx`: iconos, botones, stepper, badges de categoria, cards y bottom nav.
- `components.jsx`: header principal, header modo compra, filas de producto, grupos por categoria y toast.
- `screens.jsx`: pantallas objetivo: lista con productos, estado vacio, modo compra, catalogo, nuevo producto, lista compartida y modal.
- `Lista Compra Redesign.html`: prototipo navegable de referencia.

Estos ficheros son referencia visual. No deben importarse directamente porque usan globals, estilos inline y dependencias de prototipo.

## Principios de implementacion

- Mantener componentes React reales y tipados.
- Reutilizar la logica actual de lista, catalogo y sincronizacion.
- Implementar estilos con Tailwind y variables CSS propias.
- Evitar librerias visuales pesadas.
- No romper E2E existentes.
- Cambiar visual primero, comportamiento solo cuando mejore claridad.
- Mantener soporte movil desde 360 px.

## Fase 1 - Base visual y tokens

### Objetivo

Crear la base de diseño comun para toda la app.

### Tareas

1. Migrar tokens principales a `src/styles/index.css`.
   - `--bg`, `--surface`, `--surface-2`, `--ink`, `--green-*`, `--terra-*`, `--danger-*`.
   - radios `--r-md`, `--r-lg`, `--r-xl`.
   - sombras `--sh-card`, `--sh-pop`, `--sh-focus`.
   - tamaños tactiles `--tap`, `--tap-lg`.

2. Ajustar fondo global.
   - Sustituir el gradiente azul actual por crema calido `#F6F1E8`.

3. Añadir fuente.
   - Opcion conservadora: usar stack local sin dependencia externa.
   - Opcion visual fiel: cargar Inter/Fraunces desde Google Fonts en `index.html`.
   - Recomendacion: empezar sin fuente externa y valorar despues si compensa.

4. Definir clases utilitarias propias.
   - `.lc-card`
   - `.lc-button`
   - `.lc-bottom-nav`
   - `.lc-focus`

### Criterios de aceptacion

- El fondo, tarjetas y botones ya usan la nueva paleta.
- El contraste sigue siendo alto.
- `npm run build` pasa.
- La app no pierde funcionalidad.

## Fase 2 - Componentes base

### Objetivo

Crear componentes reutilizables que traduzcan los atoms del prototipo a la app real.

### Tareas

1. Actualizar `Button`.
   - Variantes: `primary`, `secondary`, `ghost`, `danger`, `soft`.
   - Altura minima 56 px para acciones principales.
   - Radio `14px`.
   - Icono opcional a la izquierda.

2. Actualizar `Card`.
   - Borde suave `var(--surface-line)`.
   - Sombra sutil `var(--sh-card)`.
   - Radio 20-24 px segun contexto.

3. Crear `Icon`.
   - Implementar iconos SVG propios o usar funciones pequeñas similares a `atoms.jsx`.
   - Iconos necesarios:
     - carrito
     - check
     - lista
     - catalogo
     - compartir
     - ajustes
     - mas
     - menos
     - buscar
     - papelera
     - categorias

4. Crear `CategoryBadge`.
   - Icono y color suave por categoria.
   - Fallback para `Otros`.

5. Ajustar `ConfirmDialog`.
   - Estilo del modal del prototipo.
   - Botones grandes.
   - Variante danger clara.

### Criterios de aceptacion

- No hay emojis como icono principal en botones criticos.
- Todos los botones tienen nombre accesible.
- Los componentes siguen siendo simples y tipados.

## Fase 3 - Pantalla principal

### Objetivo

Rediseñar la vista principal segun `ScreenList` y `ScreenEmpty`.

### Tareas

1. Crear `HeaderHero`.
   - Fecha/estado superior: `Hoy`.
   - Titulo con jerarquia clara.
   - Numero grande de pendientes.
   - Boton `Empezar compra`.
   - Estado de lista compartida como pill.
   - Acceso a ajustes.

2. Integrar `SyncPanel` como estado compacto.
   - Cuando hay familia: pill `Lista compartida`.
   - Si no hay familia: `Solo en este movil` o `No compartida`.
   - Los ajustes completos siguen abriendo modal/panel.

3. Crear estado vacio real.
   - Si no hay pendientes ni comprados:
     - tarjeta con icono de carrito
     - texto `Tu lista esta vacia`
     - boton `Abrir catalogo`
     - boton `Crear producto nuevo`

4. Rediseñar `ListaSection`.
   - Encabezado `Por comprar`.
   - Contador de categorias.
   - Grupos con `CategoryBadge`.
   - Filas con fondo `surface-2`.
   - Stepper verde con botones grandes.

5. Rediseñar seccion comprados.
   - Estado vacio discreto.
   - Productos comprados con fondo suave, check y tachado.
   - Boton eliminar comprados menos agresivo visualmente pero claro.

### Criterios de aceptacion

- La pantalla principal se parece al mockup.
- En 360 px no se corta ningun texto principal.
- Se puede añadir, sumar, restar, borrar y deshacer como antes.
- E2E actuales siguen pasando.

## Fase 4 - Modo compra

### Objetivo

Convertir el modo compra en una experiencia enfocada y tranquila, como `ScreenShopping`.

### Tareas

1. Crear `HeaderShopping`.
   - Fondo verde oscuro.
   - Texto `Modo compra`.
   - Numero grande de pendientes.
   - Texto `por comprar · X en el carro`.
   - Barra de progreso.
   - Boton `Terminar compra`.

2. Ajustar filas de modo compra.
   - Checkbox grande a la izquierda.
   - Cantidad como `×10` a la derecha.
   - Sin botones + / -.
   - Producto comprado tachado y apagado.

3. Mostrar seccion `En el carro`.
   - En modo compra, los comprados no desaparecen del todo.
   - Se muestran abajo como referencia.

4. Ocultar acciones secundarias.
   - No mostrar sync completo.
   - No mostrar eliminar comprados.
   - Barra inferior puede desaparecer o mostrar solo `Catalogo` y `Terminar`.

### Criterios de aceptacion

- Comprar requiere un toque por producto.
- Es evidente cuantos quedan.
- Salir del modo compra es evidente.
- No hay controles secundarios que distraigan.

## Fase 5 - Navegacion inferior

### Objetivo

Sustituir la barra inferior actual por una navegacion tipo app mas ligera.

### Tareas

1. Crear `BottomNav`.
   - `Mi lista`
   - `Catalogo`
   - `Compartir`

2. Asociar acciones actuales.
   - `Mi lista`: cerrar paneles / volver a principal.
   - `Catalogo`: abrir `CatalogoPanel`.
   - `Compartir`: ejecutar compartir lista o abrir ajustes, segun decision.

3. Ajustar safe area.
   - Mantener `env(safe-area-inset-bottom)`.
   - Asegurar padding inferior suficiente en contenido.

### Criterios de aceptacion

- La barra no tapa contenido.
- Los labels caben en movil estrecho.
- Los iconos no sustituyen el texto.

## Fase 6 - Catalogo

### Objetivo

Rediseñar `CatalogoPanel` segun `ScreenCatalog` y `ScreenNewProduct`.

### Tareas

1. Convertir el panel en vista/sheet de pantalla completa.
   - Cabecera sticky con atras/cerrar.
   - Titulo `Catalogo`.
   - Buscador grande con icono.

2. Rediseñar `Lo habitual`.
   - Tarjeta amarilla suave.
   - Chips/pills con `+ Producto`.

3. Rediseñar categorias plegables.
   - Card por categoria.
   - `CategoryBadge`.
   - Contador de productos.
   - Chevron claro.

4. Rediseñar nuevo producto.
   - Puede estar como bloque inferior o subpantalla.
   - Mantener:
     - nombre
     - categoria
     - `Guardar y añadir`
     - `Solo guardar`

5. Mantener busqueda actual.
   - Normalizacion por acentos y mayusculas.

### Criterios de aceptacion

- El catalogo es mas facil de escanear.
- Crear producto sigue sincronizando catalogo familiar.
- No se pierden los productos habituales.

## Fase 7 - Lista compartida y ajustes

### Objetivo

Aplicar el estilo del rediseño a `SyncPanel` sin cambiar el flujo Firebase.

### Tareas

1. Rediseñar estado compacto.
   - Pill o row ligera bajo header.
   - Estados:
     - `Lista compartida`
     - `No compartida`
     - `Conectando`
     - `Error`

2. Rediseñar modal/panel de ajustes.
   - Codigo grande y facil de copiar.
   - Boton `Copiar codigo`.
   - Entrada `Nuevo codigo`.
   - Boton `Usar otro codigo`.
   - Zona danger para desvincular.

3. Mantener confirmaciones actuales.
   - Usar `ConfirmDialog`.

### Criterios de aceptacion

- Compartir lista sigue funcionando.
- Unirse a otro codigo mantiene confirmacion.
- No se toca la logica de Firebase salvo por refactor visual.

## Fase 8 - Toasts, modales y estados

### Objetivo

Dar coherencia visual a los mensajes temporales y confirmaciones.

### Tareas

1. Rediseñar `Toast`.
   - Pill oscura o verde.
   - Accion `Deshacer` clara.
   - No tapar la navegacion inferior.

2. Rediseñar `ConfirmDialog`.
   - Fondo overlay suave.
   - Card centrada.
   - Botones apilados en movil.

3. Estados de error.
   - Sincronizacion con error.
   - No se pudo compartir.
   - Codigo invalido.

### Criterios de aceptacion

- Los mensajes son legibles.
- `Deshacer` sigue disponible tras borrar.
- Los modales son usables en 360 px.

## Fase 9 - Pruebas y ajuste fino

### Objetivo

Validar que el rediseño no rompe flujos existentes.

### Tareas

1. Actualizar E2E si cambian nombres visibles.
2. Ejecutar:

```bash
npm run build
npm run test:e2e
```

3. Pruebas manuales:
   - movil 360 x 740
   - movil 400 x 850
   - desktop
   - modo compra
   - catalogo
   - crear producto con categoria
   - sincronizacion con codigo familiar

4. Revisar accesibilidad:
   - foco visible
   - contraste
   - nombres accesibles
   - targets tactiles

### Criterios de aceptacion

- Build pasa.
- E2E pasan.
- No hay solapes en movil.
- No hay texto truncado problematico.

## Orden recomendado de ejecucion

1. Fase 1 - Tokens y base visual.
2. Fase 2 - Componentes base.
3. Fase 3 - Pantalla principal.
4. Fase 4 - Modo compra.
5. Fase 5 - Navegacion inferior.
6. Fase 6 - Catalogo.
7. Fase 7 - Lista compartida.
8. Fase 8 - Toasts y modales.
9. Fase 9 - Pruebas.

## Riesgos

- El prototipo usa estilos inline y globals; hay que traducir, no copiar.
- Las fuentes externas pueden afectar rendimiento o disponibilidad offline.
- El nuevo bottom nav cambia patrones de accion: hay que mantener claro como añadir y compartir.
- El modo compra puede ocultar demasiado; debe seguir siendo posible salir facilmente.
- Los nombres de categorias en los mocks aparecen con problemas de encoding; usar los textos reales de la app.

## Primera entrega recomendada

Para una primera version visual publicable:

1. Tokens + fondo + cards + botones.
2. Header principal nuevo.
3. Filas de producto rediseñadas.
4. Modo compra nuevo.
5. Bottom nav.

Dejar catalogo y ajustes para una segunda entrega si se quiere reducir riesgo.
