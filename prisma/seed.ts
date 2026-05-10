import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
  ImportStatus,
  MatchStatus,
  NewsStatus,
  PlayerStatRole,
  PrismaClient,
  SeasonStatus,
  UserRole,
} from "@prisma/client";
import { getRuntimeDatabaseConfig } from "../server/db/runtime-config";

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(getRuntimeDatabaseConfig()),
});

const DEFAULT_DEMO_PASSWORD = "ChangeMe123!";
const IMPORT_SOURCE = "seed";

const adminSeed = {
  email: process.env.ADMIN_INITIAL_EMAIL ?? "admin@risingraimon.local",
  username: process.env.ADMIN_INITIAL_USERNAME ?? "superadmin",
  displayName: process.env.ADMIN_INITIAL_DISPLAY_NAME ?? "Superadmin Inicial",
  password: process.env.ADMIN_INITIAL_PASSWORD ?? DEFAULT_DEMO_PASSWORD,
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const [superadminPasswordHash, demoPasswordHash] = await Promise.all([
    bcrypt.hash(adminSeed.password, 10),
    bcrypt.hash(DEFAULT_DEMO_PASSWORD, 10),
  ]);

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
    await tx.user.deleteMany();

    const [superadmin, manager, coach] = await Promise.all([
      tx.user.create({
        data: {
          email: adminSeed.email,
          username: adminSeed.username,
          passwordHash: superadminPasswordHash,
          displayName: adminSeed.displayName,
          role: UserRole.SUPERADMIN,
        },
      }),
      tx.user.create({
        data: {
          email: "manager@risingraimon.local",
          username: "manager",
          passwordHash: demoPasswordHash,
          displayName: "Manager Demo",
          role: UserRole.MANAGER,
        },
      }),
      tx.user.create({
        data: {
          email: "entrenador_primer_equipo@risingraimon.local",
          username: "entrenador_primer_equipo",
          passwordHash: demoPasswordHash,
          displayName: "Entrenador Primer Equipo",
          role: UserRole.COACH,
        },
      }),
    ]);

    const importBatch = await tx.importBatch.create({
      data: {
        sourceSystem: IMPORT_SOURCE,
        status: ImportStatus.APPLIED,
        fileName: "local-seed",
        fileHash: "seed-v1",
        createdById: superadmin.id,
        validatedAt: new Date("2026-05-10T09:00:00.000Z"),
        appliedAt: new Date("2026-05-10T09:05:00.000Z"),
        summaryJson: {
          seeded: true,
          note: "Deterministic local seed data for development only.",
        },
      },
    });

    const season = await tx.season.create({
      data: {
        name: "2026/2027",
        slug: "2026-2027",
        startDate: new Date("2026-09-01"),
        endDate: new Date("2027-06-30"),
        status: SeasonStatus.CURRENT,
        activeKey: "CURRENT",
        sourceSystem: IMPORT_SOURCE,
        sourceExternalId: "season-2026-2027",
        lastImportBatchId: importBatch.id,
      },
    });

    await tx.siteSettings.create({
      data: {
        activeSeasonId: season.id,
        publicSiteName: "Rising Raimon",
        shopUrl: "https://tienda.risingraimon.es",
      },
    });

    const [primerEquipo, juvenilA, cadeteA] = await Promise.all([
      tx.team.create({
        data: {
          code: "PRIMER_EQUIPO",
          name: "Primer Equipo",
          slug: "primer-equipo",
          branch: "MADRID",
          displayOrder: 1,
          active: true,
          isFirstTeam: true,
          sourceSystem: IMPORT_SOURCE,
          sourceExternalId: "team-1",
          lastImportBatchId: importBatch.id,
        },
      }),
      tx.team.create({
        data: {
          code: "JUVENIL_A",
          name: "Juvenil A",
          slug: "juvenil-a",
          branch: "MADRID",
          displayOrder: 2,
          active: true,
          isFirstTeam: false,
          sourceSystem: IMPORT_SOURCE,
          sourceExternalId: "team-2",
          lastImportBatchId: importBatch.id,
        },
      }),
      tx.team.create({
        data: {
          code: "CADETE_A",
          name: "Cadete A",
          slug: "cadete-a",
          branch: "MADRID",
          displayOrder: 3,
          active: true,
          isFirstTeam: false,
          sourceSystem: IMPORT_SOURCE,
          sourceExternalId: "team-3",
          lastImportBatchId: importBatch.id,
        },
      }),
    ]);

    const [competitionPrimer, competitionJuvenil, competitionCadete] = await Promise.all([
      tx.competition.create({
        data: {
          seasonId: season.id,
          name: "Liga Autonomica Senior",
          slug: "liga-autonomica-senior",
          organizer: "RFFM",
          groupName: "Grupo 2",
        },
      }),
      tx.competition.create({
        data: {
          seasonId: season.id,
          name: "Liga Juvenil Preferente",
          slug: "liga-juvenil-preferente",
          organizer: "RFFM",
          groupName: "Grupo 4",
        },
      }),
      tx.competition.create({
        data: {
          seasonId: season.id,
          name: "Liga Cadete Municipal",
          slug: "liga-cadete-municipal",
          organizer: "Liga Municipal",
          groupName: "Grupo 1",
        },
      }),
    ]);

    const [primerSeasonTeam, juvenilSeasonTeam, cadeteSeasonTeam] = await Promise.all([
      tx.seasonTeam.create({
        data: {
          seasonId: season.id,
          teamId: primerEquipo.id,
          competitionId: competitionPrimer.id,
          publicName: "Primer Equipo",
          publicSlug: "primer-equipo",
          category: "Senior",
          competitionName: competitionPrimer.name,
          description: "Equipo demo del primer equipo para desarrollo local.",
          publicVisible: true,
          displayOrder: 1,
          active: true,
          sourceSystem: IMPORT_SOURCE,
          sourceExternalId: "season-team-1",
          lastImportBatchId: importBatch.id,
          createdById: superadmin.id,
          updatedById: superadmin.id,
        },
      }),
      tx.seasonTeam.create({
        data: {
          seasonId: season.id,
          teamId: juvenilA.id,
          competitionId: competitionJuvenil.id,
          publicName: "Juvenil A",
          publicSlug: "juvenil-a",
          category: "Juvenil",
          competitionName: competitionJuvenil.name,
          description: "Equipo juvenil demo para pruebas funcionales.",
          publicVisible: true,
          displayOrder: 2,
          active: true,
          sourceSystem: IMPORT_SOURCE,
          sourceExternalId: "season-team-2",
          lastImportBatchId: importBatch.id,
          createdById: manager.id,
          updatedById: manager.id,
        },
      }),
      tx.seasonTeam.create({
        data: {
          seasonId: season.id,
          teamId: cadeteA.id,
          competitionId: competitionCadete.id,
          publicName: "Cadete A",
          publicSlug: "cadete-a",
          category: "Cadete",
          competitionName: competitionCadete.name,
          description: "Equipo cadete demo para seed local.",
          publicVisible: true,
          displayOrder: 3,
          active: true,
          sourceSystem: IMPORT_SOURCE,
          sourceExternalId: "season-team-3",
          lastImportBatchId: importBatch.id,
          createdById: manager.id,
          updatedById: manager.id,
        },
      }),
    ]);

    await tx.coachTeamPermission.create({
      data: {
        userId: coach.id,
        seasonTeamId: primerSeasonTeam.id,
        active: true,
        createdById: superadmin.id,
      },
    });

    await tx.teamCoach.createMany({
      data: [
        {
          seasonTeamId: primerSeasonTeam.id,
          userId: coach.id,
          name: "Marcos Varela",
          roleLabel: "Entrenador",
          publicVisible: true,
          displayOrder: 1,
        },
        {
          seasonTeamId: primerSeasonTeam.id,
          name: "Lucia Serrano",
          roleLabel: "Segundo entrenador",
          publicVisible: true,
          displayOrder: 2,
        },
        {
          seasonTeamId: primerSeasonTeam.id,
          name: "Diego Roman",
          roleLabel: "Delegado",
          publicVisible: true,
          displayOrder: 3,
        },
      ],
    });

    const playerSeeds = [
      {
        sourceExternalId: "player-1",
        firstName: "Iker",
        lastName: "Morales",
        publicName: "Iker",
        countryCode: "ES",
        preferredFoot: "RIGHT",
        team: "primer",
        shirtNumber: 1,
        primaryPosition: "GOALKEEPER",
        statRole: PlayerStatRole.GOALKEEPER,
      },
      {
        sourceExternalId: "player-2",
        firstName: "Mateo",
        lastName: "Silva",
        publicName: "Mateo Silva",
        countryCode: "PT",
        preferredFoot: "RIGHT",
        team: "primer",
        shirtNumber: 4,
        primaryPosition: "DEFENDER",
        statRole: PlayerStatRole.FIELD_PLAYER,
      },
      {
        sourceExternalId: "player-3",
        firstName: "Sergio",
        lastName: "Lopez",
        publicName: "Sergio",
        countryCode: "ES",
        preferredFoot: "LEFT",
        team: "primer",
        shirtNumber: 8,
        primaryPosition: "MIDFIELDER",
        statRole: PlayerStatRole.FIELD_PLAYER,
      },
      {
        sourceExternalId: "player-4",
        firstName: "Nico",
        lastName: "Paredes",
        publicName: "Nico",
        countryCode: "AR",
        preferredFoot: "RIGHT",
        team: "primer",
        shirtNumber: 9,
        primaryPosition: "FORWARD",
        statRole: PlayerStatRole.FIELD_PLAYER,
      },
      {
        sourceExternalId: "player-5",
        firstName: "Adrian",
        lastName: "Reyes",
        publicName: "Adrian",
        countryCode: "ES",
        preferredFoot: "RIGHT",
        team: "juvenil",
        shirtNumber: 1,
        primaryPosition: "GOALKEEPER",
        statRole: PlayerStatRole.GOALKEEPER,
      },
      {
        sourceExternalId: "player-6",
        firstName: "Hugo",
        lastName: "Martin",
        publicName: "Hugo Martin",
        countryCode: "ES",
        preferredFoot: "LEFT",
        team: "juvenil",
        shirtNumber: 7,
        primaryPosition: "FORWARD",
        statRole: PlayerStatRole.FIELD_PLAYER,
      },
      {
        sourceExternalId: "player-7",
        firstName: "Leo",
        lastName: "Santos",
        publicName: "Leo",
        countryCode: "BR",
        preferredFoot: "RIGHT",
        team: "juvenil",
        shirtNumber: 10,
        primaryPosition: "MIDFIELDER",
        statRole: PlayerStatRole.FIELD_PLAYER,
      },
      {
        sourceExternalId: "player-8",
        firstName: "Pablo",
        lastName: "Navarro",
        publicName: "Pablo",
        countryCode: "ES",
        preferredFoot: "RIGHT",
        team: "cadete",
        shirtNumber: 5,
        primaryPosition: "DEFENDER",
        statRole: PlayerStatRole.FIELD_PLAYER,
      },
      {
        sourceExternalId: "player-9",
        firstName: "Youssef",
        lastName: "Bennani",
        publicName: "Youssef",
        countryCode: "MA",
        preferredFoot: "LEFT",
        team: "cadete",
        shirtNumber: 11,
        primaryPosition: "FORWARD",
        statRole: PlayerStatRole.FIELD_PLAYER,
      },
      {
        sourceExternalId: "player-10",
        firstName: "Gael",
        lastName: "Ruiz",
        publicName: "Gael",
        countryCode: "ES",
        preferredFoot: "RIGHT",
        team: "cadete",
        shirtNumber: 13,
        primaryPosition: "GOALKEEPER",
        statRole: PlayerStatRole.GOALKEEPER,
      },
    ] as const;

    const teamMap = {
      primer: primerSeasonTeam,
      juvenil: juvenilSeasonTeam,
      cadete: cadeteSeasonTeam,
    } as const;

    const players = [];

    for (const seed of playerSeeds) {
      const player = await tx.player.create({
        data: {
          firstName: seed.firstName,
          lastName: seed.lastName,
          publicName: seed.publicName,
          slug: slugify(`${seed.firstName}-${seed.lastName}`),
          countryCode: seed.countryCode,
          preferredFoot: seed.preferredFoot,
          active: true,
          publicVisible: true,
          sourceSystem: IMPORT_SOURCE,
          sourceExternalId: seed.sourceExternalId,
          lastImportBatchId: importBatch.id,
          createdById: manager.id,
          updatedById: manager.id,
        },
      });

      await tx.playerSeasonProfile.create({
        data: {
          playerId: player.id,
          seasonId: season.id,
          primaryPosition: seed.primaryPosition,
          publicPosition: seed.primaryPosition,
          sourceSystem: IMPORT_SOURCE,
          sourceExternalId: `${seed.sourceExternalId}-${season.name}`,
          lastImportBatchId: importBatch.id,
        },
      });

      const assignedTeam = teamMap[seed.team];

      await tx.teamPlayerAssignment.create({
        data: {
          playerId: player.id,
          seasonTeamId: assignedTeam.id,
          seasonId: season.id,
          shirtNumber: seed.shirtNumber,
          position: seed.primaryPosition,
          isPrimary: true,
          isManualException: false,
          isCaptain: seed.sourceExternalId === "player-2",
          displayOrder: seed.shirtNumber,
          active: true,
          joinedAt: new Date("2026-09-01"),
          sourceSystem: IMPORT_SOURCE,
          sourceExternalId: `assignment-${seed.sourceExternalId}`,
          lastImportBatchId: importBatch.id,
          createdById: manager.id,
          updatedById: manager.id,
        },
      });

      players.push({ ...seed, id: player.id });
    }

    const firstTeamPlayed = await tx.match.create({
      data: {
        seasonId: season.id,
        seasonTeamId: primerSeasonTeam.id,
        competitionId: competitionPrimer.id,
        matchday: 4,
        dateTime: new Date("2026-10-01T18:30:00.000Z"),
        venue: "Campo Municipal Norte",
        isHome: true,
        opponentName: "Union Deportiva Vallecas",
        status: MatchStatus.PLAYED,
        homeScore: 3,
        awayScore: 1,
        summary: "Victoria solida con gran segunda parte.",
        publicVisible: true,
        createdById: coach.id,
        updatedById: coach.id,
      },
    });

    const firstTeamScheduled = await tx.match.create({
      data: {
        seasonId: season.id,
        seasonTeamId: primerSeasonTeam.id,
        competitionId: competitionPrimer.id,
        matchday: 5,
        dateTime: new Date("2026-10-08T17:00:00.000Z"),
        venue: "Ciudad Deportiva Sur",
        isHome: false,
        opponentName: "CD Hortaleza",
        status: MatchStatus.SCHEDULED,
        publicVisible: true,
        createdById: coach.id,
        updatedById: coach.id,
      },
    });

    const firstTeamVideoMatch = await tx.match.create({
      data: {
        seasonId: season.id,
        seasonTeamId: primerSeasonTeam.id,
        competitionId: competitionPrimer.id,
        matchday: 6,
        dateTime: new Date("2026-10-15T18:00:00.000Z"),
        venue: "Campo Rising Raimon",
        isHome: true,
        opponentName: "Escuela Sur Madrid",
        status: MatchStatus.PLAYED,
        homeScore: 2,
        awayScore: 2,
        summary: "Empate intenso con remontada final.",
        videoUrl: "https://www.youtube.com/watch?v=demo-primer-equipo",
        videoLabel: "Resumen del partido",
        publicVisible: true,
        createdById: coach.id,
        updatedById: coach.id,
      },
    });

    const juvenilPostponed = await tx.match.create({
      data: {
        seasonId: season.id,
        seasonTeamId: juvenilSeasonTeam.id,
        competitionId: competitionJuvenil.id,
        matchday: 3,
        dateTime: new Date("2026-10-03T10:00:00.000Z"),
        venue: "Polideportivo Este",
        isHome: true,
        opponentName: "Escuela Futbol Retiro",
        status: MatchStatus.POSTPONED,
        summary: "Aplazado por condiciones meteorologicas.",
        publicVisible: true,
        createdById: manager.id,
        updatedById: manager.id,
      },
    });

    const firstTeamStatsPlayers = players.filter((player) => player.team === "primer");
    const juvenilStatsPlayers = players.filter((player) => player.team === "juvenil");

    await tx.playerMatchStats.createMany({
      data: [
        {
          matchId: firstTeamPlayed.id,
          seasonId: season.id,
          seasonTeamId: primerSeasonTeam.id,
          playerId: firstTeamStatsPlayers[0].id,
          statRole: PlayerStatRole.GOALKEEPER,
          played: true,
          saves: 5,
          goalsAgainst: 1,
          cleanSheets: 0,
          shotsOnTargetAgainst: 6,
          createdById: coach.id,
          updatedById: coach.id,
        },
        {
          matchId: firstTeamPlayed.id,
          seasonId: season.id,
          seasonTeamId: primerSeasonTeam.id,
          playerId: firstTeamStatsPlayers[1].id,
          statRole: PlayerStatRole.FIELD_PLAYER,
          played: true,
          goals: 1,
          assists: 0,
          yellowCards: 1,
          recoveries: 11,
          shots: 1,
          shotsOnTarget: 1,
          createdById: coach.id,
          updatedById: coach.id,
        },
        {
          matchId: firstTeamPlayed.id,
          seasonId: season.id,
          seasonTeamId: primerSeasonTeam.id,
          playerId: firstTeamStatsPlayers[2].id,
          statRole: PlayerStatRole.FIELD_PLAYER,
          played: true,
          goals: 0,
          assists: 2,
          recoveries: 9,
          shots: 3,
          shotsOnTarget: 2,
          createdById: coach.id,
          updatedById: coach.id,
        },
        {
          matchId: firstTeamPlayed.id,
          seasonId: season.id,
          seasonTeamId: primerSeasonTeam.id,
          playerId: firstTeamStatsPlayers[3].id,
          statRole: PlayerStatRole.FIELD_PLAYER,
          played: true,
          goals: 2,
          assists: 0,
          shots: 5,
          shotsOnTarget: 3,
          ownGoals: 0,
          createdById: coach.id,
          updatedById: coach.id,
        },
        {
          matchId: firstTeamVideoMatch.id,
          seasonId: season.id,
          seasonTeamId: primerSeasonTeam.id,
          playerId: firstTeamStatsPlayers[3].id,
          statRole: PlayerStatRole.FIELD_PLAYER,
          played: true,
          goals: 1,
          assists: 1,
          shots: 4,
          shotsOnTarget: 2,
          createdById: coach.id,
          updatedById: coach.id,
        },
        {
          matchId: juvenilPostponed.id,
          seasonId: season.id,
          seasonTeamId: juvenilSeasonTeam.id,
          playerId: juvenilStatsPlayers[0].id,
          statRole: PlayerStatRole.GOALKEEPER,
          played: false,
          goalsAgainst: 0,
          cleanSheets: 0,
          createdById: manager.id,
          updatedById: manager.id,
        },
        {
          matchId: juvenilPostponed.id,
          seasonId: season.id,
          seasonTeamId: juvenilSeasonTeam.id,
          playerId: juvenilStatsPlayers[1].id,
          statRole: PlayerStatRole.FIELD_PLAYER,
          played: false,
          goals: 0,
          assists: 0,
          createdById: manager.id,
          updatedById: manager.id,
        },
      ],
    });

    const standingTable = await tx.standingTable.create({
      data: {
        seasonId: season.id,
        seasonTeamId: primerSeasonTeam.id,
        competitionId: competitionPrimer.id,
        title: "Clasificacion Liga Autonomica Senior",
        sourceLabel: "Manual MVP",
        updatedLabel: "Actualizado tras jornada 6",
        publicVisible: true,
        createdById: manager.id,
        updatedById: manager.id,
      },
    });

    await tx.standingRow.createMany({
      data: [
        {
          standingTableId: standingTable.id,
          position: 1,
          teamName: "Rising Raimon",
          played: 6,
          won: 5,
          drawn: 1,
          lost: 0,
          goalsFor: 15,
          goalsAgainst: 5,
          goalDifference: 10,
          points: 16,
          isOwnTeam: true,
          displayOrder: 1,
        },
        {
          standingTableId: standingTable.id,
          position: 2,
          teamName: "Union Deportiva Vallecas",
          played: 6,
          won: 4,
          drawn: 1,
          lost: 1,
          goalsFor: 12,
          goalsAgainst: 7,
          goalDifference: 5,
          points: 13,
          isOwnTeam: false,
          displayOrder: 2,
        },
        {
          standingTableId: standingTable.id,
          position: 3,
          teamName: "CD Hortaleza",
          played: 6,
          won: 4,
          drawn: 0,
          lost: 2,
          goalsFor: 10,
          goalsAgainst: 8,
          goalDifference: 2,
          points: 12,
          isOwnTeam: false,
          displayOrder: 3,
        },
        {
          standingTableId: standingTable.id,
          position: 4,
          teamName: "Escuela Sur Madrid",
          played: 6,
          won: 3,
          drawn: 1,
          lost: 2,
          goalsFor: 9,
          goalsAgainst: 9,
          goalDifference: 0,
          points: 10,
          isOwnTeam: false,
          displayOrder: 4,
        },
        {
          standingTableId: standingTable.id,
          position: 5,
          teamName: "Atletico Canillejas",
          played: 6,
          won: 2,
          drawn: 1,
          lost: 3,
          goalsFor: 7,
          goalsAgainst: 10,
          goalDifference: -3,
          points: 7,
          isOwnTeam: false,
          displayOrder: 5,
        },
      ],
    });

    const publishedNews = await tx.newsPost.create({
      data: {
        title: "Rising Raimon arranca la temporada con paso firme",
        slug: "rising-raimon-arranca-la-temporada",
        excerpt: "El Primer Equipo suma buenas sensaciones en el inicio del curso 2026/2027.",
        bodyMarkdown:
          "El proyecto deportivo sigue creciendo y el Primer Equipo ha comenzado la temporada con una identidad muy reconocible.",
        status: NewsStatus.PUBLISHED,
        featured: true,
        publishedAt: new Date("2026-10-02T08:00:00.000Z"),
        authorId: manager.id,
        createdById: manager.id,
        updatedById: manager.id,
      },
    });

    await tx.newsPost.create({
      data: {
        title: "Sesion fotografica de cantera",
        slug: "sesion-fotografica-cantera",
        excerpt: "Borrador interno para preparar cromos y retratos de cantera.",
        bodyMarkdown:
          "Contenido de ejemplo en borrador para validar flujos editoriales sin depender de datos reales.",
        status: NewsStatus.DRAFT,
        featured: false,
        authorId: manager.id,
        createdById: manager.id,
        updatedById: manager.id,
      },
    });

    const teamVideoNews = await tx.newsPost.create({
      data: {
        title: "El Juvenil A ya tiene resumen en video",
        slug: "juvenil-a-resumen-en-video",
        excerpt: "Publicacion de prueba enlazada al Juvenil A con video externo.",
        bodyMarkdown:
          "Esta noticia demuestra la relacion entre equipos y noticias con soporte para video externo en MVP.",
        externalVideoUrl: "https://www.youtube.com/watch?v=demo-juvenil-a",
        status: NewsStatus.PUBLISHED,
        featured: false,
        publishedAt: new Date("2026-10-04T12:00:00.000Z"),
        authorId: manager.id,
        createdById: manager.id,
        updatedById: manager.id,
      },
    });

    await tx.newsPostTeam.createMany({
      data: [
        {
          newsPostId: publishedNews.id,
          seasonTeamId: primerSeasonTeam.id,
        },
        {
          newsPostId: teamVideoNews.id,
          seasonTeamId: juvenilSeasonTeam.id,
        },
      ],
    });

    await tx.importBatchItem.createMany({
      data: [
        {
          importBatchId: importBatch.id,
          entityType: "season",
          sourceExternalId: season.sourceExternalId,
          action: "CREATE",
          status: "APPLIED",
          message: "Seed season created",
          appliedAt: importBatch.appliedAt,
        },
        {
          importBatchId: importBatch.id,
          entityType: "team",
          sourceExternalId: primerEquipo.sourceExternalId,
          action: "CREATE",
          status: "APPLIED",
          message: "Seed first team created",
          appliedAt: importBatch.appliedAt,
        },
        {
          importBatchId: importBatch.id,
          entityType: "player",
          sourceExternalId: players[0].sourceExternalId,
          action: "CREATE",
          status: "APPLIED",
          message: "Seed player created",
          appliedAt: importBatch.appliedAt,
        },
      ],
    });

    void firstTeamScheduled;
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
