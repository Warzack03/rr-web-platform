import { cn } from "@/lib/utils";
import type { DominantFoot } from "@/lib/public/player-profile-content";

type DominantFootIndicatorProps = {
  foot: DominantFoot;
  className?: string;
};

export function DominantFootIndicator({ foot, className }: DominantFootIndicatorProps) {
  const leftActive = foot === "left" || foot === "both";
  const rightActive = foot === "right" || foot === "both";
  const label =
    foot === "left" ? "Zurdo" : foot === "right" ? "Diestro" : foot === "both" ? "Ambidiestro" : "Sin dato";

  return (
    <div className={cn("border border-white/8 bg-[rgba(255,255,255,0.03)] px-4 py-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <p className="rr-kicker text-[0.66rem] text-[color:var(--rr-muted)]/88">Pierna</p>
        <p className="rr-kicker text-[0.66rem] text-[color:var(--rr-gold)]">{label}</p>
      </div>
      <div className="mt-3.5 grid grid-cols-2 gap-3">
        <FootToggle side="Izq" active={leftActive} neutral={foot === "unknown"} />
        <FootToggle side="Der" active={rightActive} neutral={foot === "unknown"} />
      </div>
    </div>
  );
}

type FootToggleProps = {
  side: string;
  active: boolean;
  neutral?: boolean;
};

function FootToggle({ side, active, neutral = false }: FootToggleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 border px-3 py-2.5",
        active
          ? "border-[color:var(--rr-gold)] bg-[rgba(253,203,88,0.12)] text-[color:var(--rr-gold)]"
          : neutral
            ? "border-white/8 bg-[rgba(255,255,255,0.03)] text-[color:var(--rr-muted)]/72"
            : "border-white/8 bg-[rgba(10,14,18,0.72)] text-[color:var(--rr-muted)]/52",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border text-[0.56rem] font-bold leading-none",
          active
            ? "border-[color:var(--rr-gold)] bg-[rgba(253,203,88,0.16)]"
            : neutral
              ? "border-white/10 bg-transparent"
              : "border-white/8 bg-transparent",
        )}
      >
        {side.slice(0, 1)}
      </span>
      <span className="rr-kicker text-[0.62rem]">{side}</span>
    </div>
  );
}
