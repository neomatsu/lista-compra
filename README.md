# Lista de la compra (PWA offline-first)

Aplicación web para sustituir la nota en papel por una lista de compra sencilla, con botones grandes y flujo rápido para personas mayores.

## Stack

- React + Vite + TypeScript
- TailwindCSS
- Dexie (IndexedDB) para persistencia local
- Firebase Auth (anónimo) + Cloud Firestore para sincronización entre dispositivos
- vite-plugin-pwa para instalación como app (PWA)

## Requisitos

- Node.js 20 o superior
- npm 10+ (o pnpm)

## Instalación y arranque

```bash
npm install
npm run dev
```

Compilar:

```bash
npm run build
npm run preview
```

## Variables de entorno

Crea `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

Rellena:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Configuración Firebase

1. Crea proyecto en Firebase Console.
2. Añade app web y copia las credenciales a `.env.local`.
3. Activa Authentication -> Sign-in method -> Anonymous.
4. Activa Cloud Firestore (modo producción o pruebas según tu entorno).

## Reglas de seguridad Firestore (prototipo familiar)

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isMember(familyId) {
      return exists(/databases/$(database)/documents/families/$(familyId)/members/$(request.auth.uid));
    }

    match /families/{familyId} {
      allow read, write: if isSignedIn() && isMember(familyId);

      match /members/{uid} {
        allow read, write: if isSignedIn() && uid == request.auth.uid;
      }

      match /items/{itemId} {
        allow read, write: if isSignedIn() && isMember(familyId);
      }
    }
  }
}
```

## Cómo funciona la sincronización

Arquitectura:

- UI -> Dexie (fuente local)
- Capa Sync -> Firestore (hub compartido)

Detalles:

- La UI siempre lee/escribe Dexie.
- Cada cambio local en `productosLista` encola evento en `outbox` (`upsert` o `delete`).
- Un loop de sync procesa outbox y escribe en Firestore.
- `onSnapshot` trae cambios remotos y los aplica a Dexie.
- Conflictos: `last-write-wins` por `updatedAt`.
- Borrados remotos: tombstone (`deleted=true`) para evitar reapariciones.

## Código de familia

Sección "Sincronización" en la app:

- `Crear código`: genera un código de familia y crea membresía del usuario actual.
- `Unirme`: entra con un código existente.
- `Copiar código`: para compartirlo con otros dispositivos.

El código se guarda localmente y se reutiliza en siguientes arranques.

## Probar sincronización (2 dispositivos)

1. Dispositivo A: crear código de familia.
2. Dispositivo B: introducir ese código y unirse.
3. Añadir producto en A -> aparece en B en segundos.
4. Marcar comprado en B -> se refleja en A.
5. Eliminar por cantidad (1 -> 0) en A -> no reaparece en B (tombstone).
6. Sin red: hacer cambios en A.
7. Recuperar red: cambios pendientes en outbox se envían automáticamente.

## Estructura

```text
src/
  app/
    App.tsx
  db/
    db.ts
    seed.ts
  firebase/
    firebase.ts
  sync/
    syncService.ts
    useSync.ts
    SyncPanel.tsx
  features/
    listaCompra/
      ListaCompraPage.tsx
      components/
      hooks/
    catalogo/
      CatalogoPanel.tsx
  components/
    Button.tsx
    Card.tsx
    Toast.tsx
  utils/
    share.ts
    formatListText.ts
  styles/
    index.css
```

## Notas

- La app sigue siendo offline-first: Dexie es la fuente de verdad local.
- Firestore añade sincronización entre dispositivos cuando hay red.
- Firestore offline persistence se intenta habilitar automáticamente (con fallback por consola si no se puede).
