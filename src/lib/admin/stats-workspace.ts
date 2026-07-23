import type { AdminMatchPlayerEntry } from "@/lib/admin/admin-stats";
import {
  buildStatsContextPlayerId,
  type AdminStatsCatalogPlayer,
  type AdminStatsPlayerContext,
} from "@/lib/admin/stats-management";

export type AdminStatsScreenState = "loading" | "ready" | "error";
export type MobileStatsSection = "outfield" | "goalkeepers";
export type MobileStatsViewMode = "list" | "focused";
export type MobilePlayerReviewState = "pending" | "reviewed" | "edited";
export type VisibleStatsPlayer = AdminStatsPlayerContext;

export function getStatsStatusBadge(status: "pending" | "live" | "played") {
  if (status === "live") {
    return { label: "En vivo", tone: "danger" as const, pulse: true };
  }

  if (status === "played") {
    return { label: "Jugado", tone: "success" as const, pulse: false };
  }

  return { label: "Pendiente", tone: "gold" as const, pulse: false };
}

export function formatStatsSavedTime(value: Date | null) {
  if (!value) {
    return "Aun sin guardar";
  }

  return value.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function areAdminMatchEntriesEqual(
  left: AdminMatchPlayerEntry,
  right: AdminMatchPlayerEntry,
) {
  return (
    left.played === right.played &&
    left.goals === right.goals &&
    left.assists === right.assists &&
    left.mvp === right.mvp &&
    left.yellowCards === right.yellowCards &&
    left.redCards === right.redCards &&
    left.recoveries === right.recoveries &&
    left.shots === right.shots &&
    left.shotsOnTarget === right.shotsOnTarget &&
    left.ownGoals === right.ownGoals &&
    left.goalsConceded === right.goalsConceded &&
    left.saves === right.saves &&
    left.cleanSheets === right.cleanSheets
  );
}

export function createGuestStatsPlayerContext(
  player: AdminStatsCatalogPlayer,
  targetTeamSlug: string,
  targetTeamName: string,
): VisibleStatsPlayer {
  return {
    ...player,
    id: buildStatsContextPlayerId(targetTeamSlug, player.sourcePlayerId),
    teamSlug: targetTeamSlug,
    minutes: 0,
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    mvp: 0,
    goalsConceded: 0,
    saves: 0,
    cleanSheets: 0,
    recoveries: 0,
    shots: 0,
    shotsOnTarget: 0,
    ownGoals: 0,
    advancedLabel: undefined,
    sourcePlayerId: player.sourcePlayerId,
    contextType: "guest",
    originTeamSlug: player.teamSlug,
    originTeamName: player.teamName || targetTeamName,
  };
}
