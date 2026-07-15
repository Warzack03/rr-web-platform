"use client";

import { Plus, Trash2 } from "lucide-react";
import type {
  TeamCoachRoleLabel,
  TeamManagementCoach,
} from "@/lib/admin/team-management-mocks";

type TeamCoachEditorProps = {
  coaches: TeamManagementCoach[];
  coachRoleOptions: TeamCoachRoleLabel[];
  onChange: (nextValue: TeamManagementCoach[]) => void;
};

const fieldClassName =
  "min-h-11 rounded-[14px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.04)] px-3 text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]";

function createEmptyCoach(): TeamManagementCoach {
  return {
    id: `coach-${Math.random().toString(36).slice(2, 10)}`,
    name: "",
    roleLabel: "Ayudante",
    publicVisible: true,
  };
}

export function TeamCoachEditor({
  coaches,
  coachRoleOptions,
  onChange,
}: TeamCoachEditorProps) {
  function updateCoach(
    coachId: string,
    updates: Partial<TeamManagementCoach>,
  ) {
    onChange(
      coaches.map((coach) =>
        coach.id === coachId ? { ...coach, ...updates } : coach,
      ),
    );
  }

  function removeCoach(coachId: string) {
    onChange(coaches.filter((coach) => coach.id !== coachId));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {coaches.map((coach, index) => (
          <div
            key={coach.id}
            className="rounded-[18px] border border-[color:var(--rr-border)] bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-4 sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="rr-kicker text-[color:var(--rr-gold)]">
                Entrenador {index + 1}
              </p>

              <button
                type="button"
                onClick={() => removeCoach(coach.id)}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 px-3 text-[0.8rem] text-[color:var(--rr-muted)] transition hover:border-[rgba(243,203,69,0.24)] hover:text-white"
              >
                <Trash2 className="h-4 w-4 text-[color:var(--rr-gold)]" />
                Quitar
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="grid gap-2 md:col-span-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                  Nombre
                </span>
                <input
                  type="text"
                  value={coach.name}
                  onChange={(event) =>
                    updateCoach(coach.id, { name: event.target.value })
                  }
                  className={fieldClassName}
                  placeholder="Nombre visible"
                />
              </label>

              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                  Rol visible
                </span>
                <select
                  value={coach.roleLabel}
                  onChange={(event) =>
                    updateCoach(coach.id, {
                      roleLabel: event.target.value as TeamCoachRoleLabel,
                    })
                  }
                  className={fieldClassName}
                >
                  {coachRoleOptions.map((roleLabel) => (
                    <option key={roleLabel} value={roleLabel}>
                      {roleLabel}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 flex items-center gap-3 text-[0.92rem] text-[color:var(--rr-muted)]">
              <input
                type="checkbox"
                checked={coach.publicVisible}
                onChange={(event) =>
                  updateCoach(coach.id, { publicVisible: event.target.checked })
                }
                className="h-4 w-4 rounded border border-[color:var(--rr-border)] bg-transparent accent-[color:var(--rr-gold)]"
              />
              Mostrar en la web publica
            </label>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...coaches, createEmptyCoach()])}
        className="rr-button rr-button-secondary text-[0.8rem]"
      >
        <Plus className="h-4 w-4" />
        Anadir entrenador
      </button>
    </div>
  );
}
