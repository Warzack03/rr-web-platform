import {
  ShieldCheck,
  Star,
  TriangleAlert,
} from "lucide-react";
import { MatchStatIcon } from "@/components/public/match-stat-icon";
import { cn } from "@/lib/utils";

type PlayerEventIconProps =
  | {
      type: "goals" | "assists" | "ownGoals";
      count: number;
    }
  | {
      type: "yellowCard" | "redCard" | "mvp" | "cleanSheet";
    };

export function PlayerEventIcon(props: PlayerEventIconProps) {
  if (props.type === "yellowCard" || props.type === "redCard") {
    const isYellow = props.type === "yellowCard";

    return (
      <span
        className={cn(
          "inline-flex h-8 min-w-8 items-center justify-center border px-2",
          isYellow
            ? "border-[rgba(253,203,88,0.26)] bg-[rgba(253,203,88,0.12)]"
            : "border-[rgba(214,64,69,0.32)] bg-[rgba(214,64,69,0.16)]",
        )}
        title={isYellow ? "Tarjeta amarilla" : "Tarjeta roja"}
        aria-label={isYellow ? "Tarjeta amarilla" : "Tarjeta roja"}
      >
        <span
          className={cn(
            "h-4 w-3",
            isYellow ? "bg-[color:var(--rr-gold)]" : "bg-[color:var(--rr-danger)]",
          )}
        />
      </span>
    );
  }

  const config =
    props.type === "goals"
      ? {
          iconType: "image",
          imageType: "goal",
          label: "Goles",
          count: props.count,
        }
      : props.type === "assists"
        ? {
            iconType: "image",
            imageType: "assist",
            label: "Asistencias",
            count: props.count,
          }
        : props.type === "ownGoals"
            ? {
                iconType: "lucide",
                icon: TriangleAlert,
                label: "Goles en propia",
                tone: "text-[#ffb4ab]",
                count: props.count,
              }
            : props.type === "mvp"
              ? {
                  iconType: "lucide",
                  icon: Star,
                  label: "MVP",
                  tone: "text-[color:var(--rr-gold)]",
                  count: undefined,
                }
              : {
                  iconType: "lucide",
                  icon: ShieldCheck,
                  label: "Porteria a cero",
                  tone: "text-[#9ed4ff]",
                  count: undefined,
                };
  const LucideIcon = config.iconType === "lucide" ? config.icon : null;

  return (
    <span
      className="inline-flex h-8 min-w-8 items-center justify-center gap-1 border border-[rgba(255,255,255,0.08)] bg-[rgba(7,15,25,0.3)] px-2"
      title={config.label}
      aria-label={
        config.count ? `${config.label} x${config.count}` : config.label
      }
    >
      {config.iconType === "image" && config.imageType ? (
        <MatchStatIcon
          type={config.imageType as "goal" | "assist"}
          size={15}
          className="h-4 w-4"
        />
      ) : LucideIcon ? (
        <LucideIcon className={cn("h-4 w-4 shrink-0", config.tone)} strokeWidth={1.9} />
      ) : null}
      {config.count && config.count > 1 ? (
        <span className="rr-kicker text-[0.7rem] text-[color:var(--rr-text)]">
          x{config.count}
        </span>
      ) : null}
    </span>
  );
}
