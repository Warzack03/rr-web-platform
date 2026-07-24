"use server";

import { PlayerStatRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { AdminStatsScreenData } from "@/lib/admin/stats-management";
import { getAdminStatsScreenData, getAdminStatsScope } from "@/server/services/admin-stats";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import {
  saveAdminStatsInputSchema,
  type SaveAdminStatsInput,
} from "@/server/validators/admin-stats";

type AdminStatsActionResult =
  | {
      ok: true;
      data: AdminStatsScreenData;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

function isNumericId(value: string) {
  return /^\d+$/.test(value);
}

function hasStatImpact(row: SaveAdminStatsInput["rows"][number]) {
  return (
    row.played ||
    row.goals > 0 ||
    row.assists > 0 ||
    row.mvp > 0 ||
    row.yellowCards > 0 ||
    row.redCards > 0 ||
    row.recoveries > 0 ||
    row.shots > 0 ||
    row.shotsOnTarget > 0 ||
    row.ownGoals > 0 ||
    row.goalsConceded > 0 ||
    row.saves > 0 ||
    row.cleanSheets > 0
  );
}

function revalidateStatsPaths(teamSlug: string, playerSlugs: string[]) {
  revalidatePath("/admin");
  revalidatePath("/admin/estadisticas");

  if (teamSlug === "primer-equipo") {
    revalidatePath("/primer-equipo");
    revalidatePath("/primer-equipo/plantilla");
    revalidatePath("/primer-equipo/estadisticas");
  } else {
    revalidatePath(`/equipos/${teamSlug}`);
    revalidatePath(`/equipos/${teamSlug}/plantilla`);
    revalidatePath(`/equipos/${teamSlug}/estadisticas`);
  }

  for (const playerSlug of Array.from(new Set(playerSlugs.filter(Boolean)))) {
    revalidatePath(`/jugadores/${playerSlug}`);

    if (teamSlug !== "primer-equipo") {
      revalidatePath(`/equipos/${teamSlug}/jugadores/${playerSlug}`);
    }
  }
}

export async function saveAdminStatsAction(
  input: SaveAdminStatsInput,
): Promise<AdminStatsActionResult> {
  const user = await requireAdminSectionAccess("stats");
  const parsed = saveAdminStatsInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar las estadisticas.",
    };
  }

  const { activeSeason, teams } = await getAdminStatsScope(user);

  if (!activeSeason || teams.length === 0 || !isNumericId(parsed.data.matchId)) {
    return {
      ok: false,
      message: "No hay contexto valido para guardar estadisticas.",
    };
  }

  const match = await prisma.match.findFirst({
    where: {
      id: BigInt(parsed.data.matchId),
      seasonId: activeSeason.id,
      deletedAt: null,
      seasonTeamId: {
        in: teams.map((team) => team.id),
      },
    },
    select: {
      id: true,
      seasonId: true,
      seasonTeamId: true,
      seasonTeam: {
        select: {
          publicSlug: true,
        },
      },
    },
  });

  if (!match) {
    return {
      ok: false,
      message: "El partido ya no esta disponible para cargar estadisticas.",
    };
  }

  const normalizedRows = parsed.data.rows
    .filter((row) => isNumericId(row.playerId))
    .map((row) => {
      const played = row.played || hasStatImpact(row);

      return {
        ...row,
        played,
      };
    });

  if (normalizedRows.length === 0) {
    return {
      ok: false,
      message: "No hemos recibido jugadores validos para guardar.",
    };
  }

  await prisma.$transaction(async (tx) => {
    for (const row of normalizedRows) {
      const playerId = BigInt(row.playerId);
      const shouldPersist = hasStatImpact(row);

      if (!shouldPersist) {
        await tx.playerMatchStats.updateMany({
          where: {
            matchId: match.id,
            playerId,
          },
          data: {
            statRole: row.isGoalkeeper ? PlayerStatRole.GOALKEEPER : PlayerStatRole.FIELD_PLAYER,
            played: false,
            goals: 0,
            assists: 0,
            mvp: 0,
            yellowCards: 0,
            redCards: 0,
            recoveries: 0,
            shots: 0,
            shotsOnTarget: 0,
            ownGoals: 0,
            saves: 0,
            goalsAgainst: 0,
            cleanSheets: 0,
            updatedById: user.id,
          },
        });
        continue;
      }

      await tx.playerMatchStats.upsert({
        where: {
          matchId_playerId: {
            matchId: match.id,
            playerId,
          },
        },
        update: {
          statRole: row.isGoalkeeper ? PlayerStatRole.GOALKEEPER : PlayerStatRole.FIELD_PLAYER,
          played: row.played,
          goals: row.goals,
          assists: row.assists,
          mvp: row.mvp,
          yellowCards: row.yellowCards,
          redCards: row.redCards,
          recoveries: row.recoveries,
          shots: row.shots,
          shotsOnTarget: row.shotsOnTarget,
          ownGoals: row.ownGoals,
          saves: row.saves,
          goalsAgainst: row.goalsConceded,
          cleanSheets: row.cleanSheets,
          updatedById: user.id,
        },
        create: {
          matchId: match.id,
          seasonId: match.seasonId,
          seasonTeamId: match.seasonTeamId,
          playerId,
          statRole: row.isGoalkeeper ? PlayerStatRole.GOALKEEPER : PlayerStatRole.FIELD_PLAYER,
          played: row.played,
          goals: row.goals,
          assists: row.assists,
          mvp: row.mvp,
          yellowCards: row.yellowCards,
          redCards: row.redCards,
          recoveries: row.recoveries,
          shots: row.shots,
          shotsOnTarget: row.shotsOnTarget,
          ownGoals: row.ownGoals,
          saves: row.saves,
          goalsAgainst: row.goalsConceded,
          cleanSheets: row.cleanSheets,
          createdById: user.id,
          updatedById: user.id,
        },
      });
    }
  });

  const touchedPlayers = await prisma.player.findMany({
    where: {
      id: {
        in: normalizedRows.map((row) => BigInt(row.playerId)),
      },
    },
    select: {
      slug: true,
    },
  });

  revalidateStatsPaths(
    match.seasonTeam.publicSlug,
    touchedPlayers.map((player) => player.slug),
  );

  return {
    ok: true,
    data: await getAdminStatsScreenData(user),
    message: "Participacion y estadisticas del partido guardadas.",
  };
}
