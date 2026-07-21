"use client";

import { Minus, Plus, Star } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import type { StandingManagementRow } from "@/lib/admin/standings-management";
import { cn } from "@/lib/utils";

type StandingMobileCardProps = {
  row: StandingManagementRow;
  errors: string[];
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
  label: string;
  field: EditableStandingField;
  getValue: (row: StandingManagementRow) => number;
}[] = [
  { label: "PJ", field: "played", getValue: (row) => row.played },
  { label: "G", field: "won", getValue: (row) => row.won },
  { label: "E", field: "drawn", getValue: (row) => row.drawn },
  { label: "P", field: "lost", getValue: (row) => row.lost },
  { label: "PTS SA", field: "sanctionPoints", getValue: (row) => row.sanctionPoints },
  { label: "GF", field: "goalsFor", getValue: (row) => row.goalsFor },
  { label: "GC", field: "goalsAgainst", getValue: (row) => row.goalsAgainst },
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

function StandingMobileStepper({
  label,
  rowId,
  field,
  value,
  onUpdateField,
}: {
  label: string;
  rowId: string;
  field: EditableStandingField;
  value: number;
  onUpdateField: StandingMobileCardProps["onUpdateField"];
}) {
  function updateValue(nextValue: number) {
    onUpdateField(rowId, field, Math.max(0, nextValue));
  }

  return (
    <label className="grid gap-1">
      <span className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">
        {label}
      </span>
      <div className="grid grid-cols-[2.4rem_minmax(0,1fr)_2.4rem] items-center overflow-hidden rounded-[16px] border border-white/10 bg-[rgba(255,255,255,0.04)]">
        <button
          type="button"
          onClick={() => updateValue(value - 1)}
          className="inline-flex h-10 items-center justify-center border-r border-white/10 bg-white/5 text-white disabled:cursor-not-allowed disabled:opacity-40"
          disabled={value <= 0}
          aria-label={`Restar ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={value}
          onChange={(event) => updateValue(Number(event.target.value))}
          className="rr-number-input-clean h-10 border-0 bg-transparent px-1 text-center text-[1rem] font-semibold text-white outline-none"
          aria-label={label}
        />
        <button
          type="button"
          onClick={() => updateValue(value + 1)}
          className="inline-flex h-10 items-center justify-center border-l border-[rgba(243,203,69,0.2)] bg-[rgba(243,203,69,0.1)] text-[color:var(--rr-gold)]"
          aria-label={`Sumar ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </label>
  );
}

export function StandingMobileCard({
  row,
  errors,
  canToggleOwnTeam,
  onUpdateField,
  onToggleOwnTeam,
}: StandingMobileCardProps) {
  return (
    <AdminPanel
      className={cn(
        "p-4 lg:hidden",
        errors.length > 0 ? "border-[rgba(214,64,69,0.34)]" : undefined,
        row.isOwnTeam
          ? "border-[rgba(243,203,69,0.38)] bg-[linear-gradient(160deg,rgba(243,203,69,0.12),rgba(255,255,255,0.028))]"
          : undefined,
      )}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/6 text-[0.8rem] font-semibold text-white">
              {isRenderableCrest(row.crestSrc) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.crestSrc} alt="" className="h-full w-full object-cover" />
              ) : (
                getTeamInitials(row.teamName)
              )}
            </div>
            <div className="space-y-1">
              <p className="rr-kicker text-[color:var(--rr-gold)]">
                Posicion {row.position}
              </p>
              <p className="font-semibold text-white">{row.teamName}</p>
            </div>
          </div>

          {row.isOwnTeam ? (
            <span className="rounded-full border border-[rgba(243,203,69,0.32)] bg-[rgba(243,203,69,0.12)] px-2 py-1 text-[0.72rem] font-semibold text-[color:var(--rr-gold)]">
              Equipo del club
            </span>
          ) : null}
        </div>

        {errors.length > 0 ? (
          <div className="rounded-[16px] border border-[rgba(221,108,112,0.34)] bg-[rgba(221,108,112,0.1)] px-3 py-3 text-[0.86rem] text-[#ffc1c4]">
            {errors[0]}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          {editableStandingFields.map((item) => (
            <StandingMobileStepper
              key={item.label}
              label={item.label}
              rowId={row.id}
              field={item.field}
              value={item.getValue(row)}
              onUpdateField={onUpdateField}
            />
          ))}
          <div className="grid gap-1">
            <span className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">
              DG
            </span>
            <div className="min-h-10 rounded-[14px] border border-white/5 bg-white/5 px-3 py-2 text-[0.95rem] text-[color:var(--rr-muted)]">
              {row.goalDifference}
            </div>
          </div>
          <div className="grid gap-1">
            <span className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">
              Pts
            </span>
            <div className="min-h-10 rounded-[14px] border border-white/5 bg-white/5 px-3 py-2 text-[0.95rem] text-[color:var(--rr-muted)]">
              {row.points}
            </div>
          </div>
        </div>

        {canToggleOwnTeam ? (
          <button
            type="button"
            onClick={() => onToggleOwnTeam(row.id)}
            className={cn(
              "rr-button text-[0.78rem]",
              row.isOwnTeam ? "rr-button-primary" : "rr-button-secondary",
            )}
            aria-label={
              row.isOwnTeam
                ? "Quitar marca de equipo del club"
                : "Marcar equipo del club"
            }
          >
            <Star className="h-4 w-4" />
            {row.isOwnTeam ? "Equipo del club" : "Marcar equipo del club"}
          </button>
        ) : null}
      </div>
    </AdminPanel>
  );
}
