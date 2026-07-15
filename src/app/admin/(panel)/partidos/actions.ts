"use server";

import { MatchStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { AdminMatchesScreenData } from "@/server/services/admin-matches";
import {
  getAdminMatchesScope,
  getAdminMatchesScreenData,
} from "@/server/services/admin-matches";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import {
  saveMatchInputSchema,
  saveQuickResultInputSchema,
  type SaveMatchInput,
  type SaveQuickResultInput,
} from "@/server/validators/admin-matches";

type AdminMatchesActionResult =
  | {
      ok: true;
      data: AdminMatchesScreenData;
      selectedMatchId?: string;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

function parseMatchdayNumber(matchday: string) {
  const numericValue = matchday.match(/\d+/)?.[0];

  if (!numericValue) {
    return null;
  }

  const parsed = Number(numericValue);
  return Number.isFinite(parsed) ? parsed : null;
}

function resolveStoredStatus(
  status: SaveMatchInput["status"],
  hasConfirmedDate: boolean,
): MatchStatus {
  if (status === "played") {
    return MatchStatus.PLAYED;
  }

  if (status === "live") {
    return MatchStatus.LIVE;
  }

  return hasConfirmedDate ? MatchStatus.SCHEDULED : MatchStatus.POSTPONED;
}

function buildDateTime(date: string, time: string) {
  if (!date) {
    return null;
  }

  return new Date(`${date}T${time || "12:00"}:00.000Z`);
}

function buildDateTimeKeepingTime(date: string, currentDateTime: Date | null) {
  if (!date) {
    return currentDateTime;
  }

  if (!currentDateTime) {
    return buildDateTime(date, "");
  }

  const hours = currentDateTime.toISOString().slice(11, 13);
  const minutes = currentDateTime.toISOString().slice(14, 16);
  return new Date(`${date}T${hours}:${minutes}:00.000Z`);
}

function buildHomeAwayScores(input: {
  isHome: boolean;
  ownScore: number | null;
  opponentScore: number | null;
}) {
  if (input.ownScore === null || input.opponentScore === null) {
    return {
      homeScore: null,
      awayScore: null,
    };
  }

  return input.isHome
    ? {
        homeScore: input.ownScore,
        awayScore: input.opponentScore,
      }
    : {
        homeScore: input.opponentScore,
        awayScore: input.ownScore,
      };
}

function revalidateMatchPaths(teamSlug: string, matchId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/partidos");
  revalidatePath("/");

  if (teamSlug === "primer-equipo") {
    revalidatePath("/primer-equipo");
    revalidatePath("/primer-equipo/calendario");

    if (matchId) {
      revalidatePath(`/primer-equipo/partidos/${matchId}`);
    }

    return;
  }

  revalidatePath("/equipos");
  revalidatePath(`/equipos/${teamSlug}`);
  revalidatePath(`/equipos/${teamSlug}/calendario`);

  if (matchId) {
    revalidatePath(`/equipos/${teamSlug}/partidos/${matchId}`);
  }
}

async function assertMatchWriteRole() {
  const user = await requireAdminSectionAccess("matches");

  return {
    user,
  };
}

export async function saveMatchAction(
  input: SaveMatchInput,
): Promise<AdminMatchesActionResult> {
  const { user } = await assertMatchWriteRole();
  const parsed = saveMatchInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar el partido.",
    };
  }

  const { activeSeason, teams } = await getAdminMatchesScope(user);

  if (!activeSeason || teams.length === 0) {
    return {
      ok: false,
      message: "No hay temporada activa o no tienes equipos disponibles en este alcance.",
    };
  }

  const payload = parsed.data;
  const targetTeam = teams.find(
    (team) => team.publicSlug === payload.teamSlug && team.season.name === activeSeason.name,
  );

  if (!targetTeam) {
    return {
      ok: false,
      message: "El equipo seleccionado ya no esta disponible en la temporada activa.",
    };
  }

  if (payload.season !== activeSeason.name) {
    return {
      ok: false,
      message: "Esta fase de partidos trabaja sobre la temporada activa actual.",
    };
  }

  if (payload.status === "live" && !targetTeam.team.isFirstTeam) {
    return {
      ok: false,
      message: "El estado en vivo solo se usa en el Primer Equipo.",
    };
  }

  if (payload.status === "played" && (payload.ownScore === null || payload.opponentScore === null)) {
    return {
      ok: false,
      message: "Introduce el marcador antes de guardar un partido jugado.",
    };
  }

  if (payload.highlightsUrl && (!targetTeam.team.isFirstTeam || payload.status !== "played")) {
    return {
      ok: false,
      message: "Los highlights solo se guardan para partidos jugados del Primer Equipo.",
    };
  }

  const nextStatus = resolveStoredStatus(payload.status, Boolean(payload.date));
  const dateTime = buildDateTime(payload.date, payload.time);
  const matchdayNumber = parseMatchdayNumber(payload.matchday);
  const { homeScore, awayScore } = buildHomeAwayScores(payload);

  if (payload.matchId) {
    const existing = await prisma.match.findFirst({
      where: {
        id: BigInt(payload.matchId),
        seasonId: activeSeason.id,
        deletedAt: null,
        seasonTeamId: {
          in: teams.map((team) => team.id),
        },
      },
      select: {
        id: true,
        seasonTeam: {
          select: {
            publicSlug: true,
          },
        },
      },
    });

    if (!existing) {
      return {
        ok: false,
        message: "El partido ya no esta disponible para este usuario.",
      };
    }

    await prisma.match.update({
      where: {
        id: existing.id,
      },
      data: {
        seasonTeamId: targetTeam.id,
        competitionId: targetTeam.competitionId,
        matchday: matchdayNumber,
        dateTime,
        venue: payload.venue,
        isHome: payload.isHome,
        opponentName: payload.opponentName,
        status: nextStatus,
        homeScore,
        awayScore,
        videoUrl: payload.highlightsUrl || null,
        videoLabel: payload.highlightsUrl ? "Highlights" : null,
        updatedById: user.id,
      },
    });

    revalidateMatchPaths(targetTeam.publicSlug, existing.id.toString());

    return {
      ok: true,
      data: await getAdminMatchesScreenData(user),
      selectedMatchId: existing.id.toString(),
      message: "Partido actualizado.",
    };
  }

  const created = await prisma.match.create({
    data: {
      seasonId: activeSeason.id,
      seasonTeamId: targetTeam.id,
      competitionId: targetTeam.competitionId,
      matchday: matchdayNumber,
      dateTime,
      venue: payload.venue,
      isHome: payload.isHome,
      opponentName: payload.opponentName,
      status: nextStatus,
      homeScore,
      awayScore,
      videoUrl: payload.highlightsUrl || null,
      videoLabel: payload.highlightsUrl ? "Highlights" : null,
      publicVisible: true,
      createdById: user.id,
      updatedById: user.id,
    },
    select: {
      id: true,
    },
  });

  revalidateMatchPaths(targetTeam.publicSlug, created.id.toString());

  return {
    ok: true,
    data: await getAdminMatchesScreenData(user),
    selectedMatchId: created.id.toString(),
    message: "Partido creado.",
  };
}

