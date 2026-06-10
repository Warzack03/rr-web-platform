"use client";

import { cn } from "@/lib/utils";
import type { MatchVisualStatus } from "@/lib/admin/match-management-mocks";

type MatchStatusSelectorProps = {
  value: MatchVisualStatus;
  allowLive: boolean;
  onChange: (value: MatchVisualStatus) => void;
};

const statusOptions: Array<{
  value: MatchVisualStatus;
  label: string;
  description: string;
}> = [
  {
    value: "pending",
    label: "Pendiente",
    description: "Calendario abierto o fecha por confirmar.",
  },
  {
    value: "live",
    label: "En vivo",
    description: "Solo disponible para el Primer Equipo.",
  },
  {
    value: "played",
    label: "Jugado",
    description: "Resultado cerrado para web y backoffice.",
  },
];

export function MatchStatusSelector({
  value,
  allowLive,
  onChange,
}: MatchStatusSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {statusOptions.map((option) => {
        const disabled = option.value === "live" && !allowLive;
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            className={cn(
              "rounded-[10px] border px-4 py-3 text-left transition",
              active
                ? "border-[rgba(253,203,88,0.34)] bg-[rgba(253,203,88,0.1)] text-white"
                : "border-white/10 bg-white/4 text-[color:var(--rr-muted)] hover:border-[rgba(253,203,88,0.24)] hover:text-white",
              disabled && "cursor-not-allowed opacity-45 hover:border-white/10 hover:text-[color:var(--rr-muted)]",
            )}
          >
            <p className="rr-kicker text-[0.72rem] text-[color:var(--rr-gold)]">{option.label}</p>
            <p className="mt-1 text-[0.9rem] leading-5">{option.description}</p>
          </button>
        );
      })}
    </div>
  );
}
