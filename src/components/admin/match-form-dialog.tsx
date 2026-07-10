"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { z } from "zod";
import { MatchStatusSelector } from "@/components/admin/match-status-selector";
import {
  getCoachMatchVisualStatus,
  getNextMatchdaySuggestion,
  getStoredMatchStatus,
  getVisualMatchStatus,
  type MatchManagementMatch,
  type MatchManagementOpponent,
  type MatchManagementTeam,
  type MatchManagementVenue,
  type MatchVisualStatus,
} from "@/lib/admin/match-management-mocks";
import type { AdminRole } from "@/lib/admin/roles";

type MatchFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  role: AdminRole;
  match?: MatchManagementMatch;
  availableTeams: MatchManagementTeam[];
  existingMatches: MatchManagementMatch[];
  seasons: string[];
  opponentOptions: MatchManagementOpponent[];
  venueOptions: MatchManagementVenue[];
  isSaving?: boolean;
  onClose: () => void;
  onSave: (match: MatchManagementMatch) => void;
};

type MatchFormState = {
  teamSlug: string;
  season: string;
  competition: string;
  matchday: string;
  opponentName: string;
  isHome: boolean;
  date: string;
  time: string;
  venue: string;
  status: MatchVisualStatus;
  ownScore: string;
  opponentScore: string;
  highlightsUrl: string;
};

const matchFormSchema = z.object({
  teamSlug: z.string().min(1, "Selecciona un equipo."),
  season: z.string().trim().min(1, "Selecciona una temporada."),
  competition: z.string().trim().min(1, "Introduce una competicion."),
  matchday: z.string().trim().min(1, "Introduce la jornada."),
  opponentName: z.string().trim().min(1, "El rival es obligatorio."),
  isHome: z.boolean(),
  date: z.string(),
  time: z.string(),
  venue: z.string().trim().min(1, "Introduce un campo."),
  status: z.enum(["pending", "live", "played"]),
  ownScore: z.string(),
  opponentScore: z.string(),
  highlightsUrl: z.string().trim(),
});

const fieldClassName =
  "min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]";

function createDefaultState(
  availableTeams: MatchManagementTeam[],
  existingMatches: MatchManagementMatch[],
  venueOptions: MatchManagementVenue[],
): MatchFormState {
  const defaultTeam = availableTeams[0];

  return {
    teamSlug: defaultTeam?.slug ?? "",
    season: defaultTeam?.season ?? "",
    competition: defaultTeam?.competition ?? "",
    matchday: defaultTeam
      ? getNextMatchdaySuggestion(existingMatches, defaultTeam.slug)
      : "Jornada 1",
    opponentName: "",
    isHome: true,
    date: "",
    time: "",
    venue: venueOptions[0]?.name ?? "",
    status: "pending",
    ownScore: "",
    opponentScore: "",
    highlightsUrl: "",
  };
}

function createStateFromMatch(
  match: MatchManagementMatch,
  role: AdminRole,
): MatchFormState {
  return {
    teamSlug: match.teamSlug,
    season: match.season,
    competition: match.competition,
    matchday: match.matchday,
    opponentName: match.opponentName,
    isHome: match.isHome,
    date: match.date,
    time: match.time,
    venue: match.venue,
    status:
      role === "COACH"
        ? getCoachMatchVisualStatus(match)
        : getVisualMatchStatus(match.status),
    ownScore: match.ownScore === null ? "" : String(match.ownScore),
    opponentScore: match.opponentScore === null ? "" : String(match.opponentScore),
    highlightsUrl: match.highlightsUrl ?? "",
  };
}

function parseScore(value: string) {
  if (!value.trim()) {
    return null;
  }

  if (!/^\d+$/.test(value.trim())) {
    return Number.NaN;
  }

  return Number(value.trim());
}

