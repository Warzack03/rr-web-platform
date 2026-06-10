"use client";

import { Plus, Trash2 } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import type {
  TeamCoachRoleLabel,
  TeamManagementCoach,
  TeamResponsibleCoachUser,
} from "@/lib/admin/team-management-mocks";

type TeamCoachEditorProps = {
  coaches: TeamManagementCoach[];
  coachRoleOptions: TeamCoachRoleLabel[];
  availableCoachUsers: TeamResponsibleCoachUser[];
  responsibleCoachUserId?: string;
  onResponsibleCoachUserIdChange: (nextValue: string | undefined) => void;
  onChange: (nextValue: TeamManagementCoach[]) => void;
};

const fieldClassName =
  "min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]";

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
  availableCoachUsers,
  responsibleCoachUserId,
  onResponsibleCoachUserIdChange,
  onChange,
}: TeamCoachEditorProps) {
  function updateCoach(
    coachId: string,
    updates: Partial<TeamManagementCoach>,
  ) {
    onChange(
      coaches.map((coach) => (coach.id === coachId ? { ...coach, ...updates } : coach)),
    );
  }

  function removeCoach(coachId: string) {
    const nextCoaches = coaches.filter((coach) => coach.id !== coachId);
    onChange(nextCoaches);

    const responsibleCoachUserStillExists = nextCoaches.some(
      (coach) => coach.linkedUserId && coach.linkedUserId === responsibleCoachUserId,
    );

    if (!responsibleCoachUserStillExists) {
      onResponsibleCoachUserIdChange(undefined);
    }
  }

  return (
    <div className="space-y-4">
      <AdminPanel className="border-dashed p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
          <div className="space-y-2">
            <p className="rr-kicker text-[color:var(--rr-gold)]">Entrenadores visibles</p>
            <p className="text-[0.92rem] leading-5 text-[color:var(--rr-muted)]">
              Puedes mostrar varios perfiles publicos. Solo una cuenta necesita acceso al backoffice.
            </p>
          </div>

          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
              Usuario responsable
            </span>
            <select
              value={responsibleCoachUserId ?? ""}
              onChange={(event) =>
                onResponsibleCoachUserIdChange(event.target.value || undefined)
              }
              className={fieldClassName}
            >
              <option value="">Sin cuenta vinculada</option>
              {availableCoachUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.displayName} · {user.username}
                </option>
              ))}
            </select>
          </label>
        </div>
      </AdminPanel>

      <div className="space-y-3">
        {coaches.map((coach, index) => (
          <AdminPanel key={coach.id} className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Coach {index + 1}</p>
                <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
                  Nombre publico, rol visible y posible cuenta asociada.
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeCoach(coach.id)}
                className="inline-flex min-h-10 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.8rem] text-[color:var(--rr-muted)] transition hover:text-white"
              >
                <Trash2 className="h-4 w-4 text-[color:var(--rr-gold)]" />
                Quitar
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-2 md:col-span-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Nombre</span>
                <input
                  type="text"
                  value={coach.name}
                  onChange={(event) => updateCoach(coach.id, { name: event.target.value })}
                  className={fieldClassName}
                  placeholder="Nombre visible"
                />
              </label>

              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Rol visible</span>
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

              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                  Cuenta interna
                </span>
                <select
                  value={coach.linkedUserId ?? ""}
                  onChange={(event) => {
                    const selectedUser = availableCoachUsers.find(
                      (user) => user.id === event.target.value,
                    );

                    updateCoach(coach.id, {
                      linkedUserId: selectedUser?.id,
                      linkedUsername: selectedUser?.username,
                    });
                  }}
                  className={fieldClassName}
                >
                  <option value="">Sin cuenta</option>
                  {availableCoachUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.displayName} · {user.username}
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
          </AdminPanel>
        ))}
      </div>

      <button type="button" onClick={() => onChange([...coaches, createEmptyCoach()])} className="rr-button rr-button-secondary text-[0.8rem]">
        <Plus className="h-4 w-4" />
        Anadir entrenador
      </button>
    </div>
  );
}
