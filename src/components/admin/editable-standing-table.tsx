"use client";

import { Minus, Plus, Star } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { StandingMobileCard } from "@/components/admin/standing-mobile-card";
import { StandingStatusBadge } from "@/components/admin/standing-status-badge";
import type { StandingManagementTable } from "@/lib/admin/standings-management";
import { cn } from "@/lib/utils";

type EditableStandingTableProps = {
  standing: StandingManagementTable;
  validationErrors: string[];
  rowErrors: Record<string, string[]>;
  canToggleOwnTeam: boolean;
  onUpdateField: (
    rowId: string,
    field:
      | "played"
      | "won"
      | "drawn"
      | "lost"
      | "sanctionPoints"
      | "goalsFor"
      | "goalsAgainst",
    value: number,
  ) => void;
  onToggleOwnTeam: (rowId: string) => void;
};

type EditableStandingField =
  | "played"
  | "won"
  | "drawn"
  | "lost"
  | "sanctionPoints"
  | "goalsFor"
  | "goalsAgainst";

const editableStandingFields: {
  field: EditableStandingField;
  getValue: (row: StandingManagementTable["rows"][number]) => number;
}[] = [
  { field: "played", getValue: (row) => row.played },
  { field: "won", getValue: (row) => row.won },
  { field: "drawn", getValue: (row) => row.drawn },
  { field: "lost", getValue: (row) => row.lost },
  { field: "sanctionPoints", getValue: (row) => row.sanctionPoints },
  { field: "goalsFor", getValue: (row) => row.goalsFor },
  { field: "goalsAgainst", getValue: (row) => row.goalsAgainst },
];

function getTeamInitials(teamName: string) {
  return teamName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk.charAt(0))
    .join("")
    .toUpperCase();
}

function isRenderableCrest(crestSrc?: string) {
  return Boolean(
    crestSrc &&
      (crestSrc.startsWith("http") ||
        crestSrc.startsWith("/") ||
        crestSrc.startsWith("data:")),
  );
}

function StandingTeamCell({
  teamName,
  crestSrc,
  isOwnTeam,
}: {
  teamName: string;
  crestSrc?: string;
  isOwnTeam: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/6 text-[0.8rem] font-semibold text-white">
        {isRenderableCrest(crestSrc) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={crestSrc} alt="" className="h-full w-full object-cover" />
        ) : (
          getTeamInitials(teamName)
        )}
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-white">{teamName}</p>
        {isOwnTeam ? (
          <span className="inline-flex rounded-full border border-[rgba(243,203,69,0.32)] bg-[rgba(243,203,69,0.12)] px-2 py-1 text-[0.7rem] font-semibold text-[color:var(--rr-gold)]">
            Equipo del club
          </span>
        ) : null}
      </div>
    </div>
  );
}

