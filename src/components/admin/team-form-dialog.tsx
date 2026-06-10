"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { z } from "zod";
import { TeamCoachEditor } from "@/components/admin/team-coach-editor";
import {
  normalizeTeamManagementTeam,
  teamCoachRoleOptions,
  type TeamManagementCoach,
  type TeamManagementTeam,
  type TeamResponsibleCoachUser,
} from "@/lib/admin/team-management-mocks";

type TeamFormDialogMode = "create" | "edit" | "coaches";

type TeamFormDialogProps = {
  open: boolean;
  mode: TeamFormDialogMode;
  team?: TeamManagementTeam;
  seasons: string[];
  categories: string[];
  branches: string[];
  availableCoachUsers: TeamResponsibleCoachUser[];
  onClose: () => void;
  onSave: (team: TeamManagementTeam) => void;
};

type TeamFormState = {
  id: string;
  name: string;
  slug: string;
  category: string;
  competition: string;
  season: string;
  branch: string;
  publicVisible: boolean;
  active: boolean;
  isFirstTeam: boolean;
  displayOrder: number;
  coaches: TeamManagementCoach[];
  responsibleCoachUserId?: string;
  logoUrl: string;
  bannerUrl: string;
  playerCount: number;
  nextMatchLabel: string;
  accent: string;
};

const teamFormSchema = z.object({
  name: z.string().trim().min(1, "Introduce un nombre."),
  slug: z
    .string()
    .trim()
    .min(1, "El slug es obligatorio.")
    .regex(/^[a-z0-9-]+$/, "Usa minusculas, numeros y guiones."),
  category: z.string().trim().min(1, "Selecciona una categoria."),
  competition: z.string().trim().min(1, "Introduce una competicion."),
  season: z.string().trim().min(1, "Selecciona una temporada."),
  branch: z.string().trim().min(1, "Selecciona una rama."),
  displayOrder: z.number().int().min(0, "El orden no puede ser negativo."),
  coaches: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().trim().min(1, "Cada entrenador necesita nombre."),
        roleLabel: z.enum(teamCoachRoleOptions),
        publicVisible: z.boolean(),
        linkedUserId: z.string().optional(),
        linkedUsername: z.string().optional(),
      }),
    )
    .min(1, "Anade al menos un entrenador visible o interno."),
});

const fieldClassName =
  "min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createDefaultTeam(
  seasons: string[],
  categories: string[],
  branches: string[],
): TeamFormState {
  return {
    id: `team-${Date.now()}`,
    name: "",
    slug: "",
    category: categories[0] ?? "Senior",
    competition: "",
    season: seasons[0] ?? "",
    branch: branches[0] ?? "Senior",
    publicVisible: true,
    active: true,
    isFirstTeam: false,
    displayOrder: 99,
    coaches: [
      {
        id: `coach-${Date.now()}`,
        name: "",
        roleLabel: "Entrenador principal",
        publicVisible: true,
      },
    ],
    responsibleCoachUserId: undefined,
    logoUrl: "mock://team-logo/nuevo-equipo",
    bannerUrl: "mock://team-banner/nuevo-equipo",
    playerCount: 0,
    nextMatchLabel: "Pendiente de calendario",
    accent: "from-[rgba(253,203,88,0.14)] to-[rgba(255,255,255,0.02)]",
  };
}

function toFormState(team: TeamManagementTeam): TeamFormState {
  return {
    id: team.id,
    name: team.name,
    slug: team.slug,
    category: team.category,
    competition: team.competition,
    season: team.season,
    branch: team.branch,
    publicVisible: team.publicVisible,
    active: team.active,
    isFirstTeam: team.isFirstTeam,
    displayOrder: team.displayOrder,
    coaches: team.coaches,
    responsibleCoachUserId: team.responsibleCoachUserId,
    logoUrl: team.logoUrl,
    bannerUrl: team.bannerUrl,
    playerCount: team.playerCount,
    nextMatchLabel: team.nextMatchLabel,
    accent: team.accent,
  };
}

