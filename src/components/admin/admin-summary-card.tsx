type AdminSummaryCardProps = {
  title: string;
  value: string;
  helper: string;
  accent?: "gold" | "light";
};

export function AdminSummaryCard({
  title,
  value,
  helper,
  accent = "gold",
}: AdminSummaryCardProps) {
  return (
    <article className="rounded-[22px] border border-[var(--rr-border)] bg-[rgba(39,58,88,0.78)] p-4 sm:p-5">
      <div
        className={`mb-5 h-12 w-1 rounded-full sm:h-16 ${accent === "gold" ? "bg-[var(--rr-accent)]" : "bg-[#cdd6e8]"}`}
      />
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-text-soft)]">
        {title}
      </p>
      <p className="mt-3 font-display text-5xl leading-none text-white sm:text-6xl">{value}</p>
      <p className="mt-4 text-sm text-[var(--rr-text-muted)] sm:text-base">{helper}</p>
    </article>
  );
}
