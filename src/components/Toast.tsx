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
      className="fixed bottom-28 left-1/2 z-50 w-[94%] max-w-lg -translate-x-1/2 rounded-[var(--r-pill)] bg-[var(--green-700)] px-4 py-3 text-white shadow-[var(--sh-pop)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-base font-bold">{message}</p>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="min-h-11 shrink-0 rounded-[var(--r-pill)] bg-white px-4 text-base font-extrabold text-[var(--green-700)]"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
