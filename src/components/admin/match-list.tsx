"use client";

import { ArrowUpRight, PenSquare, Trophy, Video } from "lucide-react";
import { AdminListCard } from "@/components/admin/admin-list-card";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import {
  formatMatchDateLabel,
  getCoachMatchVisualStatus,
  getMatchLocationLabel,
  getMatchResultLabel,
  getVisualMatchStatus,
  type CoachMatchVisualStatus,
  type MatchManagementMatch,
  type MatchVisualStatus,
} from "@/lib/admin/match-management-mocks";
import type { AdminRole } from "@/lib/admin/roles";

type MatchListProps = {
  role: AdminRole;
  matches: MatchManagementMatch[];
  selectedMatchId?: string;
  onViewMatch: (match: MatchManagementMatch) => void;
  onEdit: (match: MatchManagementMatch) => void;
  onQuickResult: (match: MatchManagementMatch) => void;
  onManageHighlights: (match: MatchManagementMatch) => void;
};

function getStatusBadgeProps(status: MatchVisualStatus | CoachMatchVisualStatus) {
  switch (status) {
    case "live":
      return { label: "En vivo", tone: "danger" as const, pulse: true };
    case "played":
      return { label: "Jugado", tone: "success" as const, pulse: false };
    default:
      return { label: "Pendiente", tone: "gold" as const, pulse: false };
  }
}

function getCoachResultLabel(match: MatchManagementMatch) {
  return getCoachMatchVisualStatus(match) === "played"
    ? getMatchResultLabel(match)
    : "Sin resultado";
}

