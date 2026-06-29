"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { isMobileStepperField } from "@/lib/admin/admin-stats";
import type {
  AdminStatField,
  AdminStatFieldKey,
} from "@/lib/admin/admin-stats";
import type { AdminPlayer } from "@/lib/admin/mock-data";
import { cn } from "@/lib/utils";

type PlayerStatsMobileCardProps = {
  player: AdminPlayer;
  savedPlayer?: AdminPlayer;
  primaryFields: AdminStatField[];
  secondaryFields: AdminStatField[];
  reviewState: "pending" | "reviewed" | "edited";
  className?: string;
  defaultShowMore?: boolean;
  onUpdatePlayer: (
    playerId: string,
    field: AdminStatFieldKey,
    value: number,
  ) => void;
  onAdjustPlayer: (
    playerId: string,
    field: AdminStatFieldKey,
    delta: number,
  ) => void;
};

const inputClassName =
  "min-h-11 rounded-[10px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-3 text-[0.96rem] text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]";

function getPlayerSubtitle(player: AdminPlayer) {
  return `${player.position} · ${player.country} · ${player.foot}`;
}

function hasFieldChanged(
  player: AdminPlayer,
  savedPlayer: AdminPlayer | undefined,
  fieldKey: AdminStatFieldKey,
) {
  if (!savedPlayer) {
    return false;
  }

  return player[fieldKey] !== savedPlayer[fieldKey];
}

function StatFieldInput({
  field,
  player,
  savedPlayer,
  onUpdatePlayer,
  onAdjustPlayer,
}: {
  field: AdminStatField;
  player: AdminPlayer;
  savedPlayer?: AdminPlayer;
  onUpdatePlayer: (
    playerId: string,
    field: AdminStatFieldKey,
    value: number,
  ) => void;
  onAdjustPlayer: (
    playerId: string,
    field: AdminStatFieldKey,
    delta: number,
  ) => void;
}) {
  const changed = hasFieldChanged(player, savedPlayer, field.key);
  const usesStepper = isMobileStepperField(field.key);

  if (usesStepper) {
    return (
      <label key={field.key} className="grid gap-1.5">
        <span className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">
          {field.label}
        </span>
        <div
          className={cn(
            "grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 rounded-[10px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-2 py-2",
            changed
              ? "border-[rgba(253,203,88,0.34)] bg-[rgba(253,203,88,0.08)]"
              : undefined,
          )}
        >
          <button
            type="button"
            onClick={() => onAdjustPlayer(player.id, field.key, -1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/5 text-white"
            aria-label={`Restar en ${field.label}`}
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={player[field.key]}
            onChange={(event) =>
              onUpdatePlayer(player.id, field.key, Number(event.target.value))
            }
            className="rr-number-input-clean min-h-10 border-0 bg-transparent px-0 text-center text-[1rem] font-semibold text-white outline-none"
            aria-label={field.label}
          />
          <button
            type="button"
            onClick={() => onAdjustPlayer(player.id, field.key, 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[rgba(253,203,88,0.24)] bg-[rgba(253,203,88,0.1)] text-[color:var(--rr-gold)]"
            aria-label={`Sumar en ${field.label}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </label>
    );
  }

  return (
    <label key={field.key} className="grid gap-1.5">
      <span className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">
        {field.label}
      </span>
      <input
        type="number"
        min={0}
        step={1}
        inputMode="numeric"
        value={player[field.key]}
        onChange={(event) =>
          onUpdatePlayer(player.id, field.key, Number(event.target.value))
        }
        className={cn(
          inputClassName,
          changed
            ? "border-[rgba(253,203,88,0.34)] bg-[rgba(253,203,88,0.08)]"
            : undefined,
        )}
      />
    </label>
  );
}

export function PlayerStatsMobileCard({
  player,
  savedPlayer,
  primaryFields,
  secondaryFields,
  reviewState,
  className,
  defaultShowMore = false,
  onUpdatePlayer,
  onAdjustPlayer,
}: PlayerStatsMobileCardProps) {
  const [showMore, setShowMore] = useState(defaultShowMore);
  const badgeLabel =
    reviewState === "edited"
      ? "Editado"
      : reviewState === "reviewed"
        ? "Revisado"
        : "Pendiente";
  const badgeTone =
    reviewState === "edited"
      ? "gold"
      : reviewState === "reviewed"
        ? "blue"
        : "slate";

  return (
    <AdminPanel className={cn("p-4", className)}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rr-kicker text-[color:var(--rr-gold)]">
                #{player.number}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[0.74rem] text-[color:var(--rr-muted)]">
                {player.matchesPlayed} PJ
              </span>
            </div>
            <div>
              <h3 className="text-[1.04rem] font-semibold text-white">
                {player.name}
              </h3>
              <p className="mt-1 text-[0.88rem] text-[color:var(--rr-muted)]">
                {getPlayerSubtitle(player)}
              </p>
            </div>
          </div>

          <AdminStatusBadge
            label={badgeLabel}
            tone={badgeTone}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {primaryFields.map((field) => (
            <StatFieldInput
              key={field.key}
              field={field}
              player={player}
              savedPlayer={savedPlayer}
              onUpdatePlayer={onUpdatePlayer}
              onAdjustPlayer={onAdjustPlayer}
            />
          ))}
        </div>

        {secondaryFields.length > 0 ? (
          <div className="space-y-3 border-t border-white/8 pt-3">
            <button
              type="button"
              onClick={() => setShowMore((current) => !current)}
              className="flex w-full items-center justify-between rounded-[10px] border border-white/10 bg-white/5 px-3 py-3 text-left text-[0.9rem] font-medium text-white"
            >
              <span>
                {showMore ? "Ocultar mas estadisticas" : "Ver mas estadisticas"}
              </span>
              {showMore ? (
                <ChevronUp className="h-4 w-4 text-[color:var(--rr-gold)]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[color:var(--rr-gold)]" />
              )}
            </button>

            {showMore ? (
              <div className="grid grid-cols-2 gap-3">
                {secondaryFields.map((field) => (
                  <StatFieldInput
                    key={field.key}
                    field={field}
                    player={player}
                    savedPlayer={savedPlayer}
                    onUpdatePlayer={onUpdatePlayer}
                    onAdjustPlayer={onAdjustPlayer}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </AdminPanel>
  );
}