export function TeamFormDialog({
  open,
  mode,
  team,
  seasons,
  categories,
  branches,
  availableCoachUsers,
  onClose,
  onSave,
}: TeamFormDialogProps) {
  const [formState, setFormState] = useState<TeamFormState>(() =>
    team ? toFormState(team) : createDefaultTeam(seasons, categories, branches),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(Boolean(team?.slug));

  if (!open) {
    return null;
  }

  function updateFormState<Key extends keyof TeamFormState>(
    key: Key,
    value: TeamFormState[Key],
  ) {
    setFormState((currentValue) => {
      if (key === "name" && !slugTouched) {
        return {
          ...currentValue,
          name: value as string,
          slug: slugify(value as string),
        };
      }

      return {
        ...currentValue,
        [key]: value,
      };
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedValue = teamFormSchema.safeParse({
      ...formState,
      name: formState.name.trim(),
      slug: formState.slug.trim(),
      category: formState.category.trim(),
      competition: formState.competition.trim(),
      season: formState.season.trim(),
      branch: formState.branch.trim(),
      coaches: formState.coaches.map((coach) => ({
        ...coach,
        name: coach.name.trim(),
      })),
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

    onSave(
      normalizeTeamManagementTeam({
        ...formState,
        name: parsedValue.data.name,
        slug: parsedValue.data.slug,
        category: parsedValue.data.category,
        competition: parsedValue.data.competition,
        season: parsedValue.data.season,
        branch: parsedValue.data.branch,
        coaches: parsedValue.data.coaches,
        primaryCoach: "",
        visibleCoaches: [],
      }),
    );
  }

  const coachUserOptions = availableCoachUsers.map((user) => ({
    id: user.id,
    displayName: user.displayName,
    username: user.username,
    roleLabel: user.roleLabel,
  }));

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[rgba(5,10,18,0.78)] px-4 py-6 backdrop-blur-sm sm:px-6 sm:py-10">
      <div className="w-full max-w-5xl rounded-[12px] border border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(16,37,67,0.98),rgba(7,19,34,0.98))] shadow-[0_32px_90px_rgba(0,0,0,0.42)]">
        <div className="flex items-start justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] px-5 py-5 sm:px-6">
          <div className="space-y-2">
            <p className="rr-kicker text-[color:var(--rr-gold)]">
              {mode === "create" ? "Nuevo equipo" : mode === "coaches" ? "Entrenadores" : "Editar equipo"}
            </p>
            <div>
              <h2 className="rr-display text-[2.4rem] leading-[0.92] text-white">
                {mode === "create"
                  ? "Crear equipo"
                  : mode === "coaches"
                    ? `Coaches de ${team?.name ?? "equipo"}`
                    : team?.name ?? "Editar equipo"}
              </h2>
              <p className="mt-2 max-w-2xl text-[0.95rem] leading-6 text-[color:var(--rr-muted)]">
                {mode === "coaches"
                  ? "Gestiona perfiles visibles y vincula una cuenta interna existente cuando haga falta."
                  : "Formulario mock listo para validar la UX del backoffice sin tocar persistencia real."}
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
          {mode !== "coaches" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-2 md:col-span-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Nombre</span>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(event) => updateFormState("name", event.target.value)}
                  className={fieldClassName}
                  placeholder="Juvenil A"
                />
                {errors.name ? <span className="text-[0.82rem] text-[#ff8d8d]">{errors.name}</span> : null}
              </label>

              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Slug</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formState.slug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      updateFormState("slug", slugify(event.target.value));
                    }}
                    className={`${fieldClassName} flex-1`}
                    placeholder="juvenil-a"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSlugTouched(true);
                      updateFormState("slug", slugify(formState.name));
                    }}
                    className="inline-flex min-h-11 items-center rounded-[8px] border border-white/10 px-3 text-[0.8rem] text-[color:var(--rr-muted)] transition hover:text-white"
                  >
                    Auto
                  </button>
                </div>
                {errors.slug ? <span className="text-[0.82rem] text-[#ff8d8d]">{errors.slug}</span> : null}
              </label>

              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Categoria</span>
                <select
                  value={formState.category}
                  onChange={(event) => updateFormState("category", event.target.value)}
                  className={fieldClassName}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 md:col-span-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Competicion</span>
                <input
                  type="text"
                  value={formState.competition}
                  onChange={(event) => updateFormState("competition", event.target.value)}
                  className={fieldClassName}
                  placeholder="Liga Juvenil Preferente"
                />
                {errors.competition ? (
                  <span className="text-[0.82rem] text-[#ff8d8d]">{errors.competition}</span>
                ) : null}
              </label>

              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Temporada</span>
                <select
                  value={formState.season}
                  onChange={(event) => updateFormState("season", event.target.value)}
                  className={fieldClassName}
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Rama</span>
                <select
                  value={formState.branch}
                  onChange={(event) => updateFormState("branch", event.target.value)}
                  className={fieldClassName}
                >
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Orden</span>
                <input
                  type="number"
                  min={0}
                  value={formState.displayOrder}
                  onChange={(event) =>
                    updateFormState("displayOrder", Number(event.target.value || 0))
                  }
                  className={fieldClassName}
                />
              </label>

              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Logo</span>
                <select
                  value={formState.logoUrl}
                  onChange={(event) => updateFormState("logoUrl", event.target.value)}
                  className={fieldClassName}
                >
                  <option value="mock://team-logo/nuevo-equipo">Placeholder</option>
                  <option value="mock://team-logo/escudo-principal">Escudo principal</option>
                  <option value="mock://team-logo/escudo-academia">Escudo academia</option>
                </select>
              </label>

              <label className="grid gap-2 md:col-span-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Banner</span>
                <select
                  value={formState.bannerUrl}
                  onChange={(event) => updateFormState("bannerUrl", event.target.value)}
                  className={fieldClassName}
                >
                  <option value="mock://team-banner/nuevo-equipo">Placeholder</option>
                  <option value="mock://team-banner/campo-nocturno">Campo nocturno</option>
                  <option value="mock://team-banner/gradiente-club">Gradiente club</option>
                </select>
              </label>
            </div>
          ) : null}

          {mode !== "coaches" ? (
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/4 px-4 py-3 text-[0.92rem] text-[color:var(--rr-muted)]">
                <input
                  type="checkbox"
                  checked={formState.publicVisible}
                  onChange={(event) => updateFormState("publicVisible", event.target.checked)}
                  className="h-4 w-4 rounded border border-[color:var(--rr-border)] bg-transparent accent-[color:var(--rr-gold)]"
                />
                Visible en la web
              </label>

              <label className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/4 px-4 py-3 text-[0.92rem] text-[color:var(--rr-muted)]">
                <input
                  type="checkbox"
                  checked={formState.active}
                  onChange={(event) => updateFormState("active", event.target.checked)}
                  className="h-4 w-4 rounded border border-[color:var(--rr-border)] bg-transparent accent-[color:var(--rr-gold)]"
                />
                Equipo activo
              </label>

              <label className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/4 px-4 py-3 text-[0.92rem] text-[color:var(--rr-muted)]">
                <input
                  type="checkbox"
                  checked={formState.isFirstTeam}
                  onChange={(event) => updateFormState("isFirstTeam", event.target.checked)}
                  className="h-4 w-4 rounded border border-[color:var(--rr-border)] bg-transparent accent-[color:var(--rr-gold)]"
                />
                Marcar como Primer Equipo
              </label>
            </div>
          ) : null}

          <TeamCoachEditor
            coaches={formState.coaches}
            coachRoleOptions={teamCoachRoleOptions}
            availableCoachUsers={coachUserOptions}
            responsibleCoachUserId={formState.responsibleCoachUserId}
            onResponsibleCoachUserIdChange={(nextValue) =>
              updateFormState("responsibleCoachUserId", nextValue)
            }
            onChange={(nextCoaches) => updateFormState("coaches", nextCoaches)}
          />
          {errors.coaches ? <span className="text-[0.82rem] text-[#ff8d8d]">{errors.coaches}</span> : null}

          <div className="flex flex-col gap-3 border-t border-[rgba(255,255,255,0.08)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
              Los cambios se guardan en estado local mock para validar la operativa del backoffice.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onClose} className="rr-button rr-button-secondary text-[0.8rem]">
                Cancelar
              </button>
              <button type="submit" className="rr-button rr-button-primary text-[0.8rem]">
                {mode === "create"
                  ? "Crear equipo"
                  : mode === "coaches"
                    ? "Guardar entrenadores"
                    : "Guardar cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
