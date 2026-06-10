"use client";

import { ArrowDown, ArrowUp, Star, Trash2 } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import type { StandingManagementRow } from "@/lib/admin/standings-management-mocks";
import { cn } from "@/lib/utils";

type StandingMobileCardProps = {
  row: StandingManagementRow;
  index: number;
  totalRows: number;
  canRemove: boolean;
  onUpdateField: (
    rowId: string,
    field:
      | "teamName"
      | "played"
      | "won"
      | "drawn"
      | "lost"
      | "goalsFor"
      | "goalsAgainst"
      | "points"
      | "position",
    value: string | number,
  ) => void;
  onToggleOwnTeam: (rowId: string) => void;
  onRemove: (rowId: string) => void;
  onMoveUp: (rowId: string) => void;
  onMoveDown: (rowId: string) => void;
};

const inputClassName =
  "min-h-10 rounded-[8px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-3 text-[0.95rem] text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]";

export function StandingMobileCard({
  row,
  index,
  totalRows,
  canRemove,
  onUpdateField,
  onToggleOwnTeam,
  onRemove,
  onMoveUp,
  onMoveDown,
}: StandingMobileCardProps) {
  return (
    <AdminPanel
      className={cn(
        "p-4 lg:hidden",
        row.isOwnTeam
          ? "border-[rgba(253,203,88,0.38)] bg-[linear-gradient(180deg,rgba(48,37,10,0.92),rgba(11,21,37,0.96))]"
          : undefined,
      )}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="rr-kicker text-[color:var(--rr-gold)]">
              Posicion {row.position}
            </p>
            <input
              type="text"
              value={row.teamName}
              onChange={(event) =>
                onUpdateField(row.id, "teamName", event.target.value)
              }
              placeholder="Nombre del equipo"
              className={`${inputClassName} w-full min-w-0`}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onMoveUp(row.id)}
              disabled={index === 0}
              className="rr-button rr-button-secondary px-3 text-[0.78rem] disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Subir fila"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(row.id)}
              disabled={index === totalRows - 1}
              className="rr-button rr-button-secondary px-3 text-[0.78rem] disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Bajar fila"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "PJ", field: "played", value: row.played },
            { label: "G", field: "won", value: row.won },
            { label: "E", field: "drawn", value: row.drawn },
            { label: "P", field: "lost", value: row.lost },
            { label: "GF", field: "goalsFor", value: row.goalsFor },
            { label: "GC", field: "goalsAgainst", value: row.goalsAgainst },
            { label: "Pts", field: "points", value: row.points },
            { label: "DG", field: "position", value: row.goalDifference, readOnly: true },
          ].map((item) => (
            <label key={item.label} className="grid gap-1">
              <span className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">
                {item.label}
              </span>
              <input
                type="number"
                min={0}
                value={item.value}
                readOnly={Boolean(item.readOnly)}
                onChange={(event) =>
                  item.readOnly
                    ? undefined
                    : onUpdateField(
                        row.id,
                        item.field as
                          | "played"
                          | "won"
                          | "drawn"
                          | "lost"
                          | "goalsFor"
                          | "goalsAgainst"
                          | "points",
                        Number(event.target.value),
                      )
                }
                className={cn(
                  inputClassName,
                  item.readOnly ? "cursor-default border-white/5 text-[color:var(--rr-muted)]" : undefined,
                )}
              />
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleOwnTeam(row.id)}
            className={cn(
              "rr-button text-[0.78rem]",
              row.isOwnTeam ? "rr-button-primary" : "rr-button-secondary",
            )}
          >
            <Star className="h-4 w-4" />
            {row.isOwnTeam ? "Equipo propio" : "Marcar propio"}
          </button>

          {canRemove ? (
            <button
              type="button"
              onClick={() => onRemove(row.id)}
              className="rr-button rr-button-secondary text-[0.78rem]"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          ) : null}
        </div>
      </div>
    </AdminPanel>
  );
}
