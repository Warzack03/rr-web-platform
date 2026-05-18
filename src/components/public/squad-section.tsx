import type { ReactNode } from "react";

type SquadSectionProps = {
  title: string;
  children: ReactNode;
};

export function SquadSection({ title, children }: SquadSectionProps) {
  return (
    <section>
      <div className="mb-8 flex items-center gap-4">
        <span className="h-14 w-1 shrink-0 bg-[color:var(--rr-gold)]" />
        <h2 className="rr-display text-[2.4rem] leading-none text-white sm:text-[3.1rem] lg:text-[3.6rem]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
