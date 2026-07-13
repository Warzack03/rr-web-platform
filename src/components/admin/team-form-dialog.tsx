"use client";

import { useState, type FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { z } from "zod";
import { MediaPickerDialog } from "@/components/admin/media-picker-dialog";
import { AdminPanel } from "@/components/admin/admin-panel";
import { TeamCoachEditor } from "@/components/admin/team-coach-editor";
import type { AdminMediaPickerItem } from "@/lib/admin/media-management";
import {
  normalizeTeamManagementTeam,
  teamCoachRoleOptions,
  type TeamManagementCoach,
  type TeamManagementTeam,
} from "@/lib/admin/team-management-mocks";

type TeamFormDialogMode = "create" | "edit" | "coaches";

type TeamFormDialogProps = {
  open: boolean;
  mode: TeamFormDialogMode;
  team?: TeamManagementTeam;
  existingTeams: TeamManagementTeam[];
  isSaving?: boolean;
  seasons: string[];
  categories: string[];
  competitionOptions: string[];
  mediaOptions: AdminMediaPickerItem[];
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
  logoMediaId?: string;
  logoUrl: string;
  bannerMediaId?: string;
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
  competition: z.string().trim().min(1, "Selecciona una competicion."),
  season: z.string().trim().min(1, "Selecciona una temporada."),
  branch: z.string().trim().min(1, "Define el bloque del equipo."),
  displayOrder: z.number().int().min(0, "El orden no puede ser negativo."),
  coaches: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().trim().min(1, "Cada entrenador necesita nombre."),
        roleLabel: z.enum(teamCoachRoleOptions),
        publicVisible: z.boolean(),
      }),
    )
    .min(1, "Anade al menos un entrenador."),
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
  existingTeams: TeamManagementTeam[],
  seasons: string[],
  categories: string[],
): TeamFormState {
  return {
    id: `team-${Date.now()}`,
    name: "",
    slug: "",
    category: categories[0] ?? "Senior",
    competition: "",
    season: seasons[0] ?? "",
    branch: "Cantera",
    publicVisible: true,
    active: true,
    isFirstTeam: false,
    displayOrder: getSuggestedDisplayOrder(existingTeams, {
      category: categories[0] ?? "Senior",
      isFirstTeam: false,
    }),
    coaches: [
      {
        id: `coach-${Date.now()}`,
        name: "",
        roleLabel: "Entrenador principal",
        publicVisible: true,
      },
    ],
    logoMediaId: undefined,
    logoUrl: "",
    bannerMediaId: undefined,
    bannerUrl: "",
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
    branch: team.isFirstTeam ? "Primer equipo" : "Cantera",
    publicVisible: team.publicVisible,
    active: team.active,
    isFirstTeam: team.isFirstTeam,
    displayOrder: team.displayOrder,
    coaches: team.coaches,
    logoMediaId: team.logoMediaId,
    logoUrl: team.logoUrl,
    bannerMediaId: team.bannerMediaId,
    bannerUrl: team.bannerUrl,
    playerCount: team.playerCount,
    nextMatchLabel: team.nextMatchLabel,
    accent: team.accent,
  };
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="rr-kicker text-[color:var(--rr-gold)]">{eyebrow}</p>
      <h3 className="text-[1.05rem] font-semibold text-white">{title}</h3>
      {description ? (
        <p className="text-[0.9rem] leading-6 text-[color:var(--rr-muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function getCategoryFamily(category: string) {
  return category.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
}

function getSuggestedDisplayOrder(
  teams: TeamManagementTeam[],
  {
    teamId,
    category,
    isFirstTeam,
  }: {
    teamId?: string;
    category: string;
    isFirstTeam: boolean;
  },
) {
  const comparableTeams = teams.filter((currentTeam) => currentTeam.id !== teamId);

  if (isFirstTeam) {
    return 1;
  }

  const categoryFamily = getCategoryFamily(category);
  const sameFamilyTeams = comparableTeams.filter(
    (currentTeam) =>
      !currentTeam.isFirstTeam &&
      getCategoryFamily(currentTeam.category) === categoryFamily,
  );

  if (sameFamilyTeams.length > 0) {
    return (
      Math.max(...sameFamilyTeams.map((currentTeam) => currentTeam.displayOrder)) + 1
    );
  }

  return Math.max(1, ...comparableTeams.map((currentTeam) => currentTeam.displayOrder)) + 1;
}

export function TeamFormDialog({
  open,
  mode,
  team,
  existingTeams,
  isSaving = false,
  seasons,
  categories,
  competitionOptions,
  mediaOptions,
  onClose,
  onSave,
}: TeamFormDialogProps) {
  const [formState, setFormState] = useState<TeamFormState>(() =>
    team ? toFormState(team) : createDefaultTeam(existingTeams, seasons, categories),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(Boolean(team?.slug));
  const [orderTouched, setOrderTouched] = useState(Boolean(team));
  const [mediaPickerField, setMediaPickerField] = useState<"logo" | "banner" | null>(null);

  if (!open) {
    return null;
  }

  function updateFormState<Key extends keyof TeamFormState>(
    key: Key,
    value: TeamFormState[Key],
  ) {
    setFormState((currentValue) => {
      if (key === "isFirstTeam") {
        const isFirstTeam = value as boolean;
        const nextState: TeamFormState = {
          ...currentValue,
          isFirstTeam,
          branch: isFirstTeam ? "Primer equipo" : "Cantera",
          slug: isFirstTeam ? "primer-equipo" : currentValue.slug,
        };

        if (!orderTouched || isFirstTeam) {
          nextState.displayOrder = getSuggestedDisplayOrder(existingTeams, {
            teamId: currentValue.id,
            category: currentValue.category,
            isFirstTeam,
          });
        }

        return nextState;
      }

      if (key === "category") {
        const nextState: TeamFormState = {
          ...currentValue,
          category: value as string,
        };

        if (!orderTouched) {
          nextState.displayOrder = getSuggestedDisplayOrder(existingTeams, {
            teamId: currentValue.id,
            category: value as string,
            isFirstTeam: currentValue.isFirstTeam,
          });
        }

        return nextState;
      }

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
        slug: formState.isFirstTeam ? "primer-equipo" : parsedValue.data.slug,
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

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[rgba(5,10,18,0.78)] px-4 py-6 backdrop-blur-sm sm:px-6 sm:py-10">
      <div className="w-full max-w-5xl rounded-[12px] border border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(16,37,67,0.98),rgba(7,19,34,0.98))] shadow-[0_32px_90px_rgba(0,0,0,0.42)]">
        <div className="flex items-start justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] px-5 py-5 sm:px-6">
          <div className="space-y-2">
            <p className="rr-kicker text-[color:var(--rr-gold)]">
              {mode === "create"
                ? "Nuevo equipo"
                : mode === "coaches"
                  ? "Entrenadores"
                  : "Editar equipo"}
            </p>
            <div>
              <h2 className="rr-display text-[2.4rem] leading-[0.92] text-white">
                {mode === "create"
                  ? "Crear equipo"
                  : mode === "coaches"
                    ? `Entrenadores de ${team?.name ?? "equipo"}`
                    : team?.name ?? "Editar equipo"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[8px] border border-white/10 text-[color:var(--rr-muted)] transition hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5 text-[color:var(--rr-gold)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
          {mode !== "coaches" ? (
            <AdminPanel className="p-4 sm:p-5">
              <div className="space-y-4">
                <SectionHeader
                  eyebrow="Identidad"
                  title="Nombre, slug y recursos visuales"
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <label className="grid gap-2 md:col-span-2">
                    <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                      Nombre
                    </span>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(event) =>
                        updateFormState("name", event.target.value)
                      }
                      className={fieldClassName}
                      placeholder="Juvenil A"
                    />
                    {errors.name ? (
                      <span className="text-[0.82rem] text-[#ff8d8d]">
                        {errors.name}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                      Slug
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formState.slug}
                        onChange={(event) => {
                          setSlugTouched(true);
                          updateFormState("slug", slugify(event.target.value));
                        }}
                        disabled={formState.isFirstTeam}
                        className={`${fieldClassName} flex-1`}
                        placeholder={formState.isFirstTeam ? "primer-equipo" : "juvenil-a"}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSlugTouched(true);
                          updateFormState(
                            "slug",
                            formState.isFirstTeam ? "primer-equipo" : slugify(formState.name),
                          );
                        }}
                        disabled={formState.isFirstTeam}
                        className="inline-flex min-h-11 items-center rounded-[8px] border border-white/10 px-3 text-[0.8rem] text-[color:var(--rr-muted)] transition hover:text-white"
                      >
                        Auto
                      </button>
                    </div>
                    {errors.slug ? (
                      <span className="text-[0.82rem] text-[#ff8d8d]">
                        {errors.slug}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                      Orden
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={formState.displayOrder}
                      onChange={(event) => {
                        setOrderTouched(true);
                        updateFormState(
                          "displayOrder",
                          Number(event.target.value || 0),
                        );
                      }}
                      className={fieldClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                      Logo
                    </span>
                    <div className="grid gap-3 rounded-[10px] border border-white/10 bg-white/4 p-3">
                      <div className="overflow-hidden rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)]">
                        {formState.logoUrl ? (
                          <img
                            src={formState.logoUrl}
                            alt={formState.name || "Logo del equipo"}
                            className="h-24 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-24 items-center justify-center text-[color:var(--rr-muted)]">
                            <ImagePlus className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => setMediaPickerField("logo")}
                          className="rr-button rr-button-secondary text-[0.78rem]"
                        >
                          Elegir logo
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormState((currentValue) => ({
                              ...currentValue,
                              logoMediaId: undefined,
                              logoUrl: "",
                            }))
                          }
                          disabled={!formState.logoUrl}
                          className="rr-button rr-button-secondary text-[0.78rem] disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </label>

                  <label className="grid gap-2 md:col-span-2 xl:col-span-3">
                    <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                      Banner
                    </span>
                    <div className="grid gap-3 rounded-[10px] border border-white/10 bg-white/4 p-3">
                      <div className="overflow-hidden rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)]">
                        {formState.bannerUrl ? (
                          <img
                            src={formState.bannerUrl}
                            alt={formState.name || "Banner del equipo"}
                            className="h-32 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-32 items-center justify-center text-[color:var(--rr-muted)]">
                            <ImagePlus className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => setMediaPickerField("banner")}
                          className="rr-button rr-button-secondary text-[0.78rem]"
                        >
                          Elegir banner
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormState((currentValue) => ({
                              ...currentValue,
                              bannerMediaId: undefined,
                              bannerUrl: "",
                            }))
                          }
                          disabled={!formState.bannerUrl}
                          className="rr-button rr-button-secondary text-[0.78rem] disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </AdminPanel>
          ) : null}

          {mode !== "coaches" ? (
            <AdminPanel className="p-4 sm:p-5">
              <div className="space-y-4">
                <SectionHeader
                  eyebrow="Contexto deportivo"
                  title="Competicion y estructura"
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[11rem_minmax(0,1fr)_11rem]">
                  <label className="grid gap-2">
                    <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                      Categoria
                    </span>
                    <select
                      value={formState.category}
                      onChange={(event) =>
                        updateFormState("category", event.target.value)
                      }
                      className={fieldClassName}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 md:col-span-2 xl:col-span-1">
                    <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                      Competicion
                    </span>
                    <select
                      value={formState.competition}
                      onChange={(event) =>
                        updateFormState("competition", event.target.value)
                      }
                      className={fieldClassName}
                    >
                      <option value="">Selecciona competicion</option>
                      {competitionOptions.map((competition) => (
                        <option key={competition} value={competition}>
                          {competition}
                        </option>
                      ))}
                    </select>
                    {errors.competition ? (
                      <span className="text-[0.82rem] text-[#ff8d8d]">
                        {errors.competition}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                      Temporada
                    </span>
                    <select
                      value={formState.season}
                      onChange={(event) =>
                        updateFormState("season", event.target.value)
                      }
                      disabled={mode !== "create" || isSaving}
                      className={fieldClassName}
                    >
                      {seasons.map((season) => (
                        <option key={season} value={season}>
                          {season}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </AdminPanel>
          ) : null}

          {mode !== "coaches" ? (
            <AdminPanel className="p-4 sm:p-5">
              <div className="space-y-4">
                <SectionHeader
                  eyebrow="Estado publico"
                  title="Visibilidad y comportamiento"
                />

                <div className="grid gap-3 md:grid-cols-3">
                  <label className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/4 px-4 py-3 text-[0.92rem] text-[color:var(--rr-muted)]">
                    <input
                      type="checkbox"
                      checked={formState.publicVisible}
                      onChange={(event) =>
                        updateFormState("publicVisible", event.target.checked)
                      }
                      className="h-4 w-4 rounded border border-[color:var(--rr-border)] bg-transparent accent-[color:var(--rr-gold)]"
                    />
                    Visible en la web
                  </label>

                  <label className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/4 px-4 py-3 text-[0.92rem] text-[color:var(--rr-muted)]">
                    <input
                      type="checkbox"
                      checked={formState.active}
                      onChange={(event) =>
                        updateFormState("active", event.target.checked)
                      }
                      className="h-4 w-4 rounded border border-[color:var(--rr-border)] bg-transparent accent-[color:var(--rr-gold)]"
                    />
                    Equipo activo
                  </label>

                  <label className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/4 px-4 py-3 text-[0.92rem] text-[color:var(--rr-muted)]">
                    <input
                      type="checkbox"
                      checked={formState.isFirstTeam}
                      onChange={(event) =>
                        updateFormState("isFirstTeam", event.target.checked)
                      }
                      className="h-4 w-4 rounded border border-[color:var(--rr-border)] bg-transparent accent-[color:var(--rr-gold)]"
                    />
                    Marcar como Primer Equipo
                  </label>
                </div>
              </div>
            </AdminPanel>
          ) : null}

          <AdminPanel className="p-4 sm:p-5">
            <div className="space-y-4">
              <SectionHeader
                eyebrow="Entrenadores"
                title="Cuerpo tecnico visible"
              />

              <TeamCoachEditor
                coaches={formState.coaches}
                coachRoleOptions={teamCoachRoleOptions}
                onChange={(nextCoaches) => updateFormState("coaches", nextCoaches)}
              />
              {errors.coaches ? (
                <span className="text-[0.82rem] text-[#ff8d8d]">
                  {errors.coaches}
                </span>
              ) : null}
            </div>
          </AdminPanel>

          <div className="flex flex-col gap-3 border-t border-[rgba(255,255,255,0.08)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
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
                {mode === "create"
                  ? isSaving
                    ? "Creando..."
                    : "Crear equipo"
                  : mode === "coaches"
                    ? isSaving
                      ? "Guardando..."
                      : "Guardar entrenadores"
                    : isSaving
                      ? "Guardando..."
                      : "Guardar cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <MediaPickerDialog
        open={mediaPickerField !== null}
        title={mediaPickerField === "banner" ? "Elegir banner de equipo" : "Elegir logo de equipo"}
        description="Selecciona un recurso ya subido en la biblioteca real de media."
        items={mediaOptions}
        allowedUsages={mediaPickerField === "banner" ? ["TEAM_BANNER"] : ["TEAM_LOGO"]}
        selectedMediaId={
          mediaPickerField === "banner" ? formState.bannerMediaId : formState.logoMediaId
        }
        onClose={() => setMediaPickerField(null)}
        onSelect={(item) => {
          setFormState((currentValue) => ({
            ...currentValue,
            ...(mediaPickerField === "banner"
              ? {
                  bannerMediaId: item.id,
                  bannerUrl: item.publicUrl,
                }
              : {
                  logoMediaId: item.id,
                  logoUrl: item.publicUrl,
                }),
          }));
          setMediaPickerField(null);
        }}
      />
    </div>
  );
}
