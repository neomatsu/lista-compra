import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  type Unsubscribe
} from "firebase/firestore";
import { signInAnonymously, type User } from "firebase/auth";
import { auth, firestore, isFirebaseConfigured } from "../firebase/firebase";
import { db, type OutboxEvent, type ProductoLista } from "../db/db";

const FAMILY_ID_KEY = "lista_compra_family_id";
const DEVICE_ID_KEY = "lista_compra_device_id";

const OUTBOX_INTERVAL_MS = 5000;

export interface SyncStatusEvent {
  type: "synced" | "error";
  error?: string;
  lastSyncAt?: number;
}

interface RemoteItemDoc {
  id: string;
  name: string;
  categoryId?: string;
  quantity: number;
  checked: boolean;
  updatedAt: number;
  updatedBy: string;
  deleted?: boolean;
  createdAt?: number;
}

export interface StartSyncParams {
  familyId: string;
  uid: string;
  onStatus?: (event: SyncStatusEvent) => void;
}

let unsubscribeSnapshot: Unsubscribe | null = null;
let outboxIntervalId: number | null = null;
let onlineListener: (() => void) | null = null;

export async function initAuth(): Promise<User> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase no configurado");
  }
  if (auth.currentUser) {
    return auth.currentUser;
  }
  const result = await signInAnonymously(auth);
  return result.user;
}

export function getStoredFamilyId(): string | null {
  return localStorage.getItem(FAMILY_ID_KEY);
}

export function setStoredFamilyId(familyId: string): void {
  localStorage.setItem(FAMILY_ID_KEY, familyId.toUpperCase());
}

export function clearStoredFamilyId(): void {
  localStorage.removeItem(FAMILY_ID_KEY);
}

export function getDeviceId(): string {
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) {
    return existing;
  }
  const created = crypto.randomUUID().slice(0, 8);
  localStorage.setItem(DEVICE_ID_KEY, created);
  return created;
}

export async function createFamily(uid: string): Promise<string> {
  if (!firestore) {
    throw new Error("Firestore no configurado");
  }
  const familyId = generateFamilyCode();
  const familyRef = doc(firestore, "families", familyId);
  const memberRef = doc(firestore, "families", familyId, "members", uid);

  await setDoc(familyRef, {
    createdAt: Date.now(),
    createdByUid: uid
  });
  await setDoc(memberRef, {
    role: "owner",
    joinedAt: Date.now()
  });

  setStoredFamilyId(familyId);
  return familyId;
}

export async function joinFamily(familyIdRaw: string, uid: string): Promise<string> {
  if (!firestore) {
    throw new Error("Firestore no configurado");
  }
  const familyId = sanitizeFamilyCode(familyIdRaw);
  const familyRef = doc(firestore, "families", familyId);
  const familySnap = await getDoc(familyRef);
  if (!familySnap.exists()) {
    throw new Error("Código de familia no encontrado");
  }

  const memberRef = doc(firestore, "families", familyId, "members", uid);
  await setDoc(memberRef, {
    role: "member",
    joinedAt: Date.now()
  });

  setStoredFamilyId(familyId);
  return familyId;
}

export async function clearLocalDataForJoin(): Promise<void> {
  await db.transaction(
    "rw",
    db.productosLista,
    db.outbox,
    db.syncMap,
    db.configuracion,
    async () => {
      await db.productosLista.clear();
      await db.outbox.clear();
      await db.syncMap.clear();
      await db.configuracion.put({ clave: "syncFamilyId", valor: "" });
    }
  );
}

export async function enqueueUpsert(item: ProductoLista): Promise<void> {
  if (!item.id) {
    return;
  }
  const remoteId = await ensureRemoteIdForLocal(item.id);
  await db.outbox.add({
    type: "upsert",
    remoteId,
    payload: {
      nombre: item.nombre,
      categoriaId: item.categoriaId,
      cantidad: item.cantidad,
      comprado: item.comprado,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    },
    createdAt: Date.now()
  });
}

export async function enqueueDelete(item: ProductoLista): Promise<void> {
  if (!item.id) {
    return;
  }
  const remoteId = await ensureRemoteIdForLocal(item.id);
  await db.outbox.add({
    type: "delete",
    remoteId,
    payload: {
      nombre: item.nombre,
      categoriaId: item.categoriaId,
      cantidad: item.cantidad,
      comprado: item.comprado,
      createdAt: item.createdAt,
      updatedAt: Date.now()
    },
    createdAt: Date.now()
  });
}

export async function startSync({
  familyId,
  uid,
  onStatus
}: StartSyncParams): Promise<void> {
  if (!firestore) {
    throw new Error("Firestore no configurado");
  }
  stopSync();
  console.debug("SYNC start", familyId);
  const initialCount = await initialPull(familyId);
  console.debug("SYNC initial pull count", initialCount);
  await db.configuracion.put({ clave: "syncFamilyId", valor: familyId });

  const itemsRef = collection(firestore, "families", familyId, "items");
  unsubscribeSnapshot = onSnapshot(
    itemsRef,
    async (snapshot) => {
      try {
        for (const change of snapshot.docChanges()) {
          await applyRemoteChange(change.doc.id, change.doc.data() as Partial<RemoteItemDoc>);
        }
        onStatus?.({ type: "synced", lastSyncAt: Date.now() });
      } catch (error) {
        console.error("Error aplicando cambios remotos", error);
        onStatus?.({ type: "error", error: "No se pudieron aplicar cambios remotos" });
      }
    },
    (error) => {
      console.error("Error de suscripción Firestore", error);
      onStatus?.({ type: "error", error: "Error de sincronización remota" });
    }
  );
  console.debug("SYNC subscribe started");

  await processOutbox(familyId, uid, onStatus);
  console.debug("SYNC outbox resumed");

  outboxIntervalId = window.setInterval(() => {
    void processOutbox(familyId, uid, onStatus);
  }, OUTBOX_INTERVAL_MS);

  onlineListener = () => {
    void processOutbox(familyId, uid, onStatus);
  };
  window.addEventListener("online", onlineListener);
}

