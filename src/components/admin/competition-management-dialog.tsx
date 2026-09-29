"use client";

import { useState, type FormEvent } from "react";
import { Trophy, X } from "lucide-react";
import type { CompetitionManagementItem } from "@/lib/admin/competition-management";

type CompetitionManagementDialogProps = {
  competition?: CompetitionManagementItem;
  seasons: string[];
  isSaving: boolean;
  onClose: () => void;
  onSave: (input: {
    competitionId?: string;
    season: string;
    name: string;
    organizer: string;
    groupName: string;
    active: boolean;
  }) => void;
};

const fieldClassName =
  "min-h-11 rounded-[14px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.04)] px-3 text-white outline-none transition focus:border-[rgba(243,203,69,0.48)] disabled:opacity-60";

export function CompetitionManagementDialog({
  competition,
  seasons,
  isSaving,
  onClose,
  onSave,
}: CompetitionManagementDialogProps) {
  const [season, setSeason] = useState(competition?.season ?? seasons[0] ?? "");
  const [name, setName] = useState(competition?.name ?? "");
  const [organizer, setOrganizer] = useState(competition?.organizer ?? "");
  const [groupName, setGroupName] = useState(competition?.groupName ?? "");
  const [active, setActive] = useState(competition?.active ?? true);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!season || name.trim().length < 2) {
      setError("Selecciona temporada e introduce el nombre de la competicion.");
      return;
    }

    setError("");
    onSave({
      competitionId: competition?.id,
      season,
      name: name.trim(),
      organizer: organizer.trim(),
      groupName: groupName.trim(),
      active,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(5,10,18,0.78)] px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[22px] border border-[color:var(--rr-border)] bg-[linear-gradient(160deg,rgba(13,32,55,0.99),rgba(7,22,41,0.99))] shadow-[0_32px_90px_rgba(0,0,0,0.42)]">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
          <div>
            <p className="rr-kicker text-[color:var(--rr-gold)]">
              {competition ? "Editar competicion" : "Nueva competicion"}
            </p>
            <h2 className="rr-display mt-2 text-[2.2rem] leading-none text-white">
              {competition?.name ?? "Crear competicion"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[color:var(--rr-muted)]"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Temporada</span>
              <select
                value={season}
                onChange={(event) => setSeason(event.target.value)}
                disabled={Boolean(competition) || isSaving}
                className={fieldClassName}
              >
                {seasons.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Nombre</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isSaving}
                className={fieldClassName}
                placeholder="Liga Clausura Barcelona"
                autoFocus
              />
            </label>

            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Organizador</span>
              <input
                value={organizer}
                onChange={(event) => setOrganizer(event.target.value)}
                disabled={isSaving}
                className={fieldClassName}
                placeholder="Opcional"
              />
            </label>

            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Grupo</span>
              <input
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                disabled={isSaving}
                className={fieldClassName}
                placeholder="Opcional"
              />
            </label>
          </div>

          <label className="flex items-center justify-between gap-4 rounded-[16px] border border-white/10 bg-white/4 px-4 py-3.5">
            <span>
              <span className="block font-semibold text-white">Competicion activa</span>
              <span className="mt-1 block text-[0.84rem] text-[color:var(--rr-muted)]">
                Disponible para nuevas asignaciones y partidos.
              </span>
            </span>
            <input
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
              disabled={isSaving}
              className="h-5 w-5 accent-[color:var(--rr-gold)]"
            />
          </label>

          {error ? <p className="text-[0.84rem] text-[#ff8d8d]">{error}</p> : null}

          <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} disabled={isSaving} className="rr-button rr-button-secondary text-[0.8rem]">
              Cancelar
            </button>
            <button type="submit" disabled={isSaving} className="rr-button rr-button-primary text-[0.8rem]">
              <Trophy className="h-4 w-4" />
              {isSaving ? "Guardando..." : "Guardar competicion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