function StandingStepperCell({
  rowId,
  field,
  value,
  onUpdateField,
}: {
  rowId: string;
  field: EditableStandingField;
  value: number;
  onUpdateField: EditableStandingTableProps["onUpdateField"];
}) {
  function updateValue(nextValue: number) {
    onUpdateField(rowId, field, Math.max(0, nextValue));
  }

  return (
    <div className="grid w-full grid-cols-[1.95rem_minmax(0,1fr)_1.95rem] items-center overflow-hidden rounded-[14px] border border-white/10 bg-[rgba(255,255,255,0.04)]">
      <button
        type="button"
        onClick={() => updateValue(value - 1)}
        className="inline-flex h-9 items-center justify-center border-r border-white/10 bg-white/5 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={value <= 0}
        aria-label="Restar"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        min={0}
        step={1}
        inputMode="numeric"
        value={value}
        onChange={(event) => updateValue(Number(event.target.value))}
        className="rr-number-input-clean h-9 border-0 bg-transparent px-1 text-center text-[0.96rem] font-semibold text-white outline-none"
        aria-label={field}
      />
      <button
        type="button"
        onClick={() => updateValue(value + 1)}
        className="inline-flex h-9 items-center justify-center border-l border-[rgba(243,203,69,0.2)] bg-[rgba(243,203,69,0.1)] text-[color:var(--rr-gold)] transition hover:bg-[rgba(243,203,69,0.16)]"
        aria-label="Sumar"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function EditableStandingTable({
  standing,
  validationErrors,
  rowErrors,
  canToggleOwnTeam,
  onUpdateField,
  onToggleOwnTeam,
}: EditableStandingTableProps) {
  const ownTeamRows = standing.rows.filter((row) => row.isOwnTeam);
  const ownTeamSummary =
    ownTeamRows.length === 0
      ? "Selecciona al menos un equipo del club antes de guardar."
      : ownTeamRows.length === 1
        ? `1 equipo del club marcado en posicion ${ownTeamRows[0].position}.`
        : `${ownTeamRows.length} equipos del club marcados en la tabla.`;

  return (
    <div className="space-y-4">
      <AdminPanel className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <p className="rr-kicker text-[color:var(--rr-gold)]">Tabla editable</p>
              <StandingStatusBadge status={standing.status} />
            </div>
            <div>
              <h2 className="rr-display text-[2rem] leading-[0.95] text-white">
                {standing.teamName}
              </h2>
              <p className="mt-2 text-[0.95rem] text-[color:var(--rr-muted)]">
                {standing.competition} - {standing.season}
              </p>
              <p className="mt-1 text-[0.88rem] text-[color:var(--rr-muted)]">
                {ownTeamSummary}
              </p>
            </div>
          </div>

          <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3 text-[0.88rem] text-[color:var(--rr-muted)]">
            Pts = G x 3 + E - PTS SA. DG = GF - GC. El orden final se ajusta al guardar.
          </div>
        </div>

        {validationErrors.length > 0 ? (
          <div className="mt-4 space-y-2 rounded-[16px] border border-[rgba(221,108,112,0.34)] bg-[rgba(221,108,112,0.1)] px-4 py-3 text-[0.92rem] text-[#ffc1c4]">
            {validationErrors.slice(0, 3).map((error) => (
              <p key={error}>{error}</p>
            ))}
            {validationErrors.length > 3 ? <p>Hay mas avisos pendientes.</p> : null}
          </div>
        ) : null}
      </AdminPanel>

      <AdminPanel className="hidden overflow-hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[76rem] table-fixed border-collapse">
            <colgroup>
              <col className="w-12" />
              <col className="w-[17rem]" />
              <col className="w-[7.35rem]" />
              <col className="w-[7.35rem]" />
              <col className="w-[7.35rem]" />
              <col className="w-[7.35rem]" />
              <col className="w-[7.35rem]" />
              <col className="w-[7.35rem]" />
              <col className="w-[7.35rem]" />
              <col className="w-16" />
              <col className="w-16" />
              <col className="w-12" />
            </colgroup>
            <thead>
              <tr className="border-b border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)]">
                {["Pos", "Equipo", "PJ", "G", "E", "P", "PTS SA", "GF", "GC", "DG", "Pts", ""].map(
                  (label) => (
                    <th
                      key={label}
                      className={cn(
                        "px-3 py-3 font-[var(--rr-font-body)] text-[0.78rem] font-bold text-[color:var(--rr-muted)]",
                        label === "Equipo" || label === "Pos" ? "text-left" : "text-center",
                      )}
                    >
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {standing.rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-[rgba(255,255,255,0.06)] align-top last:border-b-0",
                    rowErrors[row.id]?.length ? "bg-[rgba(214,64,69,0.08)]" : undefined,
                    row.isOwnTeam
                      ? "bg-[rgba(243,203,69,0.08)]"
                      : "hover:bg-[rgba(255,255,255,0.03)]",
                  )}
                >
                  <td className="px-3 py-3 align-middle text-[0.95rem] font-semibold text-white">
                    {row.position}
                  </td>
                  <td className="px-3 py-3">
                    <StandingTeamCell
                      teamName={row.teamName}
                      crestSrc={row.crestSrc}
                      isOwnTeam={row.isOwnTeam}
                    />
                    {rowErrors[row.id]?.length ? (
                      <p className="mt-2 text-[0.8rem] text-[#ffc1c4]">
                        {rowErrors[row.id][0]}
                      </p>
                    ) : null}
                  </td>
                  {editableStandingFields.map((item) => (
                    <td key={item.field} className="px-3 py-3">
                      <StandingStepperCell
                        rowId={row.id}
                        field={item.field}
                        value={item.getValue(row)}
                        onUpdateField={onUpdateField}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-3">
                    <div className="min-h-9 rounded-[14px] border border-white/5 bg-white/5 px-2 py-2 text-center text-[0.94rem] text-[color:var(--rr-muted)]">
                      {row.goalDifference}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="min-h-9 rounded-[14px] border border-white/5 bg-white/5 px-2 py-2 text-center text-[0.94rem] text-[color:var(--rr-muted)]">
                      {row.points}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {canToggleOwnTeam ? (
                      <button
                        type="button"
                        onClick={() => onToggleOwnTeam(row.id)}
                        className={cn(
                          "rounded-full border px-2 py-2 transition",
                          row.isOwnTeam
                            ? "border-[rgba(243,203,69,0.4)] bg-[rgba(243,203,69,0.12)] text-[color:var(--rr-gold)]"
                            : "border-white/10 bg-white/5 text-[color:var(--rr-muted)] hover:border-[rgba(243,203,69,0.28)]",
                        )}
                        aria-label={
                          row.isOwnTeam
                            ? "Quitar marca de equipo del club"
                            : "Marcar equipo del club"
                        }
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="text-[0.84rem] text-[color:var(--rr-muted)]">
                        {row.isOwnTeam ? "Club" : ""}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanel>

      <div className="grid gap-3 lg:hidden">
        {standing.rows.map((row) => (
          <StandingMobileCard
            key={row.id}
            row={row}
            errors={rowErrors[row.id] ?? []}
            canToggleOwnTeam={canToggleOwnTeam}
            onUpdateField={onUpdateField}
            onToggleOwnTeam={onToggleOwnTeam}
          />
        ))}
      </div>
    </div>
  );
}