export async function saveQuickResultAction(
  input: SaveQuickResultInput,
): Promise<AdminMatchesActionResult> {
  const { user } = await assertMatchWriteRole();
  const parsed = saveQuickResultInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar el resultado.",
    };
  }

  const { activeSeason, teams } = await getAdminMatchesScope(user);

  if (!activeSeason || teams.length === 0) {
    return {
      ok: false,
      message: "No hay temporada activa o no tienes equipos disponibles en este alcance.",
    };
  }

  const existing = await prisma.match.findFirst({
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
      isHome: true,
      dateTime: true,
      seasonTeam: {
        select: {
          publicSlug: true,
        },
      },
    },
  });

  if (!existing) {
    return {
      ok: false,
      message: "El partido ya no esta disponible para este usuario.",
    };
  }

  const { homeScore, awayScore } = buildHomeAwayScores({
    isHome: existing.isHome,
    ownScore: parsed.data.ownScore,
    opponentScore: parsed.data.opponentScore,
  });

  await prisma.match.update({
    where: {
      id: existing.id,
    },
    data: {
      status: MatchStatus.PLAYED,
      homeScore,
      awayScore,
      dateTime: buildDateTimeKeepingTime(parsed.data.date, existing.dateTime),
      updatedById: user.id,
    },
  });

  revalidateMatchPaths(existing.seasonTeam.publicSlug, existing.id.toString());

  return {
    ok: true,
    data: await getAdminMatchesScreenData(user),
    selectedMatchId: existing.id.toString(),
    message: "Resultado actualizado.",
  };
}
