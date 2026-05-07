import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ConfirmDialog } from "../components/ConfirmDialog";

interface SyncPanelProps {
  sync: {
    status: "disabled" | "connecting" | "synced" | "error";
    familyId: string | null;
    error: string | null;
    createFamilyCode: () => Promise<void>;
    joinFamilyCode: (code: string) => Promise<void>;
    unlinkFamily: () => void;
  };
  onToast: (message: string) => void;
}

export function SyncPanel({ sync, onToast }: SyncPanelProps) {
  const [codeInput, setCodeInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"join" | "unlink" | null>(null);

  const statusLabel =
    sync.status === "synced"
      ? "Sincronizado"
      : sync.status === "connecting"
        ? "Conectando..."
        : sync.status === "error"
          ? "Error"
          : "No compartida";

  const onCreate = async () => {
    try {
      setBusy(true);
      await sync.createFamilyCode();
      onToast("Lista compartida creada");
    } catch (error) {
      console.error(error);
      onToast("No se pudo compartir");
    } finally {
      setBusy(false);
    }
  };

  const requestJoin = () => {
    if (!codeInput.trim()) {
      onToast("Escribe un código");
      return;
    }
    setConfirmAction("join");
  };

  const confirmJoin = async () => {
    try {
      setConfirmAction(null);
      setBusy(true);
      await sync.joinFamilyCode(codeInput);
      onToast("Conectado a la lista compartida");
      setCodeInput("");
      setSettingsOpen(false);
    } catch (error) {
      console.error(error);
      onToast("Código inválido o error de red");
    } finally {
      setBusy(false);
    }
  };

  const confirmUnlink = () => {
    setConfirmAction(null);
    sync.unlinkFamily();
    setSettingsOpen(false);
    onToast("Dispositivo desvinculado");
  };

  const isCompact = Boolean(sync.familyId) && sync.status === "synced";

  if (!sync.familyId) {
    return (
      <>
        <Card title="Compartir lista" className="mb-3">
          <p className="mb-2 text-lg font-semibold text-slate-900">Estado: {statusLabel}</p>
          {sync.error ? <p className="mb-2 text-red-700">{sync.error}</p> : null}
          <p className="text-base text-slate-700">
            Comparte esta lista con otro móvil usando un código.
          </p>
          <input
            type="text"
            value={codeInput}
            onChange={(event) => setCodeInput(event.target.value.toUpperCase())}
            placeholder="Código"
            className="mt-3 min-h-12 w-full rounded-xl border-2 border-slate-400 px-4"
            aria-label="Código para compartir lista"
          />
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Button fullWidth onClick={() => void onCreate()} disabled={busy}>
              Compartir esta lista
            </Button>
            <Button fullWidth variant="secondary" onClick={requestJoin} disabled={busy}>
              Usar código
            </Button>
          </div>
        </Card>

        <ConfirmDialog
          open={confirmAction === "join"}
          title="Usar este código"
          message="Se cargará la lista compartida y sustituirá la lista actual de este móvil."
          confirmLabel="Sí, usar código"
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => void confirmJoin()}
        />
      </>
    );
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between rounded-xl border-2 border-green-300 bg-green-50 px-3 py-2">
        <p className="text-lg font-bold text-green-900">
          🟢 {isCompact ? "Lista compartida" : statusLabel}
        </p>
        <Button
          variant="secondary"
          className="min-h-10 px-3 py-1 text-base"
          onClick={() => setSettingsOpen(true)}
          aria-label="Abrir ajustes de lista compartida"
        >
          ⚙️ Ajustes
        </Button>
      </div>

      {settingsOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-900/35 p-2" role="dialog" aria-modal="true">
          <Card className="mx-auto mt-8 w-full max-w-lg border-2 border-slate-400">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Lista compartida</h2>
              <Button variant="secondary" onClick={() => setSettingsOpen(false)}>
                Cerrar
              </Button>
            </div>

            <p className="mb-1 text-lg font-semibold">Estado: {statusLabel}</p>
            {sync.error ? <p className="mb-2 text-red-700">{sync.error}</p> : null}
            <p className="mb-2 text-lg">
              Código actual: <strong>{sync.familyId}</strong>
            </p>

            <div className="mb-3 flex gap-2">
              <Button
                variant="secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(sync.familyId ?? "");
                    onToast("Código copiado");
                  } catch (error) {
                    console.error(error);
                    onToast("No se pudo copiar el código");
                  }
                }}
              >
                Copiar código
              </Button>
            </div>

            <div className="space-y-2 border-t-2 border-slate-300 pt-3">
              <p className="font-semibold">Cambiar código</p>
              <input
                type="text"
                value={codeInput}
                onChange={(event) => setCodeInput(event.target.value.toUpperCase())}
                placeholder="Nuevo código"
                className="min-h-12 w-full rounded-xl border-2 border-slate-400 px-4"
                aria-label="Nuevo código de lista compartida"
              />
              <Button fullWidth onClick={requestJoin} disabled={busy}>
                Usar otro código
              </Button>
            </div>

            <div className="mt-3 border-t-2 border-slate-300 pt-3">
              <Button
                fullWidth
                variant="ghost"
                className="border-red-700 bg-red-50 text-red-800 hover:bg-red-100"
                onClick={() => setConfirmAction("unlink")}
              >
                Desvincular
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirmAction === "join"}
        title="Usar este código"
        message="Se cargará la lista compartida y sustituirá la lista actual de este móvil."
        confirmLabel="Sí, usar código"
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => void confirmJoin()}
      />

      <ConfirmDialog
        open={confirmAction === "unlink"}
        title="Desvincular móvil"
        message="Este móvil dejará de recibir cambios de la lista compartida."
        confirmLabel="Sí, desvincular"
        danger
        onCancel={() => setConfirmAction(null)}
        onConfirm={confirmUnlink}
      />
    </>
  );
}
