"use client";

import { useState, type FormEvent } from "react";
import { Trophy, X } from "lucide-react";
import { z } from "zod";
import type { MatchManagementMatch } from "@/lib/admin/match-management-mocks";

type QuickResultDialogProps = {
  open: boolean;
  match?: MatchManagementMatch;
  onClose: () => void;
  onSave: (match: MatchManagementMatch) => void;
};

const quickResultSchema = z.object({
  ownScore: z.string().trim().regex(/^\d+$/, "Introduce un marcador valido."),
  opponentScore: z.string().trim().regex(/^\d+$/, "Introduce un marcador valido."),
  date: z.string(),
});

const fieldClassName =
  "min-h-14 rounded-[10px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-4 text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]";

export function QuickResultDialog({
  open,
  match,
  onClose,
  onSave,
}: QuickResultDialogProps) {
  const [ownScore, setOwnScore] = useState(match?.ownScore === null ? "" : String(match?.ownScore ?? ""));
  const [opponentScore, setOpponentScore] = useState(
    match?.opponentScore === null ? "" : String(match?.opponentScore ?? ""),
  );
  const [date, setDate] = useState(match?.date ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open || !match) {
    return null;
  }

  const currentMatch = match;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedValue = quickResultSchema.safeParse({
      ownScore,
      opponentScore,
      date,
    });

    if (!parsedValue.success) {
      const nextErrors: Record<string, string> = {};

      parsedValue.error.issues.forEach((issue) => {
        const key = issue.path[0];

        if (typeof key === "string" && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      });

      setErrors(nextErrors);
      return;
    }

    setErrors({});

    onSave({
      ...currentMatch,
      status: "played",
      ownScore: Number(parsedValue.data.ownScore),
      opponentScore: Number(parsedValue.data.opponentScore),
      date: parsedValue.data.date || currentMatch.date,
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[rgba(5,10,18,0.74)] px-4 py-4 backdrop-blur-sm sm:items-center sm:px-6 sm:py-10">
      <div className="w-full max-w-xl rounded-[12px] border border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(16,37,67,0.98),rgba(7,19,34,0.98))] shadow-[0_32px_90px_rgba(0,0,0,0.42)]">
        <div className="flex items-start justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] px-5 py-5 sm:px-6">
          <div className="space-y-2">
            <p className="rr-kicker text-[color:var(--rr-gold)]">Resultado rapido</p>
            <div>
              <h2 className="rr-display text-[2.2rem] leading-[0.92] text-white">
                {currentMatch.teamName} vs {currentMatch.opponentName}
              </h2>
              <p className="mt-2 text-[0.95rem] leading-6 text-[color:var(--rr-muted)]">
                Flujo rapido para entrenador y actualizacion agil desde movil.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[8px] border border-white/10 text-[color:var(--rr-muted)] transition hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5 text-[color:var(--rr-gold)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">{currentMatch.teamName}</span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={ownScore}
                onChange={(event) => setOwnScore(event.target.value)}
                className={`${fieldClassName} text-center text-[1.8rem] font-semibold`}
              />
              {errors.ownScore ? (
                <span className="text-[0.82rem] text-[#ff8d8d]">{errors.ownScore}</span>
              ) : null}
            </label>

            <div className="flex h-14 items-center justify-center rounded-[10px] border border-[rgba(253,203,88,0.22)] bg-[rgba(253,203,88,0.08)] px-4 text-[color:var(--rr-gold)]">
              <Trophy className="h-5 w-5" />
            </div>

            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">{currentMatch.opponentName}</span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={opponentScore}
                onChange={(event) => setOpponentScore(event.target.value)}
                className={`${fieldClassName} text-center text-[1.8rem] font-semibold`}
              />
              {errors.opponentScore ? (
                <span className="text-[0.82rem] text-[#ff8d8d]">{errors.opponentScore}</span>
              ) : null}
            </label>
          </div>

          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Fecha del partido</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={fieldClassName}
            />
          </label>

          <div className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-3 text-[0.92rem] leading-6 text-[color:var(--rr-muted)]">
            Guardar este resultado cambia el estado a jugado y deja listo el enlace hacia
            clasificaciones o estadisticas.
          </div>

          <div className="flex flex-col gap-3 border-t border-[rgba(255,255,255,0.08)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
              Ideal para uso movil durante el cierre de jornada.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onClose} className="rr-button rr-button-secondary text-[0.8rem]">
                Cancelar
              </button>
              <button type="submit" className="rr-button rr-button-primary text-[0.8rem]">
                Guardar resultado
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
