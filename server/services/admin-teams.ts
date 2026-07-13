import { MatchStatus, UserRole } from "@prisma/client";
import type { TeamManagementTeam } from "@/lib/admin/team-management-mocks";
import { normalizeTeamManagementTeam } from "@/lib/admin/team-management-mocks";
import type { AuthenticatedAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export type AdminTeamsScreenData = {
  teams: TeamManagementTeam[];
  seasonOptions: string[];
  categoryOptions: string[];
  competitionOptions: string[];
};

export const DEFAULT_TEAM_CATEGORY_OPTIONS = [
  "Senior",
  "Senior B",
  "Juvenil",
  "Cadete",
  "Infantil",
  "Alevin",
  "Benjamin",
  "Prebenjamin",
] as const;

function getTeamAccent(isFirstTeam: boolean) {
  return isFirstTeam
    ? "from-[rgba(253,203,88,0.18)] to-[rgba(253,203,88,0.03)]"
    : "from-[rgba(52,112,200,0.16)] to-[rgba(255,255,255,0.02)]";
}

function formatMatchDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function mapNextMatchLabel(match: {
  dateTime: Date | null;
  opponentName: string;
  status: MatchStatus;
} | null) {
  if (!match) {
    return "Pendiente de calendario";
  }

  if (!match.dateTime) {
    return match.status === MatchStatus.POSTPONED
      ? "Aplazado"
      : `Pendiente - ${match.opponentName}`;
  }

  return `${formatMatchDate(match.dateTime)} - ${match.opponentName}`;
}

function buildScopedTeamIdsFilter(teamIds: bigint[]) {
  return teamIds.length > 0 ? { in: teamIds } : { in: [BigInt(-1)] };
}

export async function getAdminTeamsScreenData(
  user: AuthenticatedAdmin,
): Promise<AdminTeamsScreenData> {
  const assignedPermissions =
    user.role === UserRole.COACH
      ? await prisma.coachTeamPermission.findMany({
          where: {
            userId: user.id,
            active: true,
            seasonTeam: {
              deletedAt: null,
            },
          },
          select: {
            seasonTeamId: true,
          },
        })
      : [];

  const scopedTeamIds = assignedPermissions.map((permission) => permission.seasonTeamId);

  const [seasons, competitions, seasonTeams] = await Promise.all([
    prisma.season.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: [{ startDate: "desc" }, { id: "desc" }],
      select: {
        name: true,
      },
    }),
    prisma.competition.findMany({
      where: {
        season: {
          deletedAt: null,
        },
      },
      orderBy: [{ season: { startDate: "desc" } }, { name: "asc" }],
      select: {
        name: true,
      },
    }),
    prisma.seasonTeam.findMany({
      where: {
        deletedAt: null,
        season: {
          deletedAt: null,
        },
        ...(user.role === UserRole.COACH
          ? {
              id: buildScopedTeamIdsFilter(scopedTeamIds),
            }
          : {}),
      },
      orderBy: [
        { season: { startDate: "desc" } },
        { displayOrder: "asc" },
        { publicName: "asc" },
      ],
      select: {
        id: true,
        publicSlug: true,
        publicName: true,
        category: true,
        competitionName: true,
        publicVisible: true,
        active: true,
        displayOrder: true,
        season: {
          select: {
            name: true,
          },
        },
        team: {
          select: {
            isFirstTeam: true,
          },
        },
        logoMedia: {
          select: {
            id: true,
            publicUrl: true,
          },
        },
        bannerMedia: {
          select: {
            id: true,
            publicUrl: true,
          },
        },
        coaches: {
          orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
          select: {
            id: true,
            name: true,
            roleLabel: true,
            publicVisible: true,
          },
        },
        assignments: {
          where: {
            active: true,
            deletedAt: null,
          },
          select: {
            id: true,
          },
        },
        matches: {
          where: {
            deletedAt: null,
            status: {
              in: [MatchStatus.SCHEDULED, MatchStatus.LIVE, MatchStatus.POSTPONED],
            },
          },
          orderBy: [{ dateTime: "asc" }, { id: "asc" }],
          take: 1,
          select: {
            dateTime: true,
            opponentName: true,
            status: true,
          },
        },
      },
    }),
  ]);

  const mappedTeams = seasonTeams.map((seasonTeam) =>
    normalizeTeamManagementTeam({
      id: seasonTeam.id.toString(),
      slug: seasonTeam.publicSlug,
      name: seasonTeam.publicName,
      category: seasonTeam.category ?? (seasonTeam.team.isFirstTeam ? "Senior" : "Cantera"),
      competition: seasonTeam.competitionName ?? "Competicion pendiente",
      season: seasonTeam.season.name,
      branch: seasonTeam.team.isFirstTeam ? "Primer equipo" : "Cantera",
      publicVisible: seasonTeam.publicVisible,
      active: seasonTeam.active,
      isFirstTeam: seasonTeam.team.isFirstTeam,
      displayOrder: seasonTeam.displayOrder,
      coaches: seasonTeam.coaches.map((coach) => ({
        id: coach.id.toString(),
        name: coach.name,
        roleLabel: coach.roleLabel as
          | "Entrenador principal"
          | "Segundo entrenador"
          | "Ayudante",
        publicVisible: coach.publicVisible,
      })),
      logoMediaId: seasonTeam.logoMedia?.id.toString(),
      logoUrl: seasonTeam.logoMedia?.publicUrl ?? "",
      bannerMediaId: seasonTeam.bannerMedia?.id.toString(),
      bannerUrl: seasonTeam.bannerMedia?.publicUrl ?? "",
      playerCount: seasonTeam.assignments.length,
      nextMatchLabel: mapNextMatchLabel(seasonTeam.matches[0] ?? null),
      accent: getTeamAccent(seasonTeam.team.isFirstTeam),
      primaryCoach: "",
      visibleCoaches: [],
    }),
  );

  const seasonOptions = seasons.map((season) => season.name);
  const categoryOptions = Array.from(
    new Set([
      ...DEFAULT_TEAM_CATEGORY_OPTIONS,
      ...mappedTeams.map((team) => team.category).filter(Boolean),
    ]),
  );
  const competitionOptions = Array.from(
    new Set([
      ...competitions.map((competition) => competition.name),
      ...mappedTeams.map((team) => team.competition).filter(Boolean),
    ]),
  ).sort((left, right) => left.localeCompare(right, "es"));

  return {
    teams: mappedTeams,
    seasonOptions,
    categoryOptions,
    competitionOptions,
  };
}
