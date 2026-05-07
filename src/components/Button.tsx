import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "soft" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const baseClass =
  "inline-flex min-h-[var(--tap-lg)] items-center justify-center gap-2 rounded-[var(--r-md)] border px-5 py-3 text-[17px] font-bold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50";

const variantClass: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-[var(--green-500)] text-white hover:bg-[var(--green-600)]",
  secondary:
    "border-[var(--surface-line-strong)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-2)]",
  ghost:
    "border-transparent bg-transparent text-[var(--ink)] hover:bg-[var(--surface-2)]",
  soft:
    "border-transparent bg-[var(--green-50)] text-[var(--green-700)] hover:bg-[var(--green-100)]",
  danger:
    "border-[var(--danger-500)] bg-[var(--danger-50)] text-[var(--danger-600)] hover:bg-red-100"
};

export function Button({
  children,
  className = "",
  variant = "primary",
  fullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseClass} ${variantClass[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