export function MatchFormDialog({
  open,
  mode,
  role,
  match,
  availableTeams,
  existingMatches,
  seasons,
  opponentOptions,
  venueOptions,
  isSaving = false,
  onClose,
  onSave,
}: MatchFormDialogProps) {
  const [formState, setFormState] = useState<MatchFormState>(() =>
    match
      ? createStateFromMatch(match, role)
      : createDefaultState(availableTeams, existingMatches, venueOptions),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) {
    return null;
  }

  const selectedTeam =
    availableTeams.find((team) => team.slug === formState.teamSlug) ?? availableTeams[0];
  const canManageHighlights = role !== "COACH" && selectedTeam?.isFirstTeam;
  const allowLiveStatus = role !== "COACH" && Boolean(selectedTeam?.isFirstTeam);
  const lockTeam = role === "COACH" || availableTeams.length <= 1;
  const isCoach = role === "COACH";
  const filteredOpponentOptions = opponentOptions.filter(
    (opponent) => opponent.competition === selectedTeam?.competition,
  );
  const resolvedOpponentOptions =
    filteredOpponentOptions.length > 0 ? filteredOpponentOptions : opponentOptions;
  const opponentSelectionOptions =
    formState.opponentName &&
    !resolvedOpponentOptions.some((opponent) => opponent.name === formState.opponentName)
      ? [
          ...resolvedOpponentOptions,
          {
            id: `current-${formState.opponentName}`,
            name: formState.opponentName,
            competition: formState.competition,
          },
        ]
      : resolvedOpponentOptions;
  const venueSelectionOptions =
    formState.venue && !venueOptions.some((venue) => venue.name === formState.venue)
      ? [...venueOptions, { id: `current-${formState.venue}`, name: formState.venue }]
      : venueOptions;

  function updateField<Key extends keyof MatchFormState>(
    key: Key,
    value: MatchFormState[Key],
  ) {
    setFormState((currentValue) => ({
      ...currentValue,
      [key]: value,
    }));
  }

  function handleTeamChange(nextTeamSlug: string) {
    const nextTeam = availableTeams.find((team) => team.slug === nextTeamSlug);
    const nextCompetition = nextTeam?.competition ?? "";
    const nextOpponents = opponentOptions.filter(
      (opponent) => opponent.competition === nextCompetition,
    );

    setFormState((currentValue) => ({
      ...currentValue,
      teamSlug: nextTeamSlug,
      season: nextTeam?.season ?? currentValue.season,
      competition: nextCompetition || currentValue.competition,
      matchday:
        mode === "create"
          ? getNextMatchdaySuggestion(existingMatches, nextTeamSlug)
          : currentValue.matchday,
      opponentName: nextOpponents.some(
        (opponent) => opponent.name === currentValue.opponentName,
      )
        ? currentValue.opponentName
        : "",
      status:
        currentValue.status === "live" && !nextTeam?.isFirstTeam ? "pending" : currentValue.status,
      highlightsUrl: nextTeam?.isFirstTeam ? currentValue.highlightsUrl : "",
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedValue = matchFormSchema.safeParse({
      ...formState,
      season: formState.season.trim(),
      competition: formState.competition.trim(),
      matchday: formState.matchday.trim(),
      opponentName: formState.opponentName.trim(),
      venue: formState.venue.trim(),
      highlightsUrl: formState.highlightsUrl.trim(),
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

    const ownScore = parseScore(parsedValue.data.ownScore);
    const opponentScore = parseScore(parsedValue.data.opponentScore);
    const nextErrors: Record<string, string> = {};

    if (!selectedTeam) {
      nextErrors.teamSlug = "Selecciona un equipo valido.";
    }

    if (parsedValue.data.status === "played") {
      if (ownScore === null || Number.isNaN(ownScore) || ownScore < 0) {
        nextErrors.ownScore = "Introduce los goles propios.";
      }

      if (opponentScore === null || Number.isNaN(opponentScore) || opponentScore < 0) {
        nextErrors.opponentScore = "Introduce los goles del rival.";
      }
    }

    if (parsedValue.data.status === "live" && !allowLiveStatus) {
      nextErrors.status = "El estado en vivo solo se usa en el Primer Equipo.";
    }

    if (parsedValue.data.highlightsUrl && !canManageHighlights) {
      nextErrors.highlightsUrl = "Los highlights solo se gestionan en el Primer Equipo.";
    }

    if (parsedValue.data.highlightsUrl) {
      const urlResult = z.string().url().safeParse(parsedValue.data.highlightsUrl);

      if (!urlResult.success) {
        nextErrors.highlightsUrl = "Introduce una URL valida.";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    onSave({
      id: match?.id ?? `match-${Date.now()}`,
      teamId: selectedTeam?.id ?? "",
      teamSlug: selectedTeam?.slug ?? "",
      teamName: selectedTeam?.name ?? "",
      season: parsedValue.data.season,
      competition: parsedValue.data.competition,
      matchday: parsedValue.data.matchday,
      opponentName: parsedValue.data.opponentName,
      isHome: parsedValue.data.isHome,
      date: parsedValue.data.date,
      time: parsedValue.data.time,
      venue: parsedValue.data.venue,
      status: getStoredMatchStatus(parsedValue.data.status, Boolean(parsedValue.data.date)),
      ownScore: parsedValue.data.status === "played" ? ownScore : null,
      opponentScore: parsedValue.data.status === "played" ? opponentScore : null,
      highlightsUrl:
        canManageHighlights && parsedValue.data.status === "played" && parsedValue.data.highlightsUrl
          ? parsedValue.data.highlightsUrl
          : undefined,
      previewAvailable: true,
      detailAvailable: true,
      isFirstTeam: selectedTeam?.isFirstTeam ?? false,
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[rgba(5,10,18,0.78)] px-4 py-6 backdrop-blur-sm sm:px-6 sm:py-10">
      <div className="w-full max-w-5xl rounded-[12px] border border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(16,37,67,0.98),rgba(7,19,34,0.98))] shadow-[0_32px_90px_rgba(0,0,0,0.42)]">
        <div className="flex items-start justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] px-5 py-5 sm:px-6">
          <div className="space-y-2">
            <p className="rr-kicker text-[color:var(--rr-gold)]">
              {mode === "create" ? "Nuevo partido" : "Editar partido"}
            </p>
            <div>
              <h2 className="rr-display text-[2.05rem] leading-[0.94] text-white sm:text-[2.25rem]">
                {mode === "create"
                  ? isCoach
                    ? "Proximo partido"
                    : "Crear partido"
                  : isCoach
                    ? `Previa de ${selectedTeam?.name ?? "tu equipo"}`
                    : `${selectedTeam?.name ?? "Partido"} vs ${match?.opponentName ?? ""}`}
              </h2>
              <p className="mt-2 max-w-xl text-[0.94rem] leading-5 text-[color:var(--rr-muted)]">
                {isCoach
                  ? "Completa rival, fecha, campo y estado sin salir del flujo movil."
                  : "Ajusta calendario, previa y resultado desde el mismo flujo operativo."}
              </p>
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

        <form onSubmit={handleSubmit} className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
          {isCoach ? (
            <div className="rounded-[10px] border border-[rgba(253,203,88,0.22)] bg-[rgba(253,203,88,0.06)] px-4 py-3 text-[0.9rem] text-[color:var(--rr-muted)]">
              Equipo activo: <span className="font-semibold text-white">{selectedTeam?.name ?? "Equipo asignado"}</span>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {lockTeam ? (
              <div className="grid gap-2 md:col-span-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Equipo</span>
                <div className="flex min-h-11 items-center rounded-[8px] border border-white/10 bg-white/4 px-3 text-white">
                  {selectedTeam?.name ?? "Equipo asignado"}
                </div>
              </div>
            ) : (
              <label className="grid gap-2 md:col-span-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Equipo</span>
                <select
                  value={formState.teamSlug}
                  onChange={(event) => handleTeamChange(event.target.value)}
                  className={fieldClassName}
                >
                  {availableTeams.map((team) => (
                    <option key={team.slug} value={team.slug}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {errors.teamSlug ? (
                  <span className="text-[0.82rem] text-[#ff8d8d]">{errors.teamSlug}</span>
                ) : null}
              </label>
            )}

            {!isCoach ? (
              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Temporada</span>
                <select
                  value={formState.season}
                  onChange={(event) => updateField("season", event.target.value)}
                  className={fieldClassName}
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {!isCoach ? (
              <div className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Competicion</span>
                <div
                  className="flex min-h-11 items-center rounded-[8px] border border-white/10 bg-white/[0.035] px-3 text-[color:var(--rr-muted)] opacity-80"
                  aria-label="Competicion asignada automaticamente"
                >
                  {formState.competition}
                </div>
                {errors.competition ? (
                  <span className="text-[0.82rem] text-[#ff8d8d]">{errors.competition}</span>
                ) : null}
              </div>
            ) : null}

            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Jornada</span>
              <input
                type="text"
                value={formState.matchday}
                onChange={(event) => updateField("matchday", event.target.value)}
                className={fieldClassName}
                placeholder="Jornada 24"
              />
              {errors.matchday ? (
                <span className="text-[0.82rem] text-[#ff8d8d]">{errors.matchday}</span>
              ) : null}
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Rival</span>
                <select
                  value={formState.opponentName}
                  onChange={(event) => updateField("opponentName", event.target.value)}
                  disabled={isSaving}
                  className={fieldClassName}
                >
                  <option value="">Selecciona rival</option>
                  {opponentSelectionOptions.map((opponent) => (
                    <option key={opponent.id} value={opponent.name}>
                      {opponent.name}
                    </option>
                ))}
              </select>
              {errors.opponentName ? (
                <span className="text-[0.82rem] text-[#ff8d8d]">{errors.opponentName}</span>
              ) : null}
            </label>

            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Fecha</span>
                <input
                  type="date"
                  value={formState.date}
                  onChange={(event) => updateField("date", event.target.value)}
                  disabled={isSaving}
                  className={fieldClassName}
                />
              </label>

            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Hora</span>
                <input
                  type="time"
                  value={formState.time}
                  onChange={(event) => updateField("time", event.target.value)}
                  disabled={isSaving}
                  className={fieldClassName}
                />
              </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Campo</span>
              <select
                value={formState.venue}
                onChange={(event) => updateField("venue", event.target.value)}
                disabled={isSaving}
                className={fieldClassName}
              >
                {venueSelectionOptions.map((venue) => (
                  <option key={venue.id} value={venue.name}>
                    {venue.name}
                  </option>
                ))}
              </select>
              {errors.venue ? <span className="text-[0.82rem] text-[#ff8d8d]">{errors.venue}</span> : null}
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/4 px-4 py-3 text-[0.92rem] text-[color:var(--rr-muted)]">
              <input
                type="checkbox"
                checked={formState.isHome}
                onChange={(event) => updateField("isHome", event.target.checked)}
                disabled={isSaving}
                className="h-4 w-4 rounded border border-[color:var(--rr-border)] bg-transparent accent-[color:var(--rr-gold)]"
              />
              Partido como local
            </label>

            <label className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/4 px-4 py-3 text-[0.92rem] text-[color:var(--rr-muted)]">
              <input
                type="checkbox"
                checked={!formState.date}
                onChange={(event) => {
                  if (event.target.checked) {
                    updateField("date", "");
                    updateField("time", "");
                  }
                }}
                disabled={isSaving}
                className="h-4 w-4 rounded border border-[color:var(--rr-border)] bg-transparent accent-[color:var(--rr-gold)]"
              />
              Fecha por confirmar
            </label>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="rr-kicker text-[color:var(--rr-gold)]">Estado</p>
              <p className="text-[0.92rem] text-[color:var(--rr-muted)]">
                El estado en vivo solo aplica al Primer Equipo.
              </p>
            </div>
            <MatchStatusSelector
              value={formState.status}
              allowLive={allowLiveStatus}
              onChange={(nextStatus) => updateField("status", nextStatus)}
            />
            {errors.status ? <span className="text-[0.82rem] text-[#ff8d8d]">{errors.status}</span> : null}
          </div>

          {formState.status === "played" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Goles propios</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  value={formState.ownScore}
                  onChange={(event) => updateField("ownScore", event.target.value)}
                  disabled={isSaving}
                  className={fieldClassName}
                />
                {errors.ownScore ? (
                  <span className="text-[0.82rem] text-[#ff8d8d]">{errors.ownScore}</span>
                ) : null}
              </label>

              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Goles rival</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  value={formState.opponentScore}
                  onChange={(event) => updateField("opponentScore", event.target.value)}
                  disabled={isSaving}
                  className={fieldClassName}
                />
                {errors.opponentScore ? (
                  <span className="text-[0.82rem] text-[#ff8d8d]">{errors.opponentScore}</span>
                ) : null}
              </label>

              {canManageHighlights ? (
                <label className="grid gap-2 xl:col-span-2">
                  <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">URL highlights</span>
                  <input
                    type="url"
                    value={formState.highlightsUrl}
                    onChange={(event) => updateField("highlightsUrl", event.target.value)}
                    disabled={isSaving}
                    className={fieldClassName}
                    placeholder="https://..."
                  />
                  {errors.highlightsUrl ? (
                    <span className="text-[0.82rem] text-[#ff8d8d]">{errors.highlightsUrl}</span>
                  ) : null}
                </label>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-[rgba(255,255,255,0.08)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
              {isCoach
                ? "Guarda la previa o el cambio de estado y vuelve a la jornada."
                : "Los cambios se guardan sobre el calendario real del backoffice."}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
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
                    ? isCoach
                      ? "Guardando..."
                      : "Creando..."
                    : isCoach
                      ? "Guardar partido"
                      : "Crear partido"
                  : isSaving
                    ? "Guardando..."
                    : "Guardar cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
