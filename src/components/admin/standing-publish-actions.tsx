"use client";

import { ClipboardCopy, RefreshCcw, Save } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { StandingStatusBadge } from "@/components/admin/standing-status-badge";
import {
  formatStandingUpdatedLabel,
  type StandingManagementTable,
} from "@/lib/admin/standings-management-mocks";
import type { AdminRole } from "@/lib/admin/roles";

type StandingPublishActionsProps = {
  role: AdminRole;
  standing: StandingManagementTable;
  validationErrors: string[];
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onDuplicate: () => void;
  onReset: () => void;
};

export function StandingPublishActions({
  role,
  standing,
  validationErrors,
  hasUnsavedChanges,
  onSave,
  onDiscard,
  onDuplicate,
  onReset,
}: StandingPublishActionsProps) {
  const canCreateGlobal = role !== "COACH";

  return (
    <AdminPanel className="p-5 sm:p-6">
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="rr-kicker text-[color:var(--rr-gold)]">
              Guardado manual
            </p>
            <StandingStatusBadge status={standing.status} />
          </div>
          <div className="space-y-2">
            <p className="text-[1rem] font-semibold text-white">
              {standing.teamName}
            </p>
            <p className="text-[0.92rem] leading-6 text-[color:var(--rr-muted)]">
              {standing.competition}
            </p>
            <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
              {formatStandingUpdatedLabel(standing)}
            </p>
          </div>
          {validationErrors.length > 0 ? (
            <div className="rounded-[10px] border border-[rgba(214,64,69,0.34)] bg-[rgba(214,64,69,0.08)] px-3 py-3 text-[0.9rem] text-[#ffc3bc]">
              Hay {validationErrors.length} validaciones pendientes antes de guardar esta tabla.
            </div>
          ) : (
            <p className="text-[0.9rem] leading-6 text-[color:var(--rr-muted)]">
              Guarda cuando la tabla quede lista. Esta pantalla no necesita un flujo editorial complejo.
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <button
            type="button"
            onClick={onSave}
            className="rr-button rr-button-primary justify-center text-[0.82rem]"
          >
            <Save className="h-4 w-4" />
            {hasUnsavedChanges ? "Guardar cambios" : "Guardar de nuevo"}
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="rr-button rr-button-secondary justify-center text-[0.82rem]"
          >
            Cancelar cambios
          </button>
        </div>

        <div className="grid gap-2 border-t border-[rgba(255,255,255,0.08)] pt-4">
          {canCreateGlobal ? (
            <button
              type="button"
              onClick={onDuplicate}
              className="rr-button rr-button-secondary justify-center text-[0.82rem]"
            >
              <ClipboardCopy className="h-4 w-4" />
              Duplicar jornada
            </button>
          ) : null}
          {canCreateGlobal ? (
            <button
              type="button"
              onClick={onReset}
              className="rr-button rr-button-secondary justify-center text-[0.82rem]"
            >
              <RefreshCcw className="h-4 w-4" />
              Restaurar prueba inicial
            </button>
          ) : null}
        </div>
      </div>
    </AdminPanel>
  );
}
