import type { CompetitionManagementItem } from "@/lib/admin/competition-management";
import type { AuthenticatedAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export type AdminCompetitionsScreenData = {
  competitions: CompetitionManagementItem[];
  seasonOptions: string[];
};

export async function getAdminCompetitionsScreenData(
  _user: AuthenticatedAdmin,
): Promise<AdminCompetitionsScreenData> {
  void _user;

  const [seasons, competitions] = await Promise.all([
    prisma.season.findMany({
      where: { deletedAt: null },
      orderBy: [{ startDate: "desc" }, { id: "desc" }],
      select: { name: true },
    }),
    prisma.competition.findMany({
      where: { season: { deletedAt: null } },
      orderBy: [
        { season: { startDate: "desc" } },
        { name: "asc" },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        organizer: true,
        groupName: true,
        active: true,
        season: { select: { name: true } },
        _count: {
          select: {
            seasonTeamsLinks: { where: { active: true } },
            matches: { where: { deletedAt: null } },
            standings: { where: { deletedAt: null } },
          },
        },
      },
    }),
  ]);

  return {
    seasonOptions: seasons.map((season) => season.name),
    competitions: competitions.map((competition) => ({
      id: competition.id.toString(),
      season: competition.season.name,
      name: competition.name,
      slug: competition.slug,
      organizer: competition.organizer ?? "",
      groupName: competition.groupName ?? "",
      active: competition.active,
      teamCount: competition._count.seasonTeamsLinks,
      matchCount: competition._count.matches,
      standingCount: competition._count.standings,
    })),
  };
}

