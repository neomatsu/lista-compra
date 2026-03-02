interface ToastProps {
  message: string | null;
  actionLabel?: string;
  onAction?: () => void;
}

export function Toast({ message, actionLabel, onAction }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="fixed bottom-24 left-1/2 z-50 w-[94%] max-w-lg -translate-x-1/2 rounded-2xl border-2 border-slate-100 bg-slate-900 px-4 py-3 text-white shadow-xl"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-bold">{message}</p>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="h-12 shrink-0 rounded-xl border-2 border-white bg-white px-4 text-lg font-extrabold text-slate-900"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
