"use client";

import Link from "next/link";
import { ArrowUpRight, CircleDot, Eye, PenSquare, Radio, Trophy, Video } from "lucide-react";
import { AdminListCard } from "@/components/admin/admin-list-card";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import {
  formatMatchDateLabel,
  getMatchLocationLabel,
  getMatchPublicHref,
  getMatchResultLabel,
  getVisualMatchStatus,
  type MatchManagementMatch,
  type MatchVisualStatus,
} from "@/lib/admin/match-management-mocks";
import type { AdminRole } from "@/lib/admin/roles";

type MatchListProps = {
  role: AdminRole;
  matches: MatchManagementMatch[];
  onEdit: (match: MatchManagementMatch) => void;
  onQuickResult: (match: MatchManagementMatch) => void;
  onSetPending: (match: MatchManagementMatch) => void;
  onSetLive: (match: MatchManagementMatch) => void;
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
  role,
  match,
  onEdit,
  onQuickResult,
  onSetPending,
  onSetLive,
  onManageHighlights,
}: {
  role: AdminRole;
  match: MatchManagementMatch;
  onEdit: (match: MatchManagementMatch) => void;
  onQuickResult: (match: MatchManagementMatch) => void;
  onSetPending: (match: MatchManagementMatch) => void;
  onSetLive: (match: MatchManagementMatch) => void;
  onManageHighlights: (match: MatchManagementMatch) => void;
}) {
  const visualStatus = getVisualMatchStatus(match.status);
  const canManageLive = role !== "COACH" && match.isFirstTeam;
  const canManageHighlights = role !== "COACH" && match.isFirstTeam && visualStatus === "played";

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={getMatchPublicHref(match)}
        className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-white"
      >
        <Eye className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
        Ver publico
      </Link>

      <button
        type="button"
        onClick={() => onEdit(match)}
        className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-[rgba(253,203,88,0.22)] px-3 text-[0.82rem] text-white transition hover:bg-[rgba(253,203,88,0.08)]"
      >
        <PenSquare className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
        {role === "COACH" ? "Editar previa" : "Editar"}
      </button>

      <button
        type="button"
        onClick={() => onQuickResult(match)}
        className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-white"
      >
        <Trophy className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
        {visualStatus === "played" ? "Actualizar resultado" : "Marcar jugado"}
      </button>

      {visualStatus !== "pending" ? (
        <button
          type="button"
          onClick={() => onSetPending(match)}
          className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-white"
        >
          <CircleDot className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
          Pendiente
        </button>
      ) : null}

      {canManageLive && visualStatus !== "live" ? (
        <button
          type="button"
          onClick={() => onSetLive(match)}
          className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-white"
        >
          <Radio className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
          En vivo
        </button>
      ) : null}

      {canManageHighlights ? (
        <button
          type="button"
          onClick={() => onManageHighlights(match)}
          className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-white"
        >
          <Video className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
          Highlights
        </button>
      ) : null}

      {role === "COACH" ? (
        <>
          <Link
            href={`/admin/clasificaciones?team=${match.teamSlug}`}
            className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-white"
          >
            <ArrowUpRight className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
            Clasificacion
          </Link>
          <Link
            href={`/admin/estadisticas?team=${match.teamSlug}&match=${match.id}`}
            className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-white"
          >
            <ArrowUpRight className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
            Estadisticas
          </Link>
        </>
      ) : null}
    </div>
  );
}

export function MatchList({
  role,
  matches,
  onEdit,
  onQuickResult,
  onSetPending,
  onSetLive,
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
        <div className="space-y-1">
          <p className="font-semibold text-white">{match.teamName}</p>
          <p className="text-[0.88rem] text-[color:var(--rr-muted)]">/{match.teamSlug}</p>
        </div>
      ),
      opponent: (
        <div className="space-y-1">
          <p>{match.opponentName}</p>
          <p className="text-[0.88rem] text-[color:var(--rr-muted)]">{getMatchLocationLabel(match)}</p>
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
        <div className="space-y-1">
          <p>{getMatchResultLabel(match)}</p>
          <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
            {match.previewAvailable ? "Previa lista" : "Previa pendiente"}
          </p>
        </div>
      ),
      venue: (
        <div className="space-y-1">
          <p>{match.venue}</p>
          <div className="flex flex-wrap gap-2">
            {match.detailAvailable ? <AdminStatusBadge label="Detalle" tone="blue" /> : null}
            {match.highlightsUrl ? <AdminStatusBadge label="Highlights" tone="gold" /> : null}
          </div>
        </div>
      ),
      actions: (
        <MatchActions
          role={role}
          match={match}
          onEdit={onEdit}
          onQuickResult={onQuickResult}
          onSetPending={onSetPending}
          onSetLive={onSetLive}
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
                  <AdminStatusBadge label={getMatchResultLabel(match)} tone="blue" />
                  {!match.date ? <AdminStatusBadge label="Fecha por confirmar" tone="slate" /> : null}
                </>
              }
              footer={
                <div className="space-y-4">
                  <div className="grid gap-3 rounded-[10px] border border-white/8 bg-white/4 p-3 text-[0.9rem] text-[color:var(--rr-muted)]">
                    <p>{getMatchLocationLabel(match)}</p>
                    <p>{match.previewAvailable ? "Previa disponible" : "Previa pendiente"}</p>
                    <p>{match.detailAvailable ? "Detalle publico listo" : "Detalle publico aun sin abrir"}</p>
                    {match.highlightsUrl ? <p>Highlights asociados</p> : null}
                  </div>
                  <MatchActions
                    role={role}
                    match={match}
                    onEdit={onEdit}
                    onQuickResult={onQuickResult}
                    onSetPending={onSetPending}
                    onSetLive={onSetLive}
                    onManageHighlights={onManageHighlights}
                  />
                </div>
              }
            />
          );
        })}
      </div>

      <AdminTable
        columns={[
          { key: "date", label: "Fecha" },
          { key: "team", label: "Equipo" },
          { key: "opponent", label: "Rival" },
          { key: "competition", label: "Competicion / jornada" },
          { key: "status", label: "Estado" },
          { key: "result", label: "Resultado" },
          { key: "venue", label: "Campo" },
          { key: "actions", label: "Acciones" },
        ]}
        rows={rows}
      />
    </>
  );
}
