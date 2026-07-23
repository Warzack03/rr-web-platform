"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  Plus,
  Search,
  ShieldCheck,
  Star,
  UsersRound,
} from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  createAssignmentAction,
  saveAssignmentAction,
} from "@/app/admin/(panel)/asignaciones/actions";
import type {
  AdminAssignmentPlayerOption,
  AdminAssignmentTeam,
  AdminManagedAssignment,
} from "@/lib/contracts/admin";
import { adminPlayerPositionOptions } from "@/lib/admin/player-management";
import {
  buildAssignmentPlayerOptionLabel,
  buildCreateAssignmentDraft,
  formatAssignmentDateLabel,
  getAssignmentIssues,
  getAssignmentPositionLabel,
  type CreateAssignmentDraft,
} from "@/lib/admin/assignment-workspace";
import { cn } from "@/lib/utils";

type AdminAssignmentsWorkspaceProps = {
  activeSeasonLabel?: string;
  initialTeams: AdminAssignmentTeam[];
  initialAssignments: AdminManagedAssignment[];
  initialPlayerOptions: AdminAssignmentPlayerOption[];
  initialSelectedTeamSlug?: string;
  initialSelectedAssignmentId?: string;
};

function inputClassName(className?: string) {
  return cn(
    "min-h-11 rounded-[14px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 text-[0.94rem] text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]",
    className,
  );
}

function labelClassName() {
  return "rr-kicker text-[0.7rem] text-[color:var(--rr-muted)]";
}

