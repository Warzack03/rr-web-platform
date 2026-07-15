"use client";

import { Minus, Plus } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { PlayerStatIcon } from "@/components/public/player-stat-icon";
import {
  getPlayerDerivedMetrics,
  type PlayerStatItem,
  type PlayerStatTone,
} from "@/lib/public/player-detail-helpers";
import type {
  PublicPlayerStatsLevel,
  PublicPlayerType,
} from "@/lib/public/player-profile-content";
import {
  isGoalkeeperPlayer,
  isMobileStepperField,
  type AdminEditableStatFieldKey,
  type AdminMatchPlayerEntry,
  type AdminStatField,
} from "@/lib/admin/admin-stats";
import type { AdminPlayer } from "@/lib/admin/mock-data";
import { cn } from "@/lib/utils";

type PlayerStatsMobileCardProps = {
  player: AdminPlayer;
  matchEntry: AdminMatchPlayerEntry;
  savedMatchEntry?: AdminMatchPlayerEntry;
  isGuestPlayer?: boolean;
  guestOriginTeamName?: string;
  primaryFields: AdminStatField[];
  secondaryFields: AdminStatField[];
  reviewState: "pending" | "reviewed" | "edited";
  selectedMatchLabel: string;
  statsLevel: PublicPlayerStatsLevel;
  className?: string;
  onTogglePlayed: (playerId: string) => void;
  onUpdatePlayer: (
    playerId: string,
    field: AdminEditableStatFieldKey,
    value: number,
  ) => void;
  onAdjustPlayer: (
    playerId: string,
    field: AdminEditableStatFieldKey,
    delta: number,
  ) => void;
};

const inputClassName =
  "min-h-11 rounded-[16px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 text-[0.96rem] text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]";

function getPlayerSubtitle(player: AdminPlayer) {
  return `${player.position} - ${player.country} - ${player.foot}`;
}

function getFieldTone(fieldKey: AdminEditableStatFieldKey): PlayerStatTone {
  if (fieldKey === "yellowCards") {
    return "warning";
  }

  if (fieldKey === "redCards") {
    return "danger";
  }

  return "default";
}

function hasFieldChanged(
  entry: AdminMatchPlayerEntry,
  savedEntry: AdminMatchPlayerEntry | undefined,
  fieldKey: AdminEditableStatFieldKey,
) {
  if (!savedEntry) {
    return false;
  }

  return entry[fieldKey] !== savedEntry[fieldKey];
}

function buildDerivedMetrics(
  player: AdminPlayer,
  statsLevel: PublicPlayerStatsLevel,
): PlayerStatItem[] {
  const playerType: PublicPlayerType = isGoalkeeperPlayer(player)
    ? "goalkeeper"
    : "field";

  return getPlayerDerivedMetrics(
    playerType,
    {
      matchesPlayed: player.matchesPlayed,
      goals: player.goals,
      assists: player.assists,
      goalsAgainst: player.goalsConceded,
      yellowCards: player.yellowCards,
      redCards: player.redCards,
      ownGoals: player.ownGoals,
      mvps: player.mvp,
      recoveries: player.recoveries,
      shots: player.shots,
      shotsOnTarget: player.shotsOnTarget,
      cleanSheets: player.cleanSheets,
      saves: player.saves,
    },
    statsLevel,
  );
}