function MatchActions({
  role,
  match,
  onEdit,
  onQuickResult,
  onManageHighlights,
}: {
  role: AdminRole;
  match: MatchManagementMatch;
  onEdit: (match: MatchManagementMatch) => void;
  onQuickResult: (match: MatchManagementMatch) => void;
  onManageHighlights: (match: MatchManagementMatch) => void;
}) {
  const visualStatus = getVisualMatchStatus(match.status);
  const canManageHighlights =
    role !== "COACH" && match.isFirstTeam && visualStatus === "played";

  return (
    <div className="flex flex-wrap gap-2 lg:flex-nowrap">
      <button
        type="button"
        onClick={() => onQuickResult(match)}
        className="rr-button rr-button-primary min-h-8 whitespace-nowrap px-2.5 text-[0.7rem]"
      >
        <Trophy className="h-3.5 w-3.5" />
        {visualStatus === "played" ? "Resultado" : "Marcar jugado"}
      </button>

      <button
        type="button"
        onClick={() => onEdit(match)}
        className="rr-button rr-button-secondary min-h-8 min-w-8 px-2"
        aria-label="Editar partido"
        title="Editar"
      >
        <PenSquare className="h-3.5 w-3.5" />
      </button>

      {canManageHighlights ? (
        <button
          type="button"
          onClick={() => onManageHighlights(match)}
          className="rr-button rr-button-secondary min-h-8 min-w-8 px-2"
          aria-label="Gestionar highlights"
          title="Highlights"
        >
          <Video className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

export function MatchList({
  role,
  matches,
  selectedMatchId,
  onViewMatch,
  onEdit,
  onQuickResult,
  onManageHighlights,
}: MatchListProps) {
  const isCoach = role === "COACH";
  const rows = matches.map((match) => {
    const visualStatus = isCoach
      ? getCoachMatchVisualStatus(match)
      : getVisualMatchStatus(match.status);
    const statusBadge = getStatusBadgeProps(visualStatus);
    const isSelected = match.id === selectedMatchId;

    return {
      date: (
        <div className="space-y-1">
          <p className="font-semibold text-white">{formatMatchDateLabel(match)}</p>
          <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
            {match.date ? match.venue : "Pendiente de fecha definitiva"}
          </p>
        </div>
      ),
      team: (
        <div>
          <p className="font-semibold text-white">{match.teamName}</p>
        </div>
      ),
      opponent: (
        <div className="space-y-1">
          <p>{match.opponentName}</p>
          <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
            {getMatchLocationLabel(match)}
          </p>
        </div>
      ),
      competition: (
        <div className="space-y-1">
          <p>{match.competition}</p>
          <p className="text-[0.88rem] text-[color:var(--rr-muted)]">{match.matchday}</p>
        </div>
      ),
      status: (
        <AdminStatusBadge
          label={statusBadge.label}
          tone={statusBadge.tone}
          pulse={statusBadge.pulse}
        />
      ),
      result: (
        <div>
          <p>{isCoach ? getCoachResultLabel(match) : getMatchResultLabel(match)}</p>
        </div>
      ),
      actions: isCoach ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onViewMatch(match)}
            className={
              isSelected
                ? "rr-button rr-button-primary min-h-9 px-3 text-[0.78rem]"
                : "rr-button rr-button-primary min-h-9 px-3 text-[0.78rem]"
            }
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            Ver partido
          </button>
        </div>
      ) : (
        <MatchActions
          role={role}
          match={match}
          onEdit={onEdit}
          onQuickResult={onQuickResult}
          onManageHighlights={onManageHighlights}
        />
      ),
    };
  });

  return (
    <>
      <div className="grid gap-3 lg:hidden">
        {matches.map((match) => {
          const visualStatus = isCoach
            ? getCoachMatchVisualStatus(match)
            : getVisualMatchStatus(match.status);
          const statusBadge = getStatusBadgeProps(visualStatus);
          const isSelected = match.id === selectedMatchId;

          return (
            <AdminListCard
              key={match.id}
              eyebrow={`${match.matchday} · ${match.competition}`}
              title={`${match.teamName} vs ${match.opponentName}`}
              description={`${formatMatchDateLabel(match)} · ${match.venue}`}
              meta={
                <>
                  <AdminStatusBadge
                    label={statusBadge.label}
                    tone={statusBadge.tone}
                    pulse={statusBadge.pulse}
                  />
                  <AdminStatusBadge
                    label={isCoach ? getCoachResultLabel(match) : getMatchResultLabel(match)}
                    tone="blue"
                  />
                  {!match.date ? (
                    <AdminStatusBadge label="Fecha por confirmar" tone="slate" />
                  ) : null}
                </>
              }
              footer={
              <div className="space-y-4">
                <div className="grid gap-3 rounded-[10px] border border-white/8 bg-white/4 p-3 text-[0.9rem] text-[color:var(--rr-muted)]">
                  <p>{getMatchLocationLabel(match)}</p>
                  <p>{match.competition}</p>
                  <p>{match.matchday}</p>
                </div>

                  {isCoach ? (
                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={() => onViewMatch(match)}
                        className="rr-button rr-button-primary w-full justify-center text-[0.8rem]"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        Ver partido
                      </button>
                      {isSelected ? (
                        <p className="text-[0.82rem] text-[color:var(--rr-gold)]">
                          Partido abierto abajo.
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <MatchActions
                      role={role}
                      match={match}
                      onEdit={onEdit}
                      onQuickResult={onQuickResult}
                      onManageHighlights={onManageHighlights}
                    />
                  )}
                </div>
              }
            />
          );
        })}
      </div>

      <AdminTable
        columns={[
          { key: "date", label: "Fecha", className: "w-[15%]" },
          { key: "team", label: "Equipo", className: "w-[13%]" },
          { key: "opponent", label: "Rival", className: "w-[15%]" },
          { key: "competition", label: "Competicion / jornada", className: "w-[22%]" },
          { key: "status", label: "Estado", className: "w-[11%]" },
          { key: "result", label: "Resultado", className: "w-[9%]" },
          { key: "actions", label: "Acciones", className: "w-[15%]" },
        ]}
        rows={rows}
      />
    </>
  );
}