export function AdminAssignmentsWorkspace({
  activeSeasonLabel,
  initialTeams,
  initialAssignments,
  initialPlayerOptions,
  initialSelectedTeamSlug,
  initialSelectedAssignmentId,
}: AdminAssignmentsWorkspaceProps) {
  const [teams, setTeams] = useState(initialTeams);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [playerOptions, setPlayerOptions] = useState(initialPlayerOptions);
  const [selectedTeamSlug, setSelectedTeamSlug] = useState(
    initialSelectedTeamSlug ?? initialTeams[0]?.slug ?? "",
  );
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(
    initialSelectedAssignmentId ?? "",
  );
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPersisting, setIsPersisting] = useState(false);
  const [isCreating, setIsCreating] = useState(
    initialAssignments.filter(
      (assignment) => assignment.teamSlug === (initialSelectedTeamSlug ?? initialTeams[0]?.slug),
    ).length === 0,
  );
  const [createDraft, setCreateDraft] = useState<CreateAssignmentDraft>(() =>
    buildCreateAssignmentDraft(
      initialAssignments.filter(
        (assignment) => assignment.teamSlug === (initialSelectedTeamSlug ?? initialTeams[0]?.slug),
      ),
    ),
  );
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer = window.setTimeout(() => setFeedback(null), 2600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const currentTeam =
    teams.find((team) => team.slug === selectedTeamSlug) ?? teams[0] ?? null;
  const teamAssignments = useMemo(
    () =>
      assignments
        .filter((assignment) => assignment.teamSlug === selectedTeamSlug)
        .sort((left, right) => {
          if (left.active !== right.active) {
            return left.active ? -1 : 1;
          }

          if (left.shirtNumber !== right.shirtNumber) {
            return left.shirtNumber - right.shirtNumber;
          }

          return left.publicName.localeCompare(right.publicName, "es");
        }),
    [assignments, selectedTeamSlug],
  );
  const filteredAssignments = useMemo(() => {
    if (!deferredSearch) {
      return teamAssignments;
    }

    return teamAssignments.filter((assignment) =>
      assignment.publicName.toLowerCase().includes(deferredSearch),
    );
  }, [deferredSearch, teamAssignments]);
  const selectedAssignment = isCreating
    ? undefined
    : teamAssignments.find((assignment) => assignment.id === selectedAssignmentId) ??
      filteredAssignments[0] ??
      teamAssignments[0];
  const issues = getAssignmentIssues(teamAssignments);
  const activeCount = teamAssignments.filter((assignment) => assignment.active).length;
  const visibleCount = teamAssignments.filter(
    (assignment) => assignment.active && assignment.visible,
  ).length;
  const selectedPlayer = selectedAssignment
    ? playerOptions.find((player) => player.id === selectedAssignment.playerId)
    : undefined;
  const creationCandidates = playerOptions.filter(
    (player) =>
      !player.currentTeamSlugs.includes(selectedTeamSlug) &&
      player.currentTeamSlugs.length < 2,
  );

  function applyServerData(nextData: {
    teams: AdminAssignmentTeam[];
    assignments: AdminManagedAssignment[];
    playerOptions: AdminAssignmentPlayerOption[];
  }) {
    setTeams(nextData.teams);
    setAssignments(nextData.assignments);
    setPlayerOptions(nextData.playerOptions);
  }

  function updateSelectedAssignment(
    updater: (assignment: AdminManagedAssignment) => AdminManagedAssignment,
  ) {
    if (!selectedAssignment) {
      return;
    }

    setAssignments((currentAssignments) =>
      currentAssignments.map((assignment) =>
        assignment.id === selectedAssignment.id ? updater(assignment) : assignment,
      ),
    );
  }

  function resetCreateDraft(nextAssignments = teamAssignments) {
    setCreateDraft(buildCreateAssignmentDraft(nextAssignments));
  }

  function handleTeamChange(nextTeamSlug: string) {
    const nextAssignments = assignments.filter(
      (assignment) => assignment.teamSlug === nextTeamSlug,
    );

    setSelectedTeamSlug(nextTeamSlug);
    setSelectedAssignmentId(nextAssignments[0]?.id ?? "");
    setIsCreating(nextAssignments.length === 0);
    setSearch("");
    setCreateDraft(buildCreateAssignmentDraft(nextAssignments));
  }

  async function handleSaveAssignment() {
    if (!selectedAssignment) {
      return;
    }

    setIsPersisting(true);
    const result = await saveAssignmentAction({
      assignmentId: selectedAssignment.id,
      shirtNumber: selectedAssignment.shirtNumber,
      publicPosition: selectedAssignment.publicPosition,
      captain: selectedAssignment.captain,
      active: selectedAssignment.active,
      joinedAt: selectedAssignment.joinedAt,
      leftAt: selectedAssignment.leftAt,
    });
    setIsPersisting(false);

    if (!result.ok) {
      setFeedback(result.message);
      return;
    }

    applyServerData(result.data);
    setSelectedTeamSlug(result.selectedTeamSlug ?? selectedAssignment.teamSlug);
    setSelectedAssignmentId(result.selectedAssignmentId ?? selectedAssignment.id);
    setIsCreating(false);
    setFeedback(result.message);
  }

  async function handleCreateAssignment() {
    if (!currentTeam) {
      return;
    }

    setIsPersisting(true);
    const result = await createAssignmentAction({
      teamSlug: currentTeam.slug,
      mode: createDraft.mode,
      playerId: createDraft.playerId,
      publicName: createDraft.publicName,
      keepCurrentTeamsActive: createDraft.keepCurrentTeamsActive,
      shirtNumber: createDraft.shirtNumber,
      publicPosition: createDraft.publicPosition,
      captain: createDraft.captain,
      joinedAt: createDraft.joinedAt,
    });
    setIsPersisting(false);

    if (!result.ok) {
      setFeedback(result.message);
      return;
    }

    applyServerData(result.data);
    const nextAssignments = result.data.assignments.filter(
      (assignment) => assignment.teamSlug === (result.selectedTeamSlug ?? currentTeam.slug),
    );
    setSelectedTeamSlug(result.selectedTeamSlug ?? currentTeam.slug);
    setSelectedAssignmentId(result.selectedAssignmentId ?? nextAssignments[0]?.id ?? "");
    setIsCreating(false);
    setCreateDraft(buildCreateAssignmentDraft(nextAssignments));
    setFeedback(result.message);
  }

  if (!currentTeam) {
    return (
      <AdminEmptyState
        title="Sin equipos activos"
        description="Necesitas al menos un equipo en la temporada activa para gestionar la plantilla."
      />
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Plantilla"
        title="Plantilla por equipo"
        description="Aqui se gestiona la asignacion deportiva: altas, dorsal, posicion publica y cierre de etapa sin tocar la ficha final del jugador."
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setIsCreating(true);
                resetCreateDraft();
              }}
              className="rr-button rr-button-secondary text-[0.84rem]"
            >
              <Plus className="h-4 w-4" />
              Dar de alta jugador
            </button>
            <button
              type="button"
              onClick={handleSaveAssignment}
              disabled={!selectedAssignment || isCreating || isPersisting}
              className="rr-button rr-button-primary text-[0.84rem] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Guardar plantilla
            </button>
          </div>
        }
      />

      {feedback ? <AdminFeedbackBanner message={feedback} /> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-4">
          <AdminPanel className="p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_14rem_14rem] lg:items-end">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Contexto</p>
                <h2 className="mt-2 text-[1.32rem] font-semibold text-white">
                  {currentTeam.name}
                </h2>
                <p className="mt-1 text-[0.92rem] text-[color:var(--rr-muted)]">
                  {currentTeam.competition}
                </p>
              </div>

              <label className="grid gap-2">
                <span className={labelClassName()}>Equipo</span>
                <select
                  value={selectedTeamSlug}
                  onChange={(event) => handleTeamChange(event.target.value)}
                  className={inputClassName()}
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.slug}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-2">
                <span className={labelClassName()}>Temporada activa</span>
                <div className="flex min-h-11 items-center rounded-[14px] border border-white/10 bg-white/4 px-3 text-white">
                  {activeSeasonLabel ?? currentTeam.season}
                </div>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel className="p-4 sm:p-5">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="rr-kicker text-[color:var(--rr-gold)]">Plantilla</p>
                  <h2 className="mt-1 text-[1.18rem] font-semibold text-white">
                    {visibleCount} visibles de {activeCount} activos
                  </h2>
                </div>

                <label className="relative block md:min-w-[18rem]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--rr-muted)]" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar en plantilla"
                    className={inputClassName("w-full pl-9")}
                  />
                </label>
              </div>

              {teamAssignments.length === 0 ? (
                <div className="rounded-[12px] border border-dashed border-white/14 bg-white/3 px-5 py-5 text-[0.92rem] text-[color:var(--rr-muted)]">
                  Este equipo todavia no tiene jugadores asignados en la temporada activa.
                </div>
              ) : null}

              <div className="grid gap-2">
                {filteredAssignments.map((assignment) => {
                  const active = !isCreating && assignment.id === selectedAssignment?.id;

                  return (
                    <div
                      key={assignment.id}
                      className={cn(
                        "grid gap-3 rounded-[12px] border px-4 py-3 transition lg:grid-cols-[minmax(0,1fr)_9rem_7rem] lg:items-center",
                        active
                          ? "border-[rgba(243,203,69,0.34)] bg-[rgba(243,203,69,0.1)]"
                          : "border-white/10 bg-[rgba(255,255,255,0.04)]",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAssignmentId(assignment.id);
                          setIsCreating(false);
                        }}
                        className="min-w-0 text-left"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-white">
                            #{assignment.shirtNumber} {assignment.publicName}
                          </p>
                          {assignment.captain ? (
                            <Star className="h-4 w-4 fill-[color:var(--rr-gold)] text-[color:var(--rr-gold)]" />
                          ) : null}
                        </div>
                        <p className="mt-1 text-[0.86rem] text-[color:var(--rr-muted)]">
                          {getAssignmentPositionLabel(assignment.publicPosition)} -{" "}
                          {assignment.active
                            ? assignment.joinedLabel
                            : assignment.leftLabel ?? "Etapa cerrada"}
                        </p>
                      </button>

                      <AdminStatusBadge
                        label={assignment.source === "manual" ? "Manual" : "Importado"}
                        tone={assignment.source === "manual" ? "gold" : "blue"}
                      />

                      <div className="flex items-center gap-2 text-[0.84rem] text-[color:var(--rr-muted)]">
                        {assignment.visible ? (
                          <Eye className="h-4 w-4 text-[color:var(--rr-gold)]" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                        {assignment.active ? "Activo" : "Cerrado"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AdminPanel>
        </div>

        <div className="space-y-4 xl:sticky xl:top-[7.5rem] xl:self-start">
          <AdminPanel className="p-5">
            {isCreating ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="rr-kicker text-[color:var(--rr-gold)]">Alta en plantilla</p>
                    <h2 className="mt-1 text-[1.18rem] font-semibold text-white">
                      Nuevo jugador o movimiento
                    </h2>
                    <p className="mt-1 text-[0.86rem] text-[color:var(--rr-muted)]">
                      La ficha publica se completa despues en Fichas y cromos.
                    </p>
                  </div>
                  <Plus className="h-5 w-5 text-[color:var(--rr-gold)]" />
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-[12px] border border-white/10 bg-white/4 p-1">
                  {(["existing", "new"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() =>
                        setCreateDraft((currentDraft) => ({
                          ...currentDraft,
                          mode,
                          playerId: "",
                          publicName: "",
                          keepCurrentTeamsActive: false,
                        }))
                      }
                      className={cn(
                        "min-h-10 rounded-[9px] px-2 text-[0.8rem] font-medium transition",
                        createDraft.mode === mode
                          ? "bg-[rgba(243,203,69,0.14)] text-[color:var(--rr-gold)]"
                          : "text-[color:var(--rr-muted)]",
                      )}
                    >
                      {mode === "existing" ? "Jugador existente" : "Crear nuevo"}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3">
                  {createDraft.mode === "existing" ? (
                    <label className="grid gap-2">
                      <span className={labelClassName()}>Jugador</span>
                      <select
                        value={createDraft.playerId}
                        onChange={(event) =>
                          setCreateDraft((currentDraft) => ({
                            ...currentDraft,
                            playerId: event.target.value,
                          }))
                        }
                        className={inputClassName()}
                      >
                        <option value="">Selecciona un jugador</option>
                        {creationCandidates.map((player) => (
                          <option key={player.id} value={player.id}>
                            {buildAssignmentPlayerOptionLabel(player)}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <label className="grid gap-2">
                      <span className={labelClassName()}>Nombre publico</span>
                      <input
                        value={createDraft.publicName}
                        onChange={(event) =>
                          setCreateDraft((currentDraft) => ({
                            ...currentDraft,
                            publicName: event.target.value,
                          }))
                        }
                        className={inputClassName()}
                        placeholder="Nombre del jugador"
                      />
                    </label>
                  )}

                  {createDraft.mode === "existing" && createDraft.playerId ? (
                    (() => {
                      const selectedCandidate = playerOptions.find(
                        (player) => player.id === createDraft.playerId,
                      );

                      if (!selectedCandidate || selectedCandidate.currentTeamSlugs.length === 0) {
                        return null;
                      }

                      return (
                        <button
                          type="button"
                          onClick={() =>
                            setCreateDraft((currentDraft) => ({
                              ...currentDraft,
                              keepCurrentTeamsActive: !currentDraft.keepCurrentTeamsActive,
                            }))
                          }
                          className="flex min-h-11 items-center justify-between rounded-[16px] border border-white/10 bg-white/5 px-4 text-left text-[0.9rem] text-white transition hover:border-[rgba(243,203,69,0.26)]"
                        >
                          Mantener tambien su equipo actual
                          {createDraft.keepCurrentTeamsActive ? (
                            <Check className="h-4 w-4 text-[color:var(--rr-gold)]" />
                          ) : (
                            <span className="h-4 w-4 rounded-full border border-white/20" />
                          )}
                        </button>
                      );
                    })()
                  ) : null}

                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-2">
                      <span className={labelClassName()}>Dorsal</span>
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={createDraft.shirtNumber}
                        onChange={(event) =>
                          setCreateDraft((currentDraft) => ({
                            ...currentDraft,
                            shirtNumber: Math.max(0, Number(event.target.value)),
                          }))
                        }
                        className={inputClassName()}
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className={labelClassName()}>Posicion publica</span>
                      <select
                        value={createDraft.publicPosition}
                        onChange={(event) =>
                          setCreateDraft((currentDraft) => ({
                            ...currentDraft,
                            publicPosition: event.target.value as CreateAssignmentDraft["publicPosition"],
                          }))
                        }
                        className={inputClassName()}
                      >
                        {adminPlayerPositionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="grid gap-2">
                    <span className={labelClassName()}>Fecha de alta</span>
                    <input
                      type="date"
                      value={createDraft.joinedAt}
                      onChange={(event) =>
                        setCreateDraft((currentDraft) => ({
                          ...currentDraft,
                          joinedAt: event.target.value,
                        }))
                      }
                      className={inputClassName()}
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCreateDraft((currentDraft) => ({
                      ...currentDraft,
                      captain: !currentDraft.captain,
                    }))
                  }
                  className="flex min-h-11 items-center justify-between rounded-[16px] border border-white/10 bg-white/5 px-4 text-left text-[0.9rem] text-white transition hover:border-[rgba(243,203,69,0.26)]"
                >
                  Capitan
                  {createDraft.captain ? (
                    <Check className="h-4 w-4 text-[color:var(--rr-gold)]" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-white/20" />
                  )}
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleCreateAssignment}
                    disabled={isPersisting}
                    className="rr-button rr-button-primary text-[0.84rem]"
                  >
                    Guardar alta
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      resetCreateDraft();
                    }}
                    disabled={isPersisting}
                    className="rr-button rr-button-secondary text-[0.84rem]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : selectedAssignment ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="rr-kicker text-[color:var(--rr-gold)]">Jugador en plantilla</p>
                    <h2 className="mt-1 text-[1.18rem] font-semibold text-white">
                      {selectedAssignment.publicName}
                    </h2>
                    <p className="mt-1 text-[0.86rem] text-[color:var(--rr-muted)]">
                      {selectedAssignment.source === "manual"
                        ? "Alta manual"
                        : "Snapshot importado"}
                    </p>
                  </div>
                  <UsersRound className="h-5 w-5 text-[color:var(--rr-gold)]" />
                </div>

                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <span className={labelClassName()}>Ficha publica</span>
                    <Link
                      href={`/admin/jugadores?team=${selectedAssignment.teamSlug}&player=${selectedAssignment.playerId}`}
                      className="rr-button rr-button-secondary min-h-11 justify-center text-[0.84rem]"
                    >
                      Abrir ficha publica
                    </Link>
                  </div>

                  <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3 text-[0.86rem] text-[color:var(--rr-muted)]">
                    {selectedPlayer?.visible ? "Visible" : "Oculto"} en web ·{" "}
                    {selectedPlayer?.hasPhoto ? "Con foto base" : "Sin foto base"}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-2">
                      <span className={labelClassName()}>Dorsal</span>
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={selectedAssignment.shirtNumber}
                        onChange={(event) =>
                          updateSelectedAssignment((assignment) => ({
                            ...assignment,
                            shirtNumber: Math.max(0, Number(event.target.value)),
                          }))
                        }
                        className={inputClassName()}
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className={labelClassName()}>Posicion publica</span>
                      <select
                        value={selectedAssignment.publicPosition}
                        onChange={(event) =>
                          updateSelectedAssignment((assignment) => ({
                            ...assignment,
                            publicPosition: event.target.value as AdminManagedAssignment["publicPosition"],
                          }))
                        }
                        className={inputClassName()}
                      >
                        {adminPlayerPositionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-2">
                      <span className={labelClassName()}>Fecha de alta</span>
                      <input
                        type="date"
                        value={selectedAssignment.joinedAt}
                        onChange={(event) =>
                          updateSelectedAssignment((assignment) => ({
                            ...assignment,
                            joinedAt: event.target.value,
                            joinedLabel: event.target.value
                              ? formatAssignmentDateLabel(event.target.value)
                              : "Alta pendiente",
                          }))
                        }
                        className={inputClassName()}
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className={labelClassName()}>Fecha de baja</span>
                      <input
                        type="date"
                        value={selectedAssignment.leftAt}
                        onChange={(event) =>
                          updateSelectedAssignment((assignment) => ({
                            ...assignment,
                            leftAt: event.target.value,
                            leftLabel: event.target.value
                              ? formatAssignmentDateLabel(event.target.value)
                              : undefined,
                          }))
                        }
                        className={inputClassName()}
                        disabled={selectedAssignment.active}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid gap-2">
                  {[
                    {
                      label: "Capitan",
                      active: selectedAssignment.captain,
                      onClick: () =>
                        updateSelectedAssignment((assignment) => ({
                          ...assignment,
                          captain: !assignment.captain,
                        })),
                    },
                    {
                      label: "Asignacion activa",
                      active: selectedAssignment.active,
                      onClick: () =>
                        updateSelectedAssignment((assignment) => ({
                          ...assignment,
                          active: !assignment.active,
                          leftAt: assignment.active ? assignment.leftAt : "",
                          leftLabel: assignment.active ? assignment.leftLabel : undefined,
                        })),
                    },
                  ].map((control) => (
                    <button
                      key={control.label}
                      type="button"
                      onClick={control.onClick}
                      className="flex min-h-11 items-center justify-between rounded-[16px] border border-white/10 bg-white/5 px-4 text-left text-[0.9rem] text-white transition hover:border-[rgba(243,203,69,0.26)]"
                    >
                      {control.label}
                      {control.active ? (
                        <Check className="h-4 w-4 text-[color:var(--rr-gold)]" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-white/20" />
                      )}
                    </button>
                  ))}
                </div>

                {!selectedAssignment.active ? (
                  <div className="rounded-[16px] border border-[rgba(243,203,69,0.22)] bg-[rgba(243,203,69,0.08)] px-4 py-3 text-[0.86rem] text-[color:var(--rr-muted)]">
                    Esta asignacion queda en historico. Si la reactivas, el sistema mantendra como maximo dos equipos activos para ese jugador en la temporada.
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="rr-kicker text-[color:var(--rr-gold)]">Sin seleccion</p>
                <p className="text-[0.92rem] text-[color:var(--rr-muted)]">
                  Elige un jugador de la izquierda o crea un alta nueva para este equipo.
                </p>
              </div>
            )}
          </AdminPanel>

          <AdminPanel className="p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="rr-kicker text-[color:var(--rr-gold)]">Avisos</p>
                  <h2 className="mt-1 text-[1.12rem] font-semibold text-white">
                    Calidad publica
                  </h2>
                </div>
                <AlertTriangle className="h-5 w-5 text-[color:var(--rr-gold)]" />
              </div>

              <div className="grid gap-2">
                {issues.length > 0 ? (
                  issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-white">{issue.title}</p>
                        <AdminStatusBadge label="Revisar" tone={issue.tone} />
                      </div>
                      <p className="mt-1 text-[0.86rem] text-[color:var(--rr-muted)]">
                        {issue.detail}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[16px] border border-[rgba(151,255,199,0.2)] bg-[rgba(31,98,64,0.18)] px-4 py-3 text-[0.9rem] text-[#b8ffd8]">
                    Plantilla lista para publicarse.
                  </div>
                )}
              </div>
            </div>
          </AdminPanel>

          <AdminPanel className="p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="rr-kicker text-[color:var(--rr-gold)]">Reglas del flujo</p>
                  <h2 className="mt-1 text-[1.12rem] font-semibold text-white">
                    Separacion sana
                  </h2>
                </div>
                <ShieldCheck className="h-5 w-5 text-[color:var(--rr-gold)]" />
              </div>

              <div className="grid gap-2 text-[0.86rem] text-[color:var(--rr-muted)]">
                <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3">
                  Aqui mandan dorsal, posicion, capitania y estado de la etapa.
                </div>
                <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3">
                  Nombre, slug, foto y visibilidad se rematan en Fichas y cromos.
                </div>
              </div>
            </div>
          </AdminPanel>
        </div>
      </div>
    </div>
  );
}
