# Sprint 04 - Calidad PWA y mantenimiento

## Objetivo

Consolidar la app para que sea mas fiable, facil de probar y mantenible antes de seguir anadiendo funciones.

## Alcance

- Automatizar pruebas criticas.
- Reducir riesgos de PWA/cache.
- Revisar errores y warnings actuales.
- Mejorar documentacion tecnica.
- Optimizar carga inicial si el coste es razonable.

## Fuera de alcance

- Nuevas funciones de producto.
- Cambios visuales grandes.
- Migracion de stack.

## Tareas

### LC-401 - Convertir plan E2E en suite automatica

**Diseno funcional**

Los flujos criticos deben poder validarse antes de publicar:

- Carga inicial.
- Anadir producto.
- Cambiar cantidad.
- Borrar y deshacer.
- Marcar comprado.
- Crear codigo compartido.
- Sincronizar entre dos contextos aislados.

**Diseno tecnico**

- Anadir Playwright como dependencia de desarrollo si se decide automatizar en repo.
- Crear pruebas basadas en `PLAN_PRUEBAS.md`.
- Usar dos contextos independientes para simular dos dispositivos.
- Evitar depender de datos previos del navegador.

**Criterios de aceptacion**

- Hay comando `npm run test:e2e` o equivalente.
- Las pruebas limpian su estado antes de empezar.
- El flujo de dos dispositivos no comparte IndexedDB/localStorage.

### LC-402 - Revisar PWA y actualizaciones

**Diseno funcional**

Si se publica una version nueva, el usuario no deberia quedarse indefinidamente con una version antigua.

**Diseno tecnico**

- Revisar configuracion de `vite-plugin-pwa`.
- Definir comportamiento de actualizacion:
  - actualizar automaticamente, o
  - mostrar aviso "Hay una version nueva".
- Verificar manifest, iconos y nombre instalable.

**Criterios de aceptacion**

- La app se puede instalar.
- Tras una nueva build, la app actualiza de forma predecible.
- No se pierden datos locales al actualizar.

### LC-403 - Resolver ruido de consola

**Diseno funcional**

La app publicada debe arrancar sin errores visibles en consola salvo situaciones esperadas de red.

**Diseno tecnico**

- Anadir favicon real para evitar `favicon.ico 404`.
- Revisar warning de Firestore sobre persistencia de IndexedDB deprecada.
- Documentar warnings aceptados si no se corrigen en este sprint.

**Criterios de aceptacion**

- Carga inicial sin errores 404 propios.
- No hay warnings faciles de corregir pendientes.
- Los errores offline se consideran esperados solo durante pruebas sin red.

### LC-404 - Optimizar bundle inicial

**Diseno funcional**

La primera carga debe ser lo bastante rapida en moviles modestos.

**Diseno tecnico**

- Analizar chunk principal actual, que supera 500 kB minificado.
- Considerar carga diferida de Firebase/sync si no hace falta para la primera interaccion.
- Separar panel de catalogo con `React.lazy` si aporta mejora real.

**Criterios de aceptacion**

- Build sigue pasando.
- El chunk inicial baja o se documenta por que no compensa cambiarlo.
- No se rompe PWA ni sincronizacion.

### LC-405 - Documentar arquitectura de datos

**Diseno funcional**

Debe quedar claro que vive en local, que vive en Firestore y como se resuelven conflictos.

**Diseno tecnico**

- Crear `docs/arquitectura-datos.md`.
- Incluir:
  - Dexie como fuente local.
  - Firestore como hub compartido.
  - Outbox.
  - Tombstones.
  - Catalogo seed vs catalogo familiar.
  - Reglas Firestore.

**Criterios de aceptacion**

- Una persona puede entender como anadir una entidad nueva sin leer toda la app.
- La documentacion esta alineada con el codigo actual.

## Pruebas recomendadas

- `npm run build`.
- Suite E2E local contra preview.
- Prueba manual de instalacion PWA.
- Prueba de actualizacion tras nueva build.
- Lighthouse o revision ligera de rendimiento movil.

## Resultado esperado

La app queda mejor preparada para evolucionar sin romper flujos criticos de compra, sincronizacion y uso offline.
