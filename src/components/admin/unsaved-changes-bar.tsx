"use client";

import { AlertTriangle } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";

type UnsavedChangesBarProps = {
  onDiscard: () => void;
  onSave: () => void;
  isSaving?: boolean;
};

export function UnsavedChangesBar({
  onDiscard,
  onSave,
  isSaving = false,
}: UnsavedChangesBarProps) {
  return (
    <AdminPanel className="sticky bottom-4 z-10 border-[rgba(253,203,88,0.32)] px-4 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 h-4.5 w-4.5 text-[color:var(--rr-gold)]" />
          <div className="space-y-1">
            <p className="text-[0.96rem] font-semibold text-white">
              Hay cambios sin guardar en esta clasificacion.
            </p>
            <p className="text-[0.9rem] leading-6 text-[color:var(--rr-muted)]">
              Guardalos ahora o cancela los cambios antes de salir de esta tabla.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onDiscard}
            disabled={isSaving}
            className="rr-button rr-button-secondary text-[0.82rem]"
          >
            Cancelar cambios
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="rr-button rr-button-primary text-[0.82rem]"
          >
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </AdminPanel>
  );
}
