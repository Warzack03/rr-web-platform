"use client";

import { RotateCcw, Search } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";

export type StandingsFiltersValue = {
  season: string;
  team: string;
  competition: string;
  category: string;
  status: "all" | "published" | "draft" | "review";
  search: string;
};

type StandingsFiltersProps = {
  value: StandingsFiltersValue;
  seasons: string[];
  teams: Array<{ slug: string; name: string }>;
  competitions: string[];
  categories: string[];
  totalStandings: number;
  filteredStandings: number;
  showTeamFilter: boolean;
  onChange: (nextValue: StandingsFiltersValue) => void;
  onReset: () => void;
};

const fieldClassName =
  "min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]";

export function StandingsFilters({
  value,
  seasons,
  teams,
  competitions,
  categories,
  totalStandings,
  filteredStandings,
  showTeamFilter,
  onChange,
  onReset,
}: StandingsFiltersProps) {
  function updateField<Key extends keyof StandingsFiltersValue>(
    key: Key,
    nextValue: StandingsFiltersValue[Key],
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
              Mostrando {filteredStandings} de {totalStandings} clasificaciones.
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="rr-button rr-button-secondary text-[0.8rem]"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <label className="grid gap-2 xl:col-span-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
              Buscar
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--rr-gold)]" />
              <input
                type="search"
                value={value.search}
                onChange={(event) => updateField("search", event.target.value)}
                placeholder="Equipo o competicion"
                className={`${fieldClassName} w-full pl-10`}
              />
            </div>
          </label>

          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
              Temporada
            </span>
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
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                Equipo
              </span>
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
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
              Competicion
            </span>
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
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
              Categoria
            </span>
            <select
              value={value.category}
              onChange={(event) => updateField("category", event.target.value)}
              className={fieldClassName}
            >
              <option value="all">Todas</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
              Estado
            </span>
            <select
              value={value.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as StandingsFiltersValue["status"],
                )
              }
              className={fieldClassName}
            >
              <option value="all">Todos</option>
              <option value="published">Publicada</option>
              <option value="draft">Borrador</option>
              <option value="review">Pendiente de revision</option>
            </select>
          </label>
        </div>
      </div>
    </AdminPanel>
  );
}
