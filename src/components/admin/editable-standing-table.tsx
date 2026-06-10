"use client";

import { ArrowDown, ArrowUp, GripVertical, Star, Trash2 } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { StandingMobileCard } from "@/components/admin/standing-mobile-card";
import type { StandingManagementTable } from "@/lib/admin/standings-management-mocks";
import { cn } from "@/lib/utils";

type EditableStandingTableProps = {
  standing: StandingManagementTable;
  validationErrors: string[];
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
  onAddRow: () => void;
  onRemoveRow: (rowId: string) => void;
  onMoveRowUp: (rowId: string) => void;
  onMoveRowDown: (rowId: string) => void;
};

const inputClassName =
  "min-h-10 rounded-[8px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-3 text-[0.94rem] text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]";

const numberCellClassName =
  "min-w-[4.3rem] text-center";

export function EditableStandingTable({
  standing,
  validationErrors,
  onUpdateField,
  onToggleOwnTeam,
  onAddRow,
  onRemoveRow,
  onMoveRowUp,
  onMoveRowDown,
}: EditableStandingTableProps) {
  return (
    <div className="space-y-4">
      <AdminPanel className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <p className="rr-kicker text-[color:var(--rr-gold)]">
                Tabla editable
              </p>
              <span className="text-[0.86rem] text-[color:var(--rr-muted)]">
                DG se recalcula automaticamente desde GF y GC.
              </span>
            </div>
            <div>
              <h2 className="rr-display text-[2rem] leading-[0.95] text-white">
                {standing.teamName}
              </h2>
              <p className="mt-2 text-[0.95rem] text-[color:var(--rr-muted)]">
                {standing.competition} - {standing.season}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAddRow}
            className="rr-button rr-button-secondary text-[0.82rem]"
          >
            Anadir fila
          </button>
        </div>

        {validationErrors.length > 0 ? (
          <div className="mt-4 rounded-[10px] border border-[rgba(214,64,69,0.34)] bg-[rgba(214,64,69,0.08)] px-4 py-3 text-[0.92rem] text-[#ffc3bc]">
            {validationErrors[0]}
          </div>
        ) : null}
      </AdminPanel>

      <AdminPanel className="hidden overflow-hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)]">
                {[
                  "",
                  "Pos",
                  "Equipo",
                  "PJ",
                  "G",
                  "E",
                  "P",
                  "GF",
                  "GC",
                  "DG",
                  "Pts",
                  "",
                ].map((label, index) => (
                  <th
                    key={`${label}-${index}`}
                    className="px-3 py-3 text-left font-[var(--rr-font-body)] text-[0.78rem] font-bold uppercase tracking-[0.18em] text-[color:var(--rr-muted)]"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {standing.rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-[rgba(255,255,255,0.06)] align-top last:border-b-0",
                    row.isOwnTeam ? "bg-[rgba(253,203,88,0.08)]" : "hover:bg-[rgba(255,255,255,0.03)]",
                  )}
                >
                  <td className="px-3 py-3 align-middle">
                    <div className="flex items-center gap-2 text-[color:var(--rr-muted)]">
                      <GripVertical className="h-4 w-4" />
                      <button
                        type="button"
                        onClick={() => onMoveRowUp(row.id)}
                        disabled={index === 0}
                        className="rounded border border-white/10 p-1 transition hover:border-[rgba(253,203,88,0.32)] disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="Subir fila"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveRowDown(row.id)}
                        disabled={index === standing.rows.length - 1}
                        className="rounded border border-white/10 p-1 transition hover:border-[rgba(253,203,88,0.32)] disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="Bajar fila"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      min={1}
                      value={row.position}
                      onChange={(event) =>
                        onUpdateField(row.id, "position", Number(event.target.value))
                      }
                      className={`${inputClassName} ${numberCellClassName}`}
                    />
                  </td>
                  <td className="min-w-[16rem] px-3 py-3">
                    <input
                      type="text"
                      value={row.teamName}
                      onChange={(event) =>
                        onUpdateField(row.id, "teamName", event.target.value)
                      }
                      placeholder="Nombre del equipo"
                      className={`${inputClassName} w-full`}
                    />
                  </td>
                  {[
                    { field: "played", value: row.played },
                    { field: "won", value: row.won },
                    { field: "drawn", value: row.drawn },
                    { field: "lost", value: row.lost },
                    { field: "goalsFor", value: row.goalsFor },
                    { field: "goalsAgainst", value: row.goalsAgainst },
                  ].map((item) => (
                    <td key={item.field} className="px-3 py-3">
                      <input
                        type="number"
                        min={0}
                        value={item.value}
                        onChange={(event) =>
                          onUpdateField(
                            row.id,
                            item.field as
                              | "played"
                              | "won"
                              | "drawn"
                              | "lost"
                              | "goalsFor"
                              | "goalsAgainst",
                            Number(event.target.value),
                          )
                        }
                        className={`${inputClassName} ${numberCellClassName}`}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-3">
                    <div className="min-h-10 min-w-[4.3rem] rounded-[8px] border border-white/5 bg-white/5 px-3 py-2 text-center text-[0.94rem] text-[color:var(--rr-muted)]">
                      {row.goalDifference}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      min={0}
                      value={row.points}
                      onChange={(event) =>
                        onUpdateField(row.id, "points", Number(event.target.value))
                      }
                      className={`${inputClassName} ${numberCellClassName}`}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleOwnTeam(row.id)}
                        className={cn(
                          "rounded-[8px] border px-2 py-2 transition",
                          row.isOwnTeam
                            ? "border-[rgba(253,203,88,0.4)] bg-[rgba(253,203,88,0.12)] text-[color:var(--rr-gold)]"
                            : "border-white/10 bg-white/5 text-[color:var(--rr-muted)] hover:border-[rgba(253,203,88,0.28)]",
                        )}
                        aria-label="Marcar equipo propio"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveRow(row.id)}
                        className="rounded-[8px] border border-white/10 bg-white/5 px-2 py-2 text-[color:var(--rr-muted)] transition hover:border-[rgba(214,64,69,0.32)] hover:text-[#ffb4ab]"
                        aria-label="Eliminar fila"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanel>

      <div className="grid gap-3 lg:hidden">
        {standing.rows.map((row, index) => (
          <StandingMobileCard
            key={row.id}
            row={row}
            index={index}
            totalRows={standing.rows.length}
            canRemove={standing.rows.length > 1}
            onUpdateField={onUpdateField}
            onToggleOwnTeam={onToggleOwnTeam}
            onRemove={onRemoveRow}
            onMoveUp={onMoveRowUp}
            onMoveDown={onMoveRowDown}
          />
        ))}
      </div>
    </div>
  );
}
