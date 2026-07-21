"use server";

import { revalidatePath } from "next/cache";
import type { AdminStandingsScreenData, AdminScopedStandingTeam } from "@/server/services/admin-standings";
import {
  getAdminStandingsScope,
  getAdminStandingsScreenData,
} from "@/server/services/admin-standings";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import {
  buildStandingTableScopeWhere,
  standingTableCoversTeam,
} from "@/server/services/standing-table-sharing";
import {
  createStandingInputSchema,
  saveStandingInputSchema,
  type CreateStandingInput,
  type SaveStandingInput,
} from "@/server/validators/admin-standings";

type AdminStandingsActionResult =
  | {
      ok: true;
      data: AdminStandingsScreenData;
      selectedStandingId: string;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

function computeGoalDifference(goalsFor: number, goalsAgainst: number) {
  return goalsFor - goalsAgainst;
}

function computeStandingPoints(won: number, drawn: number, sanctionPoints: number) {
  return won * 3 + drawn - sanctionPoints;
}

function normalizeStandingRows(
  rows: SaveStandingInput["rows"],
): SaveStandingInput["rows"] {
  return rows
    .map((row) => {
      const teamName = row.teamName.trim();
      const played = Math.max(0, Math.trunc(row.played));
      const won = Math.max(0, Math.trunc(row.won));
      const drawn = Math.max(0, Math.trunc(row.drawn));
      const lost = Math.max(0, Math.trunc(row.lost));
      const sanctionPoints = Math.max(0, Math.trunc(row.sanctionPoints));
      const goalsFor = Math.max(0, Math.trunc(row.goalsFor));
      const goalsAgainst = Math.max(0, Math.trunc(row.goalsAgainst));

      return {
        ...row,
        teamName,
        played,
        won,
        drawn,
        lost,
        sanctionPoints,
        goalsFor,
        goalsAgainst,
      };
    })
    .sort((left, right) => {
      const leftPoints = computeStandingPoints(left.won, left.drawn, left.sanctionPoints);
      const rightPoints = computeStandingPoints(right.won, right.drawn, right.sanctionPoints);

      if (leftPoints !== rightPoints) {
        return rightPoints - leftPoints;
      }

      const leftGoalDifference = computeGoalDifference(left.goalsFor, left.goalsAgainst);
      const rightGoalDifference = computeGoalDifference(right.goalsFor, right.goalsAgainst);

      if (leftGoalDifference !== rightGoalDifference) {
        return rightGoalDifference - leftGoalDifference;
      }

      if (left.goalsFor !== right.goalsFor) {
        return right.goalsFor - left.goalsFor;
      }

      if (left.goalsAgainst !== right.goalsAgainst) {
        return left.goalsAgainst - right.goalsAgainst;
      }

      return left.teamName.localeCompare(right.teamName, "es");
    });
}

function buildStandingRowsSeed(clubTeams: AdminScopedStandingTeam[]) {
  const ownRows = clubTeams.map((team, index) => ({
    id: `club-${team.publicSlug}-${index + 1}`,
    teamName: team.publicName,
    teamSlug: team.publicSlug,
    crestSrc: team.logoMedia?.publicUrl ?? undefined,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    sanctionPoints: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    isOwnTeam: true,
  }));

  return ownRows;
}

function revalidateStandingPaths(teamSlugs: string[]) {
  const uniqueTeamSlugs = Array.from(new Set(teamSlugs.filter(Boolean)));

  revalidatePath("/admin");
  revalidatePath("/admin/clasificaciones");

  for (const teamSlug of uniqueTeamSlugs) {
    if (teamSlug === "primer-equipo") {
      revalidatePath("/");
      revalidatePath("/primer-equipo");
      revalidatePath("/primer-equipo/clasificacion");
      continue;
    }

    revalidatePath(`/equipos/${teamSlug}`);
    revalidatePath(`/equipos/${teamSlug}/clasificacion`);
  }
}

function findCompetitionTeams(
  teams: AdminScopedStandingTeam[],
  competition: string,
) {
  return teams.filter((team) => (team.competitionName ?? "Competicion pendiente") === competition);
}

export async function saveStandingAction(
  input: SaveStandingInput,
): Promise<AdminStandingsActionResult> {
  const user = await requireAdminSectionAccess("standings");
  const parsed = saveStandingInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar la clasificacion.",
    };
  }

  const { activeSeason, teams } = await getAdminStandingsScope(user);

  if (!activeSeason || teams.length === 0) {
    return {
      ok: false,
      message: "No hay temporada activa o no tienes equipos disponibles en este alcance.",
    };
  }

  const normalizedRows = normalizeStandingRows(parsed.data.rows);

  if (!normalizedRows.some((row) => row.isOwnTeam)) {
    return {
      ok: false,
      message: "Marca al menos un equipo del club antes de guardar.",
    };
  }

  const standing = await prisma.standingTable.findFirst({
    where: {
      id: BigInt(parsed.data.standingId),
      seasonId: activeSeason.id,
      deletedAt: null,
    },
    select: {
      id: true,
      seasonTeamId: true,
      competitionId: true,
      seasonTeam: {
        select: {
          publicSlug: true,
          competitionName: true,
        },
      },
    },
  });

  if (!standing || !teams.some((team) => standingTableCoversTeam(standing, team))) {
    return {
      ok: false,
      message: "La clasificacion ya no esta disponible para este usuario.",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.standingTable.update({
      where: {
        id: standing.id,
      },
      data: {
        publicVisible: true,
        updatedById: user.id,
      },
    });

    await tx.standingRow.deleteMany({
      where: {
        standingTableId: standing.id,
      },
    });

    await tx.standingRow.createMany({
      data: normalizedRows.map((row, index) => ({
        standingTableId: standing.id,
        position: index + 1,
        teamName: row.teamName,
        played: row.played,
        won: row.won,
        drawn: row.drawn,
        lost: row.lost,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        goalDifference: computeGoalDifference(row.goalsFor, row.goalsAgainst),
        points: computeStandingPoints(row.won, row.drawn, row.sanctionPoints),
        isOwnTeam: row.isOwnTeam,
        displayOrder: index + 1,
      })),
    });
  });

  revalidateStandingPaths([
    standing.seasonTeam.publicSlug,
    ...normalizedRows
      .filter((row) => row.isOwnTeam)
      .map((row) => row.teamSlug ?? ""),
  ]);

  const nextData = await getAdminStandingsScreenData(user);

  return {
    ok: true,
    data: nextData,
    selectedStandingId: parsed.data.standingId,
    message: "Clasificacion guardada.",
  };
}

