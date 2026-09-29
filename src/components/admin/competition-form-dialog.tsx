"use client";

import { useState, type FormEvent } from "react";
import { Trophy, X } from "lucide-react";

type CompetitionFormDialogProps = {
  open: boolean;
  seasons: string[];
  isSaving?: boolean;
  onClose: () => void;
  onSave: (input: { season: string; name: string }) => void;
};

const fieldClassName =
  "min-h-11 rounded-[14px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.04)] px-3 text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]";

export function CompetitionFormDialog({
  open,
  seasons,
  isSaving = false,
  onClose,
  onSave,
}: CompetitionFormDialogProps) {
  const [season, setSeason] = useState(seasons[0] ?? "");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedName = name.trim();

    if (!season || normalizedName.length < 2) {
      setError("Selecciona temporada e introduce el nombre de la competicion.");
      return;
    }

    setError("");
    onSave({ season, name: normalizedName });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(5,10,18,0.78)] px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[22px] border border-[color:var(--rr-border)] bg-[linear-gradient(160deg,rgba(13,32,55,0.98),rgba(7,22,41,0.98))] shadow-[0_32px_90px_rgba(0,0,0,0.42)]">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
          <div>
            <p className="rr-kicker text-[color:var(--rr-gold)]">Nueva competicion</p>
            <h2 className="rr-display mt-2 text-[2.2rem] leading-none text-white">
              Crear competicion
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
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                Temporada
              </span>
              <select
                value={season}
                onChange={(event) => setSeason(event.target.value)}
                disabled={isSaving}
                className={fieldClassName}
              >
                {seasons.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                Nombre
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isSaving}
                className={fieldClassName}
                placeholder="Liga Clausura Barcelona"
                autoFocus
              />
            </label>
          </div>

          {error ? <p className="text-[0.84rem] text-[#ff8d8d]">{error}</p> : null}

          <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rr-button rr-button-secondary text-[0.8rem]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rr-button rr-button-primary text-[0.8rem]"
            >
              <Trophy className="h-4 w-4" />
              {isSaving ? "Creando..." : "Crear competicion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
