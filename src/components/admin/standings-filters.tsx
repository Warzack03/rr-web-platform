"use client";

import { Layers2, RotateCcw, Shield, Trophy } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { cn } from "@/lib/utils";

export type StandingsFiltersValue = {
  selectionMode: "team" | "competition";
  team: string;
  competition: string;
};

type StandingsFiltersProps = {
  value: StandingsFiltersValue;
  teams: Array<{ slug: string; name: string }>;
  competitions: string[];
  totalStandings: number;
  filteredStandings: number;
  showTeamFilter: boolean;
  onChange: (nextValue: StandingsFiltersValue) => void;
  onReset: () => void;
};

const fieldClassName =
  "min-h-11 rounded-[14px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.04)] px-3 text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]";

export function StandingsFilters({
  value,
  teams,
  competitions,
  totalStandings,
  filteredStandings,
  showTeamFilter,
  onChange,
  onReset,
}: StandingsFiltersProps) {
  return (
    <AdminPanel className="p-5 sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <p className="rr-kicker text-[color:var(--rr-gold)]">Tabla activa</p>
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

        <div className="grid gap-4 xl:grid-cols-2">
          {showTeamFilter ? (
            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                Equipo
              </span>
              <div
                className={cn(
                  "rounded-[16px] border p-4 transition",
                  value.selectionMode === "team"
                    ? "border-[rgba(243,203,69,0.32)] bg-[rgba(243,203,69,0.08)]"
                    : "border-white/10 bg-white/[0.04] opacity-78",
                )}
              >
                <div className="mb-3 flex items-center gap-2 text-[0.84rem] text-[color:var(--rr-muted)]">
                  <Shield className="h-4 w-4 text-[color:var(--rr-gold)]" />
                  Editar por equipo
                </div>
                <select
                  value={value.team}
                  onChange={(event) => {
                    onChange({
                      ...value,
                      selectionMode: "team",
                      team: event.target.value,
                    });
                  }}
                  className={fieldClassName}
                >
                  {teams.map((team) => (
                    <option key={team.slug} value={team.slug}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          ) : null}

          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
              Competicion
            </span>
            <div
              className={cn(
                "rounded-[16px] border p-4 transition",
                value.selectionMode === "competition"
                  ? "border-[rgba(243,203,69,0.32)] bg-[rgba(243,203,69,0.08)]"
                  : "border-white/10 bg-white/[0.04] opacity-78",
              )}
            >
              <div className="mb-3 flex items-center gap-2 text-[0.84rem] text-[color:var(--rr-muted)]">
                <Trophy className="h-4 w-4 text-[color:var(--rr-gold)]" />
                Editar por competicion
              </div>
              <select
                value={value.competition}
                onChange={(event) => {
                  onChange({
                    ...value,
                    selectionMode: "competition",
                    competition: event.target.value,
                  });
                }}
                className={fieldClassName}
              >
                {competitions.map((competition) => (
                  <option key={competition} value={competition}>
                    {competition}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>

        <div className="flex items-start gap-2 rounded-[16px] border border-white/10 bg-white/[0.04] px-4 py-3 text-[0.88rem] text-[color:var(--rr-muted)]">
          <Layers2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rr-gold)]" />
          <p>
            Solo se usa un criterio cada vez. Al elegir equipo o competicion, esa
            seleccion pasa a decidir que clasificacion editamos.
          </p>
        </div>
      </div>
    </AdminPanel>
  );
}
