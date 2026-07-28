"use client";

import { PenSquare, Trophy, Video } from "lucide-react";
import { AdminListCard } from "@/components/admin/admin-list-card";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import {
  formatMatchDateLabel,
  getMatchLocationLabel,
  getMatchResultLabel,
  getVisualMatchStatus,
  type MatchManagementMatch,
  type MatchVisualStatus,
} from "@/lib/admin/match-management";

type MatchListProps = {
  matches: MatchManagementMatch[];
  disabled?: boolean;
  onEdit: (match: MatchManagementMatch) => void;
  onQuickResult: (match: MatchManagementMatch) => void;
  onManageHighlights: (match: MatchManagementMatch) => void;
};

function getStatusBadgeProps(status: MatchVisualStatus) {
  switch (status) {
    case "live":
      return { label: "En vivo", tone: "danger" as const, pulse: true };
    case "played":
      return { label: "Jugado", tone: "success" as const, pulse: false };
    default:
      return { label: "Pendiente", tone: "gold" as const, pulse: false };
  }
}

function MatchActions({
  match,
  disabled,
  onEdit,
  onQuickResult,
  onManageHighlights,
}: {
  match: MatchManagementMatch;
  disabled?: boolean;
  onEdit: (match: MatchManagementMatch) => void;
  onQuickResult: (match: MatchManagementMatch) => void;
  onManageHighlights: (match: MatchManagementMatch) => void;
}) {
  const visualStatus = getVisualMatchStatus(match.status);
  const canManageHighlights =
    match.isFirstTeam && visualStatus === "played";

  return (
    <div className="flex flex-wrap gap-2 lg:flex-nowrap">
      <button
        type="button"
        onClick={() => onQuickResult(match)}
        disabled={disabled}
        className="rr-button rr-button-primary min-h-8 whitespace-nowrap px-2.5 text-[0.7rem]"
      >
        <Trophy className="h-3.5 w-3.5" />
        {visualStatus === "played" ? "Resultado" : "Marcar jugado"}
      </button>

      <button
        type="button"
        onClick={() => onEdit(match)}
        disabled={disabled}
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
          disabled={disabled}
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
  matches,
  disabled,
  onEdit,
  onQuickResult,
  onManageHighlights,
}: MatchListProps) {
  const rows = matches.map((match) => {
    const visualStatus = getVisualMatchStatus(match.status);
    const statusBadge = getStatusBadgeProps(visualStatus);

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
          <p>{getMatchResultLabel(match)}</p>
        </div>
      ),
      actions: (
        <MatchActions
          match={match}
          disabled={disabled}
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
          const visualStatus = getVisualMatchStatus(match.status);
          const statusBadge = getStatusBadgeProps(visualStatus);

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
                    label={getMatchResultLabel(match)}
                    tone="blue"
                  />
                  {!match.date ? (
                    <AdminStatusBadge label="Fecha por confirmar" tone="slate" />
                  ) : null}
                </>
              }
              footer={
              <div className="space-y-4">
                <div className="grid gap-3 rounded-[16px] border border-white/8 bg-white/4 p-3 text-[0.9rem] text-[color:var(--rr-muted)]">
                  <p>{getMatchLocationLabel(match)}</p>
                  <p>{match.competition}</p>
                  <p>{match.matchday}</p>
                </div>

                  <MatchActions
                    match={match}
                    disabled={disabled}
                    onEdit={onEdit}
                    onQuickResult={onQuickResult}
                    onManageHighlights={onManageHighlights}
                  />
                </div>
              }
            />
          );
        })}
      </div>

      <AdminTable
        caption="Listado de partidos"
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
