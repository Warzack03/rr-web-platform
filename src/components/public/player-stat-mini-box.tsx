import { cn } from "@/lib/utils";

type PlayerStatMiniBoxProps = {
  label: string;
  value: number | string;
  className?: string;
};

export function PlayerStatMiniBox({ label, value, className }: PlayerStatMiniBoxProps) {
  return (
    <div
      className={cn(
        "border border-white/8 border-l-[3px] border-l-[color:var(--rr-gold)] bg-[rgba(10,14,18,0.88)] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className,
      )}
    >
      <p className="rr-kicker text-[0.66rem] text-[color:var(--rr-muted)]/88">{label}</p>
      <p className="rr-display mt-2 text-[2rem] leading-none text-[color:var(--rr-gold)]">{value}</p>
    </div>
  );
}
