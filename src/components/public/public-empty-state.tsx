type PublicEmptyStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PublicEmptyState({
  eyebrow = "Sin datos",
  title,
  description,
}: PublicEmptyStateProps) {
  return (
    <section className="mx-auto flex min-h-[62vh] w-full max-w-[1280px] items-center px-5 py-16 md:px-8 xl:px-16">
      <div className="rr-panel max-w-2xl p-8">
        <p className="rr-kicker text-[color:var(--rr-gold)]">{eyebrow}</p>
        <h1 className="rr-display mt-4 text-[3.4rem] leading-none text-white md:text-[4rem]">
          {title}
        </h1>
        <p className="mt-4 text-[1.08rem] leading-7 text-[color:var(--rr-muted)]">
          {description}
        </p>
      </div>
    </section>
  );
}
