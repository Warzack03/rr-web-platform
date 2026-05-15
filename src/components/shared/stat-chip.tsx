type StatChipProps = {
  label: string;
  value: string;
};

export function StatChip({ label, value }: StatChipProps) {
  return (
    <div className="rounded-[18px] border border-[var(--rr-border)] bg-[var(--rr-surface)] px-4 py-4">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-soft)]">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl uppercase leading-none text-white">{value}</p>
    </div>
  );
}
