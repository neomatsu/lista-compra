import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const baseClass =
  "min-h-12 rounded-xl border-2 px-4 py-3 text-lg font-semibold shadow-md transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";

const variantClass: Record<ButtonVariant, string> = {
  primary: "border-teal-900 bg-teal-700 text-white hover:bg-teal-800",
  secondary: "border-slate-500 bg-slate-300 text-slate-950 hover:bg-slate-400",
  ghost: "border-slate-500 bg-white text-slate-900 hover:bg-slate-100"
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
