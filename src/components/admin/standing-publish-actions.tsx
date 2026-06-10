"use client";

import Link from "next/link";
import { ArrowUpRight, ClipboardCopy, Eye, RefreshCcw } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { StandingStatusBadge } from "@/components/admin/standing-status-badge";
import {
  formatStandingUpdatedLabel,
  getStandingPublicHref,
  type StandingManagementTable,
} from "@/lib/admin/standings-management-mocks";
import type { AdminRole } from "@/lib/admin/roles";

type StandingPublishActionsProps = {
  role: AdminRole;
  standing: StandingManagementTable;
  validationErrors: string[];
  onSaveDraft: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onMarkReview: () => void;
  onDuplicate: () => void;
  onReset: () => void;
};

export function StandingPublishActions({
  role,
  standing,
  validationErrors,
  onSaveDraft,
  onPublish,
  onUnpublish,
  onMarkReview,
  onDuplicate,
  onReset,
}: StandingPublishActionsProps) {
  const publicHref = getStandingPublicHref(standing);
  const canCreateGlobal = role !== "COACH";

  return (
    <AdminPanel className="p-5 sm:p-6">
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="rr-kicker text-[color:var(--rr-gold)]">
              Publicacion
            </p>
            <StandingStatusBadge status={standing.status} />
          </div>
          <div className="space-y-2">
            <p className="text-[1rem] font-semibold text-white">
              {standing.teamName}
            </p>
            <p className="text-[0.92rem] leading-6 text-[color:var(--rr-muted)]">
              {formatStandingUpdatedLabel(standing)}
            </p>
          </div>
          {validationErrors.length > 0 ? (
            <p className="text-[0.9rem] leading-6 text-[#ffc3bc]">
              Hay {validationErrors.length} validaciones pendientes antes de cerrar esta tabla.
            </p>
          ) : (
            <p className="text-[0.9rem] leading-6 text-[color:var(--rr-muted)]">
              La web publica solo deberia consumir la version marcada como publicada.
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            className="rr-button rr-button-secondary justify-center text-[0.82rem]"
          >
            Guardar borrador
          </button>
          <button
            type="button"
            onClick={onPublish}
            className="rr-button rr-button-primary justify-center text-[0.82rem]"
          >
            Publicar
          </button>
          <button
            type="button"
            onClick={standing.status === "published" ? onUnpublish : onMarkReview}
            className="rr-button rr-button-secondary justify-center text-[0.82rem]"
          >
            {standing.status === "published"
              ? "Despublicar"
              : "Marcar para revision"}
          </button>
        </div>

        <div className="grid gap-2">
          <Link
            href={publicHref}
            className="rr-button rr-button-secondary justify-center text-[0.82rem]"
          >
            <Eye className="h-4 w-4" />
            Ver clasificacion publica
          </Link>
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
              Resetear mock
            </button>
          ) : null}
          <Link
            href={publicHref}
            className="inline-flex items-center justify-center gap-2 text-[0.84rem] text-[color:var(--rr-muted)] transition hover:text-white"
          >
            Abrir vista previa
            <ArrowUpRight className="h-4 w-4 text-[color:var(--rr-gold)]" />
          </Link>
        </div>
      </div>
    </AdminPanel>
  );
}
