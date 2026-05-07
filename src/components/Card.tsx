import type { PropsWithChildren } from "react";

interface CardProps extends PropsWithChildren {
  title?: string;
  className?: string;
}

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-[var(--r-lg)] border border-[var(--surface-line)] bg-[var(--surface)] p-5 shadow-[var(--sh-card)] ${className}`}
    >
      {title ? <h2 className="mb-3 text-xl font-extrabold text-[var(--ink)]">{title}</h2> : null}
      {children}
    </section>
  );
}
