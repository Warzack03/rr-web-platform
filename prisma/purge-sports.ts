import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import { getRuntimeDatabaseConfig } from "../server/db/runtime-config";

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(getRuntimeDatabaseConfig()),
});

const countQueries = {
  newsPostTeams: () => prisma.newsPostTeam.count(),
  newsPosts: () => prisma.newsPost.count(),
  playerMatchStats: () => prisma.playerMatchStats.count(),
  standingRows: () => prisma.standingRow.count(),
  standingTables: () => prisma.standingTable.count(),
  matches: () => prisma.match.count(),
  teamCoaches: () => prisma.teamCoach.count(),
  coachTeamPermissions: () => prisma.coachTeamPermission.count(),
  teamPlayerAssignments: () => prisma.teamPlayerAssignment.count(),
  playerSeasonProfiles: () => prisma.playerSeasonProfile.count(),
  seasonTeams: () => prisma.seasonTeam.count(),
  competitions: () => prisma.competition.count(),
  players: () => prisma.player.count(),
  teams: () => prisma.team.count(),
  seasons: () => prisma.season.count(),
  importBatchItems: () => prisma.importBatchItem.count(),
  importBatches: () => prisma.importBatch.count(),
  mediaAssets: () => prisma.mediaAsset.count(),
  siteSettings: () => prisma.siteSettings.count(),
  users: () => prisma.user.count(),
} as const;

async function collectCounts() {
  const entries = await Promise.all(
    Object.entries(countQueries).map(async ([key, query]) => [key, await query()] as const),
  );

  return Object.fromEntries(entries) as Record<keyof typeof countQueries, number>;
}

async function main() {
  const before = await collectCounts();

  await prisma.$transaction(async (tx) => {
    await tx.newsPostTeam.deleteMany();
    await tx.playerMatchStats.deleteMany();
    await tx.standingRow.deleteMany();
    await tx.standingTable.deleteMany();
    await tx.match.deleteMany();
    await tx.teamCoach.deleteMany();
    await tx.coachTeamPermission.deleteMany();
    await tx.teamPlayerAssignment.deleteMany();
    await tx.playerSeasonProfile.deleteMany();
    await tx.newsPost.deleteMany();
    await tx.siteSettings.deleteMany();
    await tx.competition.deleteMany();
    await tx.seasonTeam.deleteMany();
    await tx.player.deleteMany();
    await tx.team.deleteMany();
    await tx.importBatchItem.deleteMany();
    await tx.importBatch.deleteMany();
    await tx.season.deleteMany();
    await tx.mediaAsset.deleteMany();
  });

  const after = await collectCounts();

  console.log(
    JSON.stringify(
      {
        ok: true,
        operation: "sports-purge",
        preserved: {
          users: after.users,
        },
        before,
        after,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error("[db:purge:sports] Failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
