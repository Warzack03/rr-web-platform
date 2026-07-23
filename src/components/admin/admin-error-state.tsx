"use client";

import { AlertTriangle } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";

type AdminErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function AdminErrorState({
  title = "No hemos podido cargar esta pantalla",
  description = "Revisa la conexion o vuelve a intentarlo en unos segundos.",
  onRetry,
}: AdminErrorStateProps) {
  return (
    <AdminPanel className="border-[rgba(214,64,69,0.34)] p-6">
      <div className="max-w-2xl space-y-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-[color:var(--rr-gold)]" />
          <p className="rr-kicker text-[color:var(--rr-gold)]">Error</p>
        </div>
        <h1 className="rr-display text-[2.4rem] leading-[0.95] text-white">
          {title}
        </h1>
        <p className="text-[0.98rem] leading-6 text-[color:var(--rr-muted)]">
          {description}
        </p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rr-button rr-button-primary text-[0.82rem]"
          >
            Reintentar
          </button>
        ) : null}
      </div>
    </AdminPanel>
  );
}
