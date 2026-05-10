import type { ReactNode } from "react";

type SectionPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function SectionPlaceholder({
  eyebrow,
  title,
  children,
}: SectionPlaceholderProps) {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300/90">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
      </div>

      <div className="rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] p-6">
        <p className="text-sm leading-7 text-slate-300">Proximamente</p>
      </div>

      {children}
    </section>
  );
}
