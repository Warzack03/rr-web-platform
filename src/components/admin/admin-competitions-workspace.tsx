"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { CalendarRange, Pencil, Plus, Power, Search, ShieldCheck, Trophy } from "lucide-react";
import {
  saveCompetitionAction,
  toggleCompetitionActiveAction,
} from "@/app/admin/(panel)/competiciones/actions";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { CompetitionManagementDialog } from "@/components/admin/competition-management-dialog";
import type { CompetitionManagementItem } from "@/lib/admin/competition-management";

type AdminCompetitionsWorkspaceProps = {
  initialCompetitions: CompetitionManagementItem[];
  seasonOptions: string[];
};

type Feedback = { message: string; tone: "success" | "danger" | "info" };

function sortCompetitions(items: CompetitionManagementItem[]) {
  return [...items].sort(
    (left, right) =>
      right.season.localeCompare(left.season, "es") ||
      left.name.localeCompare(right.name, "es"),
  );
}

export function AdminCompetitionsWorkspace({
  initialCompetitions,
  seasonOptions,
}: AdminCompetitionsWorkspaceProps) {
  const [competitions, setCompetitions] = useState(() => sortCompetitions(initialCompetitions));
  const [season, setSeason] = useState("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 2600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const filteredCompetitions = competitions.filter((competition) => {
    if (season !== "all" && competition.season !== season) return false;
    if (!deferredSearch) return true;

    return [competition.name, competition.organizer, competition.groupName, competition.season]
      .join(" ")
      .toLowerCase()
      .includes(deferredSearch);
  });
  const selectedCompetition =
    editingId && editingId !== "new"
      ? competitions.find((competition) => competition.id === editingId)
      : undefined;
  const activeCount = competitions.filter((competition) => competition.active).length;
  const linkedTeams = competitions.reduce((total, competition) => total + competition.teamCount, 0);

  async function saveCompetition(input: Parameters<typeof saveCompetitionAction>[0]) {
    setIsSaving(true);
    const result = await saveCompetitionAction(input);
    setIsSaving(false);

    if (!result.ok) {
      setFeedback({ message: result.message, tone: "danger" });
      return;
    }

    setCompetitions(sortCompetitions(result.data.competitions));
    setEditingId(null);
    setFeedback({ message: result.message, tone: "success" });
  }

  async function toggleActive(competitionId: string) {
    setIsSaving(true);
    const result = await toggleCompetitionActiveAction({ competitionId });
    setIsSaving(false);

    if (!result.ok) {
      setFeedback({ message: result.message, tone: "danger" });
      return;
    }

    setCompetitions(sortCompetitions(result.data.competitions));
    setFeedback({ message: result.message, tone: "success" });
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Estructura deportiva"
        title="Competiciones"
        description="Gestiona las ligas y copas de cada temporada."
        actions={
          <button
            type="button"
            onClick={() => {
              if (seasonOptions.length === 0) {
                setFeedback({ message: "Necesitas una temporada antes de crear competiciones.", tone: "info" });
                return;
              }
              setEditingId("new");
            }}
            className="rr-button rr-button-primary text-[0.82rem]"
          >
            <Plus className="h-4 w-4" />
            Nueva competicion
          </button>
        }
      />

      {feedback ? <AdminFeedbackBanner message={feedback.message} tone={feedback.tone} /> : null}

      <div className="grid gap-3 md:grid-cols-3">
        <AdminMetricCard label="Competiciones" value={competitions.length.toString()} detail="Registradas" tone="gold" compact icon={<Trophy className="h-5 w-5" />} />
        <AdminMetricCard label="Activas" value={activeCount.toString()} detail="Disponibles para gestionar" tone="blue" compact icon={<ShieldCheck className="h-5 w-5" />} />
        <AdminMetricCard label="Asignaciones" value={linkedTeams.toString()} detail="Equipos en competiciones" tone="slate" compact icon={<CalendarRange className="h-5 w-5" />} />
      </div>

      <AdminPanel className="p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_15rem]">
          <label className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--rr-muted)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-h-11 w-full rounded-[14px] border border-white/10 bg-white/4 pl-10 pr-3 text-white outline-none focus:border-[rgba(243,203,69,0.4)]"
              placeholder="Buscar competicion"
            />
          </label>
          <select
            value={season}
            onChange={(event) => setSeason(event.target.value)}
            className="min-h-11 rounded-[14px] border border-white/10 bg-[rgb(12,31,53)] px-3 text-white outline-none"
          >
            <option value="all">Todas las temporadas</option>
            {seasonOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </AdminPanel>

      {filteredCompetitions.length === 0 ? (
        <AdminEmptyState
          eyebrow="Competiciones"
          title={competitions.length === 0 ? "Aun no hay competiciones" : "Sin resultados"}
          description={competitions.length === 0 ? "Crea la primera liga o copa para empezar a asignar equipos." : "Prueba con otra temporada o busqueda."}
        />
      ) : (
        <AdminPanel className="overflow-hidden">
          <div className="hidden grid-cols-[minmax(14rem,1.4fr)_minmax(10rem,0.8fr)_7rem_7rem_7rem_10rem] gap-3 border-b border-white/10 px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--rr-muted)] lg:grid">
            <span>Competicion</span><span>Temporada</span><span>Equipos</span><span>Partidos</span><span>Tablas</span><span className="text-right">Acciones</span>
          </div>
          <div className="divide-y divide-white/10">
            {filteredCompetitions.map((competition) => (
              <div key={competition.id} className="grid gap-4 px-5 py-4 lg:grid-cols-[minmax(14rem,1.4fr)_minmax(10rem,0.8fr)_7rem_7rem_7rem_10rem] lg:items-center lg:gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-white">{competition.name}</p>
                    <AdminStatusBadge label={competition.active ? "Activa" : "Inactiva"} tone={competition.active ? "success" : "slate"} />
                  </div>
                  {competition.organizer || competition.groupName ? (
                    <p className="mt-1 truncate text-[0.82rem] text-[color:var(--rr-muted)]">
                      {[competition.organizer, competition.groupName].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                </div>
                <p className="text-[0.9rem] text-[color:var(--rr-muted)]">{competition.season}</p>
                <p className="text-sm text-white"><span className="lg:hidden text-[color:var(--rr-muted)]">Equipos: </span>{competition.teamCount}</p>
                <p className="text-sm text-white"><span className="lg:hidden text-[color:var(--rr-muted)]">Partidos: </span>{competition.matchCount}</p>
                <p className="text-sm text-white"><span className="lg:hidden text-[color:var(--rr-muted)]">Tablas: </span>{competition.standingCount}</p>
                <div className="flex gap-2 lg:justify-end">
                  <button type="button" onClick={() => setEditingId(competition.id)} disabled={isSaving} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-[rgba(243,203,69,0.3)]" aria-label={`Editar ${competition.name}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => toggleActive(competition.id)} disabled={isSaving} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[color:var(--rr-muted)] transition hover:border-[rgba(243,203,69,0.3)] hover:text-white" aria-label={competition.active ? `Desactivar ${competition.name}` : `Reactivar ${competition.name}`}>
                    <Power className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AdminPanel>
      )}

      {editingId ? (
        <CompetitionManagementDialog
          key={editingId}
          competition={selectedCompetition}
          seasons={seasonOptions}
          isSaving={isSaving}
          onClose={() => setEditingId(null)}
          onSave={saveCompetition}
        />
      ) : null}
    </div>
  );
}