export async function createStandingAction(
  input: CreateStandingInput,
): Promise<AdminStandingsActionResult> {
  const user = await requireAdminSectionAccess("standings");
  const parsed = createStandingInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido preparar la clasificacion.",
    };
  }

  const { activeSeason, teams } = await getAdminStandingsScope(user);

  if (!activeSeason || teams.length === 0) {
    return {
      ok: false,
      message: "No hay temporada activa o no tienes equipos disponibles en este alcance.",
    };
  }

  const currentTeams =
    parsed.data.selectionMode === "team"
      ? (() => {
          const selectedTeam = teams.find((team) => team.publicSlug === parsed.data.teamSlug);

          if (!selectedTeam) {
            return [];
          }

          if (selectedTeam.competitionId) {
            return teams.filter((team) => team.competitionId === selectedTeam.competitionId);
          }

          if (selectedTeam.competitionName) {
            return teams.filter(
              (team) => team.competitionName === selectedTeam.competitionName,
            );
          }

          return [selectedTeam];
        })()
      : findCompetitionTeams(teams, parsed.data.competition ?? "");

  if (currentTeams.length === 0) {
    return {
      ok: false,
      message: "No hay equipos del alcance actual para crear esa clasificacion.",
    };
  }

  const competitionLabel =
    parsed.data.selectionMode === "team"
      ? currentTeams[0]?.competitionName ?? "Competicion pendiente"
      : parsed.data.competition ?? "Competicion pendiente";

  const existingStanding = await prisma.standingTable.findFirst({
    where: buildStandingTableScopeWhere(activeSeason.id, currentTeams),
    orderBy: [
      {
        seasonTeam: {
          displayOrder: "asc",
        },
      },
      { updatedAt: "desc" },
      { id: "desc" },
    ],
    select: {
      id: true,
    },
  });

  if (existingStanding) {
    const nextData = await getAdminStandingsScreenData(user);

    return {
      ok: true,
      data: nextData,
      selectedStandingId: existingStanding.id.toString(),
      message: "Ya existia una clasificacion para esa seleccion. La hemos cargado.",
    };
  }

  const primaryTeam = currentTeams[0];
  const rowsSeed = buildStandingRowsSeed(currentTeams);

  const standing = await prisma.standingTable.create({
    data: {
      seasonId: activeSeason.id,
      seasonTeamId: primaryTeam.id,
      competitionId: primaryTeam.competitionId,
      title: `Clasificacion ${competitionLabel}`,
      sourceLabel: "Creada en backoffice",
      publicVisible: false,
      createdById: user.id,
      updatedById: user.id,
      rows: {
        createMany: {
          data: rowsSeed.map((row, index) => ({
            position: index + 1,
            teamName: row.teamName,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
            isOwnTeam: row.isOwnTeam,
            displayOrder: index + 1,
          })),
        },
      },
    },
    select: {
      id: true,
    },
  });

  revalidateStandingPaths(currentTeams.map((team) => team.publicSlug));

  const nextData = await getAdminStandingsScreenData(user);

  return {
    ok: true,
    data: nextData,
    selectedStandingId: standing.id.toString(),
    message: "Clasificacion creada. Ya puedes completar los datos y guardarla.",
  };
}
