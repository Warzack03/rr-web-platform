"use client";

import { RotateCcw, Search } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";

export type TeamFiltersValue = {
  season: string;
  branch: string;
  visibility: "all" | "visible" | "hidden";
  activity: "all" | "active" | "inactive";
  search: string;
};

type TeamFiltersProps = {
  value: TeamFiltersValue;
  seasons: string[];
  branches: string[];
  totalTeams: number;
  filteredTeams: number;
  onChange: (nextValue: TeamFiltersValue) => void;
  onReset: () => void;
};

const fieldClassName =
  "min-h-11 rounded-[14px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.04)] px-3 text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]";

export function TeamFilters({
  value,
  seasons,
  branches,
  totalTeams,
  filteredTeams,
  onChange,
  onReset,
}: TeamFiltersProps) {
  function updateField<Key extends keyof TeamFiltersValue>(key: Key, nextValue: TeamFiltersValue[Key]) {
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
              Mostrando {filteredTeams} de {totalTeams} equipos.
            </p>
          </div>
          <button type="button" onClick={onReset} className="rr-button rr-button-secondary text-[0.8rem]">
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <label className="grid gap-2 xl:col-span-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Buscar</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--rr-gold)]" />
              <input
                type="search"
                value={value.search}
                onChange={(event) => updateField("search", event.target.value)}
                placeholder="Nombre, slug o competicion"
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

          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Rama</span>
            <select
              value={value.branch}
              onChange={(event) => updateField("branch", event.target.value)}
              className={fieldClassName}
            >
              <option value="all">Todas</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Web</span>
            <select
              value={value.visibility}
              onChange={(event) => updateField("visibility", event.target.value as TeamFiltersValue["visibility"])}
              className={fieldClassName}
            >
              <option value="all">Todos</option>
              <option value="visible">Solo visibles</option>
              <option value="hidden">Solo ocultos</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Estado</span>
            <select
              value={value.activity}
              onChange={(event) => updateField("activity", event.target.value as TeamFiltersValue["activity"])}
              className={fieldClassName}
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </label>
        </div>
      </div>
    </AdminPanel>
  );
}
