import type { AdminPlayerPosition } from "@/lib/admin/mock-data";

export type AssignmentSource = "imported" | "manual";

export type AdminManagedAssignment = {
  id: string;
  playerId: string;
  playerSlug: string;
  teamId: string;
  teamSlug: string;
  teamName: string;
  season: string;
  publicName: string;
  shirtNumber: number;
  publicPosition: AdminPlayerPosition;
  captain: boolean;
  visible: boolean;
  active: boolean;
  source: AssignmentSource;
  hasPhoto: boolean;
  joinedAt: string;
  joinedLabel: string;
  leftAt: string;
  leftLabel?: string;
};

export type AdminAssignmentTeam = {
  id: string;
  slug: string;
  name: string;
  competition: string;
  season: string;
  isFirstTeam: boolean;
};

export type AdminAssignmentPlayerOption = {
  id: string;
  publicName: string;
  slug: string;
  visible: boolean;
  active: boolean;
  hasPhoto: boolean;
  currentTeamSlugs: string[];
  currentTeamSlug?: string;
  currentTeamName?: string;
};

export function toDateInputValue(date: Date | null | undefined) {
  if (!date) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function formatAdminDateLabel(date: Date | null | undefined) {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
