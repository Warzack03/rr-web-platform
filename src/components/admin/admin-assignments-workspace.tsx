"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  Plus,
  Search,
  Star,
  UsersRound,
} from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  adminPlayerPositionOptions,
  adminMockPlayers,
  adminMockSeasons,
  adminMockTeams,
  type AdminPlayer,
} from "@/lib/admin/mock-data";
import { cn } from "@/lib/utils";

type AssignmentSource = "imported" | "manual";

type RosterAssignment = {
  id: string;
  playerId: string;
  teamSlug: string;
  seasonId: string;
  publicName: string;
  shirtNumber: number;
  publicPosition: AdminPlayer["position"];
  displayOrder: number;
  captain: boolean;
  visible: boolean;
  active: boolean;
  source: AssignmentSource;
  hasPhoto: boolean;
  joinedLabel: string;
  leftLabel?: string;
};

type AssignmentIssue = {
  id: string;
  title: string;
  detail: string;
  tone: "gold" | "danger" | "slate";
};

function getPositionLabel(position: AdminPlayer["position"]) {
  return (
    adminPlayerPositionOptions.find((option) => option.value === position)?.label ??
    position
  );
}

function inputClassName(className?: string) {
  return cn(
    "min-h-11 rounded-[8px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-3 text-[0.94rem] text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]",
    className,
  );
}

function labelClassName() {
  return "rr-kicker text-[0.7rem] text-[color:var(--rr-muted)]";
}

function createAssignments(): RosterAssignment[] {
  return adminMockPlayers.map((player, index) => ({
    id: `assignment-${player.id}`,
    playerId: player.id,
    teamSlug: player.teamSlug,
    seasonId: adminMockSeasons[0].id,
    publicName: player.name,
    shirtNumber: player.number,
    publicPosition: player.position,
    displayOrder: index + 1,
    captain: player.id === "player-2" || player.id === "player-7",
    visible: player.id !== "player-10",
    active: player.id !== "player-10",
    source: index % 5 === 0 ? "manual" : "imported",
    hasPhoto: index < 4,
    joinedLabel: "Sep 2026",
    leftLabel: player.id === "player-10" ? "Pendiente" : undefined,
  }));
}

function sortAssignments(assignments: RosterAssignment[]) {
  return [...assignments].sort((left, right) => {
    if (left.active !== right.active) {
      return left.active ? -1 : 1;
    }

    if (left.shirtNumber !== right.shirtNumber) {
      return left.shirtNumber - right.shirtNumber;
    }

    return left.publicName.localeCompare(right.publicName);
  });
}

function getTeamBySlug(teamSlug: string) {
  return adminMockTeams.find((team) => team.slug === teamSlug) ?? adminMockTeams[0];
}

function getSuggestedShirtNumber(assignments: RosterAssignment[]) {
  const highestNumber = assignments.reduce(
    (currentHighest, assignment) => Math.max(currentHighest, assignment.shirtNumber),
    0,
  );

  return highestNumber + 1;
}

function getAssignmentIssues(assignments: RosterAssignment[]): AssignmentIssue[] {
  const issues: AssignmentIssue[] = [];
  const activeAssignments = assignments.filter((assignment) => assignment.active);
  const numberCounts = new Map<number, RosterAssignment[]>();

  activeAssignments.forEach((assignment) => {
    const current = numberCounts.get(assignment.shirtNumber) ?? [];
    numberCounts.set(assignment.shirtNumber, [...current, assignment]);
  });

  numberCounts.forEach((items, number) => {
    if (items.length > 1) {
      issues.push({
        id: `duplicate-${number}`,
        title: `Dorsal ${number} duplicado`,
        detail: items.map((item) => item.publicName).join(", "),
        tone: "danger",
      });
    }
  });

  activeAssignments
    .filter((assignment) => !assignment.hasPhoto)
    .slice(0, 3)
    .forEach((assignment) => {
      issues.push({
        id: `photo-${assignment.id}`,
        title: "Foto pendiente",
        detail: assignment.publicName,
        tone: "gold",
      });
    });

  activeAssignments
    .filter((assignment) => !assignment.visible)
    .forEach((assignment) => {
      issues.push({
        id: `hidden-${assignment.id}`,
        title: "Jugador oculto",
        detail: `${assignment.publicName} no saldra en plantilla publica.`,
        tone: "slate",
      });
    });

  return issues;
}

type AdminAssignmentsWorkspaceInnerProps = {
  initialTeamSlug: string;
};

