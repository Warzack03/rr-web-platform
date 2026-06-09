import { PlayerStatIcon } from "@/components/public/player-stat-icon";
import { cn } from "@/lib/utils";
import type {
  PlayerStatIcon as PlayerStatIconType,
  PlayerStatTone,
} from "@/lib/public/player-detail-helpers";

type PlayerStatTileProps = {
  label: string;
  value: string;
  icon: PlayerStatIconType;
  tone?: PlayerStatTone;
  className?: string;
};

const toneClasses: Record<PlayerStatTone, string> = {
  default: "border-[color:var(--rr-border)]",
  warning: "border-[rgba(253,203,88,0.28)]",
  danger: "border-[rgba(214,64,69,0.38)]",
};

export function PlayerStatTile({
  label,
  value,
  icon,
  tone = "default",
  className,
}: PlayerStatTileProps) {
  return (
    <article
      className={cn(
        "rr-panel-dark relative flex min-h-[5.35rem] flex-col overflow-hidden px-4 pt-3 pb-2",
        toneClasses[tone],
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(253,203,88,0.18),transparent)]" />
      <div className="flex items-start justify-between gap-3">
        <p className="rr-kicker pt-0.5 text-[0.72rem] text-[color:var(--rr-muted)]">{label}</p>
        <span className="mt-1 shrink-0">
          <PlayerStatIcon icon={icon} tone={tone} />
        </span>
      </div>
      <p className="rr-display mt-2 text-[2.15rem] leading-none text-white md:text-[2.35rem]">
        {value}
      </p>
    </article>
  );
}
