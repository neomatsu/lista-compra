import type { PropsWithChildren } from "react";

interface CardProps extends PropsWithChildren {
  title?: string;
  className?: string;
}

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-2xl border-2 border-slate-300 bg-white p-4 shadow-md ${className}`}
    >
      {title ? <h2 className="mb-3 text-xl font-bold">{title}</h2> : null}
      {children}
    </section>
  );
}