function AdminAssignmentsWorkspaceInner({
  initialTeamSlug,
}: AdminAssignmentsWorkspaceInnerProps) {
  const [assignments, setAssignments] = useState<RosterAssignment[]>(() =>
    createAssignments(),
  );
  const [selectedTeamSlug, setSelectedTeamSlug] = useState(initialTeamSlug);
  const [selectedSeasonId, setSelectedSeasonId] = useState(adminMockSeasons[0].id);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentTeam = getTeamBySlug(selectedTeamSlug);
  const teamAssignments = useMemo(
    () =>
      sortAssignments(
        assignments.filter(
          (assignment) =>
            assignment.teamSlug === selectedTeamSlug &&
            assignment.seasonId === selectedSeasonId,
        ),
      ),
    [assignments, selectedSeasonId, selectedTeamSlug],
  );
  const filteredAssignments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return teamAssignments;
    }

    return teamAssignments.filter((assignment) =>
      assignment.publicName.toLowerCase().includes(normalizedSearch),
    );
  }, [search, teamAssignments]);
  const selectedAssignment =
    teamAssignments.find((assignment) => assignment.id === selectedAssignmentId) ??
    teamAssignments[0];
  const issues = getAssignmentIssues(teamAssignments);
  const activeCount = teamAssignments.filter((assignment) => assignment.active).length;
  const visibleCount = teamAssignments.filter(
    (assignment) => assignment.active && assignment.visible,
  ).length;
  const hasLinkedPublicProfile = adminMockPlayers.some(
    (player) => player.id === selectedAssignment?.playerId,
  );

  function updateAssignment(
    assignmentId: string,
    updater: (assignment: RosterAssignment) => RosterAssignment,
  ) {
    setAssignments((currentAssignments) =>
      currentAssignments.map((assignment) =>
        assignment.id === assignmentId ? updater(assignment) : assignment,
      ),
    );
  }

  function handleCreatePlayer() {
    const newAssignmentId = `assignment-${Date.now()}`;
    const nextAssignment: RosterAssignment = {
      id: newAssignmentId,
      playerId: `player-${Date.now()}`,
      teamSlug: selectedTeamSlug,
      seasonId: selectedSeasonId,
      publicName: "Nuevo jugador",
      shirtNumber: getSuggestedShirtNumber(teamAssignments),
      publicPosition: "BAN",
      displayOrder: teamAssignments.length + 1,
      captain: false,
      visible: true,
      active: true,
      source: "manual",
      hasPhoto: false,
      joinedLabel: "Ahora",
    };

    setAssignments((currentAssignments) => [...currentAssignments, nextAssignment]);
    setSelectedAssignmentId(newAssignmentId);
    setFeedback("Jugador anadido a la plantilla. Guardado local de prueba.");
    window.setTimeout(() => setFeedback(null), 2400);
  }

  function handleSave() {
    setFeedback("Plantilla actualizada. Guardado local de prueba.");
    window.setTimeout(() => setFeedback(null), 2400);
  }

  if (!selectedAssignment) {
    return (
      <AdminEmptyState
        title="Sin jugadores en plantilla"
        description="Selecciona otro equipo o temporada para revisar la plantilla."
      />
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Plantilla"
        title="Plantilla por equipo"
        description="Da de alta jugadores y ajusta dorsal, posicion publica y visibilidad sin tocar el historico."
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCreatePlayer}
              className="rr-button rr-button-secondary text-[0.84rem]"
            >
              <Plus className="h-4 w-4" />
              Dar de alta jugador
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rr-button rr-button-primary text-[0.84rem]"
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
                  onChange={(event) => {
                    setSelectedTeamSlug(event.target.value);
                    setSelectedAssignmentId("");
                  }}
                  className={inputClassName()}
                >
                  {adminMockTeams.map((team) => (
                    <option key={team.slug} value={team.slug}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className={labelClassName()}>Temporada</span>
                <select
                  value={selectedSeasonId}
                  onChange={(event) => {
                    setSelectedSeasonId(event.target.value);
                    setSelectedAssignmentId("");
                  }}
                  className={inputClassName()}
                >
                  {adminMockSeasons.map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.name}
                    </option>
                  ))}
                </select>
              </label>
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

              <div className="grid gap-2">
                {filteredAssignments.map((assignment) => {
                  const active = assignment.id === selectedAssignment.id;

                  return (
                    <div
                      key={assignment.id}
                      className={cn(
                        "grid gap-3 rounded-[12px] border px-4 py-3 transition lg:grid-cols-[minmax(0,1fr)_9rem_7rem] lg:items-center",
                        active
                          ? "border-[rgba(253,203,88,0.34)] bg-[rgba(253,203,88,0.1)]"
                          : "border-white/10 bg-[rgba(255,255,255,0.04)]",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedAssignmentId(assignment.id)}
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
                          {getPositionLabel(assignment.publicPosition)} - {assignment.joinedLabel}
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
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="rr-kicker text-[color:var(--rr-gold)]">Jugador en plantilla</p>
                  <h2 className="mt-1 text-[1.18rem] font-semibold text-white">
                    {selectedAssignment.publicName}
                  </h2>
                  <p className="mt-1 text-[0.86rem] text-[color:var(--rr-muted)]">
                    {selectedAssignment.source === "manual" ? "Alta manual" : "Snapshot importado"}
                  </p>
                </div>
                <UsersRound className="h-5 w-5 text-[color:var(--rr-gold)]" />
              </div>

              <div className="grid gap-3">
                <label className="grid gap-2">
                  <span className={labelClassName()}>Nombre publico en plantilla</span>
                  <input
                    value={selectedAssignment.publicName}
                    onChange={(event) =>
                      updateAssignment(selectedAssignment.id, (assignment) => ({
                        ...assignment,
                        publicName: event.target.value,
                      }))
                    }
                    className={inputClassName()}
                  />
                </label>

                {hasLinkedPublicProfile ? (
                  <Link
                    href={`/admin/jugadores?team=${selectedTeamSlug}&player=${selectedAssignment.playerId}`}
                    className="rr-button rr-button-secondary min-h-11 justify-center text-[0.84rem]"
                  >
                    Abrir ficha publica
                  </Link>
                ) : (
                  <div className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-3 text-[0.84rem] text-[color:var(--rr-muted)]">
                    La ficha publica aparecera aqui cuando el jugador exista en el catalogo general.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-2">
                    <span className={labelClassName()}>Dorsal</span>
                    <input
                      type="number"
                      min={0}
                      value={selectedAssignment.shirtNumber}
                      onChange={(event) =>
                        updateAssignment(selectedAssignment.id, (assignment) => ({
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
                        updateAssignment(selectedAssignment.id, (assignment) => ({
                          ...assignment,
                          publicPosition: event.target.value as AdminPlayer["position"],
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
              </div>

              <div className="grid gap-2">
                {[
                  {
                    label: "Capitan",
                    active: selectedAssignment.captain,
                    onClick: () =>
                      updateAssignment(selectedAssignment.id, (assignment) => ({
                        ...assignment,
                        captain: !assignment.captain,
                      })),
                  },
                  {
                    label: "Visible en plantilla",
                    active: selectedAssignment.visible,
                    onClick: () =>
                      updateAssignment(selectedAssignment.id, (assignment) => ({
                        ...assignment,
                        visible: !assignment.visible,
                      })),
                  },
                  {
                    label: "Asignacion activa",
                    active: selectedAssignment.active,
                    onClick: () =>
                      updateAssignment(selectedAssignment.id, (assignment) => ({
                        ...assignment,
                        active: !assignment.active,
                        leftLabel: assignment.active ? "Pendiente" : undefined,
                      })),
                  },
                ].map((control) => (
                  <button
                    key={control.label}
                    type="button"
                    onClick={control.onClick}
                    className="flex min-h-11 items-center justify-between rounded-[10px] border border-white/10 bg-white/5 px-4 text-left text-[0.9rem] text-white transition hover:border-[rgba(253,203,88,0.26)]"
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
            </div>
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
                      className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-3"
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
                  <div className="rounded-[10px] border border-[rgba(151,255,199,0.2)] bg-[rgba(31,98,64,0.18)] px-4 py-3 text-[0.9rem] text-[#b8ffd8]">
                    Plantilla lista para publicarse.
                  </div>
                )}
              </div>
            </div>
          </AdminPanel>
        </div>
      </div>
    </div>
  );
}

export function AdminAssignmentsWorkspace() {
  const searchParams = useSearchParams();
  const requestedTeamSlug = searchParams.get("team");
  const initialTeamSlug =
    requestedTeamSlug && adminMockTeams.some((team) => team.slug === requestedTeamSlug)
      ? requestedTeamSlug
      : "primer-equipo";

  return (
    <AdminAssignmentsWorkspaceInner
      key={searchParams.toString()}
      initialTeamSlug={initialTeamSlug}
    />
  );
}

