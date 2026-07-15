"use client";

import { AdminPanel } from "@/components/admin/admin-panel";
import { StandingStatusBadge } from "@/components/admin/standing-status-badge";
import {
  formatStandingUpdatedLabel,
  type StandingManagementTable,
} from "@/lib/admin/standings-management-mocks";
import { cn } from "@/lib/utils";

type StandingsSelectorProps = {
  standings: StandingManagementTable[];
  selectedStandingId: string;
  onSelect: (standingId: string) => void;
};

export function StandingsSelector({
  standings,
  selectedStandingId,
  onSelect,
}: StandingsSelectorProps) {
  return (
    <AdminPanel className="p-5 sm:p-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="rr-kicker text-[color:var(--rr-gold)]">
            Selector de clasificacion
          </p>
          <p className="text-[0.94rem] leading-6 text-[color:var(--rr-muted)]">
            Elige la tabla activa antes de editar filas o guardar cambios.
          </p>
        </div>

        <div className="grid gap-3">
          {standings.map((standing) => {
            const isSelected = standing.id === selectedStandingId;

            return (
              <button
                key={standing.id}
                type="button"
                onClick={() => onSelect(standing.id)}
                className={cn(
                  "rounded-[16px] border px-4 py-4 text-left transition",
                  isSelected
                    ? "border-[rgba(243,203,69,0.4)] bg-[rgba(243,203,69,0.09)] shadow-[0_0_0_1px_rgba(243,203,69,0.16)]"
                    : "border-white/10 bg-[rgba(255,255,255,0.045)] hover:border-[rgba(243,203,69,0.24)] hover:bg-[rgba(255,255,255,0.065)]",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="rr-kicker text-[0.72rem] text-[color:var(--rr-muted)]">
                      {standing.season}
                    </p>
                    <div>
                      <p className="text-[1rem] font-semibold text-white">
                        {standing.teamName}
                      </p>
                      <p className="mt-1 text-[0.92rem] text-[color:var(--rr-muted)]">
                        {standing.competition}
                      </p>
                    </div>
                  </div>
                  <StandingStatusBadge status={standing.status} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.84rem] text-[color:var(--rr-muted)]">
                  <span>{standing.category}</span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span>{formatStandingUpdatedLabel(standing)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </AdminPanel>
  );
}
