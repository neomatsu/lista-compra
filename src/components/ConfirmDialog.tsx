import { Button } from "./Button";
import { Card } from "./Card";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancelar",
  danger = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-3"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <Card className="w-full max-w-lg border-2 border-slate-500">
        <h2 id="confirm-dialog-title" className="mb-3 text-2xl font-extrabold text-slate-950">
          {title}
        </h2>
        <p className="mb-4 text-lg leading-relaxed text-slate-800">{message}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button fullWidth variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            fullWidth
            variant={danger ? "ghost" : "primary"}
            className={
              danger ? "border-red-800 bg-red-50 text-red-900 hover:bg-red-100" : undefined
            }
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}
