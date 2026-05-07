import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { CloseIcon, CogIcon, ShareIcon } from "../components/Icons";

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

  return (
    <>
      <Card className="mb-5 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span
              className={`inline-flex items-center gap-2 rounded-[var(--r-pill)] px-3 py-2 text-sm font-extrabold ${
                sync.familyId
                  ? "bg-[var(--terra-50)] text-[var(--terra-600)]"
                  : "bg-[var(--surface-2)] text-[var(--ink-2)]"
              }`}
            >
              <ShareIcon size={16} />
              {sync.familyId ? "Lista compartida" : statusLabel}
            </span>
            {sync.error ? (
              <p className="mt-2 text-sm font-bold text-[var(--danger-600)]">{sync.error}</p>
            ) : null}
          </div>
          <Button
            variant="ghost"
            className="min-h-11 shrink-0 px-3 text-sm"
            onClick={() => setSettingsOpen(true)}
            aria-label="Abrir ajustes de lista compartida"
          >
            <CogIcon size={18} /> Ajustes
          </Button>
        </div>
      </Card>

      {settingsOpen ? (
        <div className="fixed inset-0 z-40 bg-[rgba(31,42,38,0.35)] p-3" role="dialog" aria-modal="true">
          <Card className="mx-auto mt-6 w-full max-w-lg border-[var(--surface-line-strong)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-[var(--ink)]">Lista compartida</h2>
              <button
                className="flex h-11 w-11 items-center justify-center rounded-[var(--r-md)] bg-[var(--surface-2)] text-[var(--ink)]"
                onClick={() => setSettingsOpen(false)}
                aria-label="Cerrar ajustes"
              >
                <CloseIcon size={22} />
              </button>
            </div>

            <p className="mb-2 text-lg font-bold text-[var(--ink)]">Estado: {statusLabel}</p>
            {sync.error ? <p className="mb-3 text-[var(--danger-600)]">{sync.error}</p> : null}

            {sync.familyId ? (
              <div className="mb-4 rounded-[var(--r-md)] bg-[var(--surface-2)] p-4">
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--ink-3)]">
                  Código actual
                </p>
                <p className="mt-1 text-3xl font-black tracking-widest text-[var(--ink)]">
                  {sync.familyId}
                </p>
                <Button
                  variant="secondary"
                  className="mt-3"
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
            ) : (
              <p className="mb-4 text-[var(--ink-2)]">
                Comparte esta lista con otro móvil usando un código.
              </p>
            )}

            <div className="space-y-2 border-t border-[var(--surface-line)] pt-4">
              <p className="font-bold text-[var(--ink)]">
                {sync.familyId ? "Usar otro código" : "Usar código"}
              </p>
              <input
                type="text"
                value={codeInput}
                onChange={(event) => setCodeInput(event.target.value.toUpperCase())}
                placeholder="Código"
                className="min-h-14 w-full rounded-[var(--r-md)] border border-[var(--surface-line-strong)] bg-[var(--surface)] px-4"
                aria-label="Código para compartir lista"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                {!sync.familyId ? (
                  <Button fullWidth onClick={() => void onCreate()} disabled={busy}>
                    Compartir esta lista
                  </Button>
                ) : null}
                <Button fullWidth variant="secondary" onClick={requestJoin} disabled={busy}>
                  Usar código
                </Button>
              </div>
            </div>

            {sync.familyId ? (
              <div className="mt-4 border-t border-[var(--surface-line)] pt-4">
                <Button fullWidth variant="danger" onClick={() => setConfirmAction("unlink")}>
                  Desvincular
                </Button>
              </div>
            ) : null}
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
