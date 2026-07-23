import {
  adminPlayerPositionOptions,
  type AdminPlayerPosition,
} from "@/lib/admin/player-management";
import type {
  AdminAssignmentPlayerOption,
  AdminManagedAssignment,
} from "@/lib/contracts/admin";

export type AssignmentIssue = {
  id: string;
  title: string;
  detail: string;
  tone: "gold" | "danger" | "slate";
};

export type CreateAssignmentMode = "existing" | "new";

export type CreateAssignmentDraft = {
  mode: CreateAssignmentMode;
  playerId: string;
  publicName: string;
  keepCurrentTeamsActive: boolean;
  shirtNumber: number;
  publicPosition: AdminPlayerPosition;
  captain: boolean;
  joinedAt: string;
};

export function getAssignmentPositionLabel(
  position: AdminManagedAssignment["publicPosition"],
) {
  return (
    adminPlayerPositionOptions.find((option) => option.value === position)?.label ??
    position
  );
}

export function formatAssignmentDateLabel(date: string) {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export function getSuggestedAssignmentShirtNumber(
  assignments: AdminManagedAssignment[],
) {
  const highestNumber = assignments.reduce(
    (currentHighest, assignment) =>
      Math.max(currentHighest, assignment.shirtNumber),
    0,
  );

  return highestNumber + 1;
}

export function buildCreateAssignmentDraft(
  assignments: AdminManagedAssignment[],
): CreateAssignmentDraft {
  return {
    mode: "existing",
    playerId: "",
    publicName: "",
    keepCurrentTeamsActive: false,
    shirtNumber: getSuggestedAssignmentShirtNumber(assignments),
    publicPosition: "BAN",
    captain: false,
    joinedAt: "",
  };
}

export function getAssignmentIssues(
  assignments: AdminManagedAssignment[],
): AssignmentIssue[] {
  const issues: AssignmentIssue[] = [];
  const activeAssignments = assignments.filter((assignment) => assignment.active);
  const numberCounts = new Map<number, AdminManagedAssignment[]>();

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
        detail: `${assignment.publicName} no saldra en la plantilla publica.`,
        tone: "slate",
      });
    });

  return issues;
}

export function buildAssignmentPlayerOptionLabel(
  player: AdminAssignmentPlayerOption,
) {
  const suffix = player.currentTeamName
    ? ` - ${player.currentTeamName}`
    : " - Sin equipo activo";
  return `${player.publicName}${suffix}`;
}