export function stopSync(): void {
  if (unsubscribeSnapshot) {
    unsubscribeSnapshot();
    unsubscribeSnapshot = null;
  }
  if (outboxIntervalId) {
    window.clearInterval(outboxIntervalId);
    outboxIntervalId = null;
  }
  if (onlineListener) {
    window.removeEventListener("online", onlineListener);
    onlineListener = null;
  }
}

async function processOutbox(
  familyId: string,
  uid: string,
  onStatus?: (event: SyncStatusEvent) => void
): Promise<void> {
  const events = await db.outbox.orderBy("createdAt").toArray();
  if (!events.length) {
    return;
  }

  for (const event of events) {
    if (!event.id) {
      continue;
    }
    try {
      await pushEventToFirestore(familyId, uid, event);
      await db.outbox.delete(event.id);
      onStatus?.({ type: "synced", lastSyncAt: Date.now() });
    } catch (error) {
      console.warn("No se pudo sincronizar evento outbox", error);
      onStatus?.({ type: "error", error: "Sin conexión para sincronizar" });
      break;
    }
  }
}

async function initialPull(familyId: string): Promise<number> {
  if (!firestore) {
    throw new Error("Firestore no configurado");
  }
  const snapshot = await getDocs(collection(firestore, "families", familyId, "items"));
  for (const docSnap of snapshot.docs) {
    await applyRemoteChange(docSnap.id, docSnap.data() as Partial<RemoteItemDoc>);
  }
  return snapshot.size;
}

async function pushEventToFirestore(
  familyId: string,
  uid: string,
  event: OutboxEvent
): Promise<void> {
  if (!firestore) {
    throw new Error("Firestore no configurado");
  }
  const itemRef = doc(firestore, "families", familyId, "items", event.remoteId);
  if (event.type === "delete") {
    await setDoc(
      itemRef,
      {
        id: event.remoteId,
        name: event.payload.nombre,
        categoryId: event.payload.categoriaId ? String(event.payload.categoriaId) : undefined,
        quantity: event.payload.cantidad,
        checked: event.payload.comprado,
        updatedAt: event.payload.updatedAt,
        updatedBy: uid,
        deleted: true
      },
      { merge: true }
    );
    return;
  }

  await setDoc(
    itemRef,
    {
      id: event.remoteId,
      name: event.payload.nombre,
      categoryId: event.payload.categoriaId ? String(event.payload.categoriaId) : undefined,
      quantity: event.payload.cantidad,
      checked: event.payload.comprado,
      createdAt: event.payload.createdAt,
      updatedAt: event.payload.updatedAt,
      updatedBy: uid,
      deleted: false
    },
    { merge: true }
  );
}

async function applyRemoteChange(remoteId: string, raw: Partial<RemoteItemDoc>): Promise<void> {
  const remoteUpdatedAt = toMillis(raw.updatedAt);
  if (!remoteUpdatedAt) {
    return;
  }

  await db.transaction("rw", db.productosLista, db.syncMap, async () => {
    const map = await db.syncMap.get(remoteId);

    if (raw.deleted) {
      if (map) {
        await db.productosLista.delete(map.localId);
        await db.syncMap.delete(remoteId);
      }
      return;
    }

    const mappedItem = toLocalItem(raw, remoteUpdatedAt);
    if (!mappedItem) {
      return;
    }

    if (map) {
      const local = await db.productosLista.get(map.localId);
      if (local && local.updatedAt > remoteUpdatedAt) {
        return;
      }
      await db.productosLista.put({
        ...mappedItem,
        id: map.localId
      });
      return;
    }

    const createdId = await db.productosLista.add(mappedItem);
    await db.syncMap.put({ remoteId, localId: createdId });
  });
}

function toLocalItem(raw: Partial<RemoteItemDoc>, updatedAt: number): ProductoLista | null {
  if (!raw.name || typeof raw.quantity !== "number" || typeof raw.checked !== "boolean") {
    return null;
  }

  const categoryId = raw.categoryId ? Number(raw.categoryId) : undefined;
  return {
    nombre: raw.name,
    categoriaId: Number.isFinite(categoryId) ? categoryId : undefined,
    cantidad: Math.max(1, raw.quantity),
    comprado: raw.checked,
    createdAt: toMillis(raw.createdAt) ?? updatedAt,
    updatedAt
  };
}

function toMillis(value: unknown): number | null {
  if (typeof value === "number") {
    return value;
  }
  if (value && typeof value === "object" && "toMillis" in value) {
    const maybeTimestamp = value as { toMillis: () => number };
    return maybeTimestamp.toMillis();
  }
  return null;
}

function generateFamilyCode(): string {
  return Math.random().toString(36).toUpperCase().slice(2, 8);
}

function sanitizeFamilyCode(value: string): string {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

async function ensureRemoteIdForLocal(localId: number): Promise<string> {
  const existing = await db.syncMap.where("localId").equals(localId).first();
  if (existing) {
    return existing.remoteId;
  }

  const remoteId = `${getDeviceId()}_${localId}`;
  await db.syncMap.put({ remoteId, localId });
  return remoteId;
}