function MatchStatFieldInput({
  field,
  player,
  matchEntry,
  savedMatchEntry,
  onUpdatePlayer,
  onAdjustPlayer,
}: {
  field: AdminStatField;
  player: AdminPlayer;
  matchEntry: AdminMatchPlayerEntry;
  savedMatchEntry?: AdminMatchPlayerEntry;
  onUpdatePlayer: (
    playerId: string,
    field: AdminEditableStatFieldKey,
    value: number,
  ) => void;
  onAdjustPlayer: (
    playerId: string,
    field: AdminEditableStatFieldKey,
    delta: number,
  ) => void;
}) {
  const changed = hasFieldChanged(matchEntry, savedMatchEntry, field.key);
  const usesStepper = isMobileStepperField(field.key);
  const tone = getFieldTone(field.key);
  const disabled = !matchEntry.played;

  if (usesStepper) {
    return (
      <label key={field.key} className="grid gap-1.5">
        <span className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-[0.78rem] font-medium text-white">
            <PlayerStatIcon icon={field.icon} tone={tone} />
            <span>{field.label}</span>
          </span>
          <span className="rr-kicker text-[0.64rem] text-[color:var(--rr-muted)]">
            Temp. {player[field.key]}
          </span>
        </span>
        <div
          className={cn(
            "grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 rounded-[16px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-2 py-2",
            changed
              ? "border-[rgba(243,203,69,0.34)] bg-[rgba(243,203,69,0.08)]"
              : undefined,
            disabled ? "opacity-55" : undefined,
          )}
        >
          <button
            type="button"
            onClick={() => onAdjustPlayer(player.id, field.key, -1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white disabled:cursor-not-allowed disabled:opacity-35"
            aria-label={`Restar en ${field.label}`}
            disabled={disabled || matchEntry[field.key] <= 0}
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={matchEntry[field.key]}
            onChange={(event) =>
              onUpdatePlayer(player.id, field.key, Number(event.target.value))
            }
            className="rr-number-input-clean min-h-10 border-0 bg-transparent px-0 text-center text-[1rem] font-semibold text-white outline-none disabled:cursor-not-allowed"
            aria-label={field.label}
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => onAdjustPlayer(player.id, field.key, 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(243,203,69,0.24)] bg-[rgba(243,203,69,0.1)] text-[color:var(--rr-gold)] disabled:cursor-not-allowed disabled:opacity-35"
            aria-label={`Sumar en ${field.label}`}
            disabled={disabled}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </label>
    );
  }

  return (
    <label key={field.key} className="grid gap-1.5">
      <span className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[0.78rem] font-medium text-white">
          <PlayerStatIcon icon={field.icon} tone={tone} />
          <span>{field.label}</span>
        </span>
        <span className="rr-kicker text-[0.64rem] text-[color:var(--rr-muted)]">
          Temp. {player[field.key]}
        </span>
      </span>
      <input
        type="number"
        min={0}
        step={1}
        inputMode="numeric"
        value={matchEntry[field.key]}
        onChange={(event) =>
          onUpdatePlayer(player.id, field.key, Number(event.target.value))
        }
        className={cn(
          inputClassName,
          changed
            ? "border-[rgba(243,203,69,0.34)] bg-[rgba(243,203,69,0.08)]"
            : undefined,
          !matchEntry.played ? "cursor-not-allowed opacity-55" : undefined,
        )}
        disabled={!matchEntry.played}
      />
    </label>
  );
}

function DerivedMetricStrip({
  items,
}: {
  items: PlayerStatItem[];
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[16px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="rr-kicker text-[0.64rem] text-[color:var(--rr-muted)]">
                {item.label}
              </p>
              <p className="text-[1rem] font-semibold text-white">{item.value}</p>
            </div>
            <PlayerStatIcon icon={item.icon} tone={item.tone} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PlayerStatsMobileCard({
  player,
  matchEntry,
  savedMatchEntry,
  isGuestPlayer = false,
  guestOriginTeamName,
  primaryFields,
  secondaryFields,
  reviewState,
  selectedMatchLabel,
  statsLevel,
  className,
  onTogglePlayed,
  onUpdatePlayer,
  onAdjustPlayer,
}: PlayerStatsMobileCardProps) {
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
  const derivedMetrics = buildDerivedMetrics(player, statsLevel);
  const allFields = [...primaryFields, ...secondaryFields];

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
              {isGuestPlayer ? (
                <span className="rounded-full border border-[rgba(107,159,255,0.28)] bg-[rgba(107,159,255,0.1)] px-2 py-1 text-[0.74rem] text-[#b8d3ff]">
                  Puntual{guestOriginTeamName ? ` - ${guestOriginTeamName}` : ""}
                </span>
              ) : null}
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

        <button
          type="button"
          role="switch"
          aria-checked={matchEntry.played}
          onClick={() => onTogglePlayed(player.id)}
          className={cn(
            "flex w-full items-center justify-between rounded-[16px] border px-3 py-3 text-left transition",
            matchEntry.played
              ? "border-[rgba(243,203,69,0.3)] bg-[rgba(243,203,69,0.1)]"
              : "border-white/10 bg-white/4",
          )}
        >
          <div>
            <p className="rr-kicker text-[0.68rem] text-[color:var(--rr-gold)]">
              {selectedMatchLabel}
            </p>
            <p className="mt-1 text-[0.92rem] font-medium text-white">
              {matchEntry.played ? "Ha jugado" : "No ha jugado"}
            </p>
          </div>
          <span
            className={cn(
              "relative inline-flex h-7 w-12 shrink-0 rounded-full border transition",
              matchEntry.played
                ? "border-[rgba(243,203,69,0.28)] bg-[rgba(243,203,69,0.16)]"
                : "border-white/10 bg-white/6",
            )}
          >
            <span
              className={cn(
                "absolute top-1 h-5 w-5 rounded-full bg-white transition",
                matchEntry.played ? "left-6" : "left-1",
              )}
            />
          </span>
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rr-kicker text-[color:var(--rr-gold)]">
              Acumulado y medias
            </span>
            <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(243,203,69,0.35),transparent)]" />
          </div>
          <DerivedMetricStrip items={derivedMetrics} />
        </div>

        <div className="space-y-3 border-t border-white/8 pt-3">
          <div className="flex items-center gap-2">
            <span className="rr-kicker text-[color:var(--rr-gold)]">
              Carga del partido
            </span>
            <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(243,203,69,0.35),transparent)]" />
          </div>

          <div
            className={cn(
              "grid grid-cols-2 gap-3",
              !matchEntry.played ? "opacity-90" : undefined,
            )}
          >
            {allFields.map((field) => (
              <MatchStatFieldInput
                key={field.key}
                field={field}
                player={player}
                matchEntry={matchEntry}
                savedMatchEntry={savedMatchEntry}
                onUpdatePlayer={onUpdatePlayer}
                onAdjustPlayer={onAdjustPlayer}
              />
            ))}
          </div>

          {!matchEntry.played ? (
            <p className="text-[0.8rem] text-[color:var(--rr-muted)]">
              Mientras no juegue, este partido no suma PJ ni estadisticas al acumulado.
            </p>
          ) : null}
        </div>
      </div>
    </AdminPanel>
  );
}
