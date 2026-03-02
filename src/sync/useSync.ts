import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { isFirebaseConfigured } from "../firebase/firebase";
import {
  clearLocalDataForJoin,
  clearStoredFamilyId,
  createFamily,
  getStoredFamilyId,
  initAuth,
  joinFamily,
  startSync,
  stopSync,
  type SyncStatusEvent
} from "./syncService";

type SyncStatus = "disabled" | "connecting" | "synced" | "error";

interface SyncState {
  status: SyncStatus;
  familyId: string | null;
  uid: string | null;
  lastSyncAt: number | null;
  error: string | null;
}

interface UseSyncResult extends SyncState {
  createFamilyCode: () => Promise<void>;
  joinFamilyCode: (code: string) => Promise<void>;
  unlinkFamily: () => void;
}

export function useSync(): UseSyncResult {
  const [user, setUser] = useState<User | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(getStoredFamilyId());
  const [status, setStatus] = useState<SyncStatus>("disabled");
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(
    isFirebaseConfigured ? null : "Configura Firebase para activar sincronización"
  );

  const onStatus = useCallback((event: SyncStatusEvent) => {
    if (event.type === "error") {
      setStatus("error");
      setError(event.error ?? "Error de sincronización");
      return;
    }
    setStatus("synced");
    setError(null);
    setLastSyncAt(event.lastSyncAt ?? Date.now());
  }, []);

  const startSyncFlow = useCallback(
    async (id: string, uid: string) => {
      setStatus("connecting");
      setError(null);
      await startSync({
        familyId: id,
        uid,
        onStatus
      });
      setStatus("synced");
      setLastSyncAt(Date.now());
    },
    [onStatus]
  );

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setStatus("disabled");
      return () => undefined;
    }

    let mounted = true;
    setStatus("connecting");

    void initAuth()
      .then((u) => {
        if (!mounted) {
          return;
        }
        setUser(u);
        if (!familyId) {
          setStatus("disabled");
          return;
        }
        void startSyncFlow(familyId, u.uid);
      })
      .catch((err) => {
        console.error("Error iniciando auth anónima", err);
        if (!mounted) {
          return;
        }
        setStatus("error");
        setError("No se pudo iniciar sesión anónima");
      });

    return () => {
      mounted = false;
      stopSync();
    };
  }, [familyId, startSyncFlow]);

  const createFamilyCode = useCallback(async () => {
    if (!user) {
      throw new Error("Sin usuario autenticado");
    }
    const created = await createFamily(user.uid);
    setFamilyId(created);
  }, [user]);

  const joinFamilyCode = useCallback(
    async (code: string) => {
      if (!user) {
        throw new Error("Sin usuario autenticado");
      }

      console.debug("JOIN start");
      stopSync();

      const joined = await joinFamily(code, user.uid);

      await clearLocalDataForJoin();
      console.debug("JOIN local cleared");

      setFamilyId(joined);
    },
    [user]
  );

  const unlinkFamily = useCallback(() => {
    stopSync();
    clearStoredFamilyId();
    setFamilyId(null);
    setStatus("disabled");
    setLastSyncAt(null);
    setError(null);
  }, []);

  return useMemo(
    () => ({
      status,
      familyId,
      uid: user?.uid ?? null,
      lastSyncAt,
      error,
      createFamilyCode,
      joinFamilyCode,
      unlinkFamily
    }),
    [createFamilyCode, error, familyId, joinFamilyCode, lastSyncAt, status, unlinkFamily, user?.uid]
  );
}
