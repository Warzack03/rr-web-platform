"use client";

import { RotateCcw, Search } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";

export type MatchFiltersValue = {
  season: string;
  team: string;
  status: "all" | "pending" | "live" | "played";
  competition: string;
  date: "all" | "next-7" | "this-month" | "undated";
  search: string;
};

type MatchFiltersProps = {
  value: MatchFiltersValue;
  seasons: string[];
  teams: Array<{ slug: string; name: string }>;
  competitions: string[];
  totalMatches: number;
  filteredMatches: number;
  showTeamFilter: boolean;
  allowLiveFilter: boolean;
  onChange: (nextValue: MatchFiltersValue) => void;
  onReset: () => void;
};

const fieldClassName =
  "min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]";

export function MatchFilters({
  value,
  seasons,
  teams,
  competitions,
  totalMatches,
  filteredMatches,
  showTeamFilter,
  allowLiveFilter,
  onChange,
  onReset,
}: MatchFiltersProps) {
  function updateField<Key extends keyof MatchFiltersValue>(
    key: Key,
    nextValue: MatchFiltersValue[Key],
  ) {
    onChange({
      ...value,
      [key]: nextValue,
    });
  }

  return (
    <AdminPanel className="p-5 sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <p className="rr-kicker text-[color:var(--rr-gold)]">Filtros</p>
            <p className="text-[0.94rem] text-[color:var(--rr-muted)]">
              Mostrando {filteredMatches} de {totalMatches} partidos.
            </p>
          </div>
          <button type="button" onClick={onReset} className="rr-button rr-button-secondary text-[0.8rem]">
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Rival</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--rr-gold)]" />
              <input
                type="search"
                value={value.search}
                onChange={(event) => updateField("search", event.target.value)}
                placeholder="Buscar rival"
                className={`${fieldClassName} w-full pl-10`}
              />
            </div>
          </label>

          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Temporada</span>
            <select
              value={value.season}
              onChange={(event) => updateField("season", event.target.value)}
              className={fieldClassName}
            >
              <option value="all">Todas</option>
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </label>

          {showTeamFilter ? (
            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Equipo</span>
              <select
                value={value.team}
                onChange={(event) => updateField("team", event.target.value)}
                className={fieldClassName}
              >
                <option value="all">Todos</option>
                {teams.map((team) => (
                  <option key={team.slug} value={team.slug}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Estado</span>
            <select
              value={value.status}
              onChange={(event) =>
                updateField("status", event.target.value as MatchFiltersValue["status"])
              }
              className={fieldClassName}
            >
              <option value="all">Todos</option>
              {allowLiveFilter ? <option value="live">En vivo</option> : null}
              <option value="played">Jugados</option>
              <option value="pending">Pendientes</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Competicion</span>
            <select
              value={value.competition}
              onChange={(event) => updateField("competition", event.target.value)}
              className={fieldClassName}
            >
              <option value="all">Todas</option>
              {competitions.map((competition) => (
                <option key={competition} value={competition}>
                  {competition}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Fecha</span>
            <select
              value={value.date}
              onChange={(event) => updateField("date", event.target.value as MatchFiltersValue["date"])}
              className={fieldClassName}
            >
              <option value="all">Todas</option>
              <option value="next-7">Proximos 7 dias</option>
              <option value="this-month">Este mes</option>
              <option value="undated">Fecha por confirmar</option>
            </select>
          </label>
        </div>
      </div>
    </AdminPanel>
  );
}
