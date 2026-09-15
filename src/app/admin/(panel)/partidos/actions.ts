"use server";

import { MatchStatus, MediaType, MediaUsage } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { AdminMatchesScreenData } from "@/server/services/admin-matches";
import {
  getAdminMatchesScope,
  getAdminMatchesScreenData,
} from "@/server/services/admin-matches";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { buildOpponentSlug } from "@/lib/admin/opponent-management";
import { buildVenueSlug } from "@/lib/admin/venue-management";
import {
  buildMadridDateTime,
  formatMadridTimeInput,
} from "@/lib/date-time/madrid";
import {
  saveMatchInputSchema,
  saveOpponentInputSchema,
  saveQuickResultInputSchema,
  saveVenueInputSchema,
  type SaveMatchInput,
  type SaveOpponentInput,
  type SaveQuickResultInput,
  type SaveVenueInput,
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
  return buildMadridDateTime(date, time || "12:00");
}

function buildDateTimeKeepingTime(date: string, currentDateTime: Date | null) {
  if (!date) {
    return currentDateTime;
  }

  if (!currentDateTime) {
    return buildDateTime(date, "");
  }

  return buildMadridDateTime(date, formatMadridTimeInput(currentDateTime));
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

export async function saveOpponentAction(
  input: SaveOpponentInput,
): Promise<AdminMatchesActionResult> {
  const { user } = await assertMatchWriteRole();
  const parsed = saveOpponentInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar el rival.",
    };
  }

  const { activeSeason, teams } = await getAdminMatchesScope(user);

  if (!activeSeason) {
    return { ok: false, message: "No hay una temporada activa." };
  }

  const payload = parsed.data;
  const competitionId = BigInt(payload.competitionId);
  const scopedCompetitionIds = new Set(
    teams.map((team) => team.competitionId?.toString()).filter(Boolean),
  );

  if (!scopedCompetitionIds.has(payload.competitionId)) {
    return { ok: false, message: "La competicion no esta disponible en la temporada activa." };
  }

  const logoMediaId = payload.logoMediaId ? BigInt(payload.logoMediaId) : null;

  if (logoMediaId) {
    const logo = await prisma.mediaAsset.findFirst({
      where: {
        id: logoMediaId,
        deletedAt: null,
        type: MediaType.IMAGE,
        usage: MediaUsage.OPPONENT_LOGO,
      },
      select: { id: true },
    });

    if (!logo) {
      return { ok: false, message: "Selecciona un escudo de rival valido." };
    }
  }

  const slug = buildOpponentSlug(payload.name);
  const currentId = payload.opponentId ? BigInt(payload.opponentId) : null;
  const duplicate = await prisma.opponent.findFirst({
    where: {
      competitionId,
      slug,
      deletedAt: null,
      ...(currentId ? { id: { not: currentId } } : {}),
    },
    select: { id: true },
  });

  if (duplicate) {
    return { ok: false, message: "Ya existe un rival con ese nombre en la competicion." };
  }

  const previous = currentId
    ? await prisma.opponent.findFirst({
        where: { id: currentId, competitionId, deletedAt: null },
        select: { id: true, name: true },
      })
    : null;

  if (currentId && !previous) {
    return { ok: false, message: "El rival ya no esta disponible." };
  }

  const opponent = await prisma.$transaction(async (tx) => {
    const saved = previous
      ? await tx.opponent.update({
          where: { id: previous.id },
          data: {
            name: payload.name,
            slug,
            logoMediaId,
            active: payload.active,
          },
          select: { id: true },
        })
      : await tx.opponent.create({
          data: {
            competitionId,
            name: payload.name,
            slug,
            logoMediaId,
            active: payload.active,
          },
          select: { id: true },
        });

    const legacyName = previous?.name ?? payload.name;

    await tx.match.updateMany({
      where: {
        competitionId,
        OR: [{ opponentId: saved.id }, { opponentId: null, opponentName: legacyName }],
      },
      data: { opponentId: saved.id, opponentName: payload.name },
    });

    await tx.standingRow.updateMany({
      where: {
        standingTable: { competitionId },
        OR: [{ opponentId: saved.id }, { opponentId: null, teamName: legacyName }],
      },
      data: { opponentId: saved.id, teamName: payload.name },
    });

    return saved;
  });

  for (const team of teams.filter((item) => item.competitionId === competitionId)) {
    revalidateMatchPaths(team.publicSlug);
    revalidatePath(
      team.team.isFirstTeam
        ? "/primer-equipo/clasificacion"
        : `/equipos/${team.publicSlug}/clasificacion`,
    );
  }

  return {
    ok: true,
    data: await getAdminMatchesScreenData(user),
    selectedMatchId: opponent.id.toString(),
    message: previous ? "Rival actualizado." : "Rival creado.",
  };
}

export async function saveVenueAction(
  input: SaveVenueInput,
): Promise<AdminMatchesActionResult> {
  const { user } = await assertMatchWriteRole();
  const parsed = saveVenueInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar el campo.",
    };
  }

  const { activeSeason, teams } = await getAdminMatchesScope(user);

  if (!activeSeason) {
    return { ok: false, message: "No hay una temporada activa." };
  }

  const payload = parsed.data;
  const competitionId = BigInt(payload.competitionId);
  const scopedCompetitionIds = new Set(
    teams.map((team) => team.competitionId?.toString()).filter(Boolean),
  );

  if (!scopedCompetitionIds.has(payload.competitionId)) {
    return { ok: false, message: "La competicion no esta disponible en la temporada activa." };
  }

  const slug = buildVenueSlug(payload.name);
  const currentId = payload.venueId ? BigInt(payload.venueId) : null;
  const duplicate = await prisma.venue.findFirst({
    where: {
      competitionId,
      slug,
      deletedAt: null,
      ...(currentId ? { id: { not: currentId } } : {}),
    },
    select: { id: true },
  });

  if (duplicate) {
    return { ok: false, message: "Ya existe un campo con ese nombre en la competicion." };
  }

  const previous = currentId
    ? await prisma.venue.findFirst({
        where: { id: currentId, competitionId, deletedAt: null },
        select: { id: true, name: true },
      })
    : null;

  if (currentId && !previous) {
    return { ok: false, message: "El campo ya no esta disponible." };
  }

  await prisma.$transaction(async (tx) => {
    const saved = previous
      ? await tx.venue.update({
          where: { id: previous.id },
          data: {
            name: payload.name,
            slug,
            address: payload.address || null,
            active: payload.active,
          },
          select: { id: true },
        })
      : await tx.venue.create({
          data: {
            competitionId,
            name: payload.name,
            slug,
            address: payload.address || null,
            active: payload.active,
          },
          select: { id: true },
        });

    const legacyName = previous?.name ?? payload.name;

    await tx.match.updateMany({
      where: {
        competitionId,
        OR: [{ venueId: saved.id }, { venueId: null, venue: legacyName }],
      },
      data: { venueId: saved.id, venue: payload.name },
    });
  });

  for (const team of teams.filter((item) => item.competitionId === competitionId)) {
    revalidateMatchPaths(team.publicSlug);
  }

  return {
    ok: true,
    data: await getAdminMatchesScreenData(user),
    message: previous ? "Campo actualizado." : "Campo creado.",
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
  const [opponent, venue] = await Promise.all([
    prisma.opponent.findFirst({
      where: {
        id: BigInt(payload.opponentId),
        competitionId: targetTeam.competitionId ?? undefined,
        active: true,
        deletedAt: null,
      },
      select: { id: true, name: true },
    }),
    prisma.venue.findFirst({
      where: {
        id: BigInt(payload.venueId),
        competitionId: targetTeam.competitionId ?? undefined,
        active: true,
        deletedAt: null,
      },
      select: { id: true, name: true },
    }),
  ]);

  if (!opponent || !targetTeam.competitionId) {
    return {
      ok: false,
      message: "Selecciona un rival activo de la competicion del equipo.",
    };
  }

  if (!venue) {
    return {
      ok: false,
      message: "Selecciona un campo activo de la competicion del equipo.",
    };
  }

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
        venueId: venue.id,
        venue: venue.name,
        isHome: payload.isHome,
        opponentId: opponent.id,
        opponentName: opponent.name,
        status: nextStatus,
        homeScore,
        awayScore,
        videoUrl: payload.highlightsUrl || null,
        videoLabel: payload.highlightsUrl ? "Highlights" : null,
        updatedById: user.id,
      },
    });

    revalidateMatchPaths(existing.seasonTeam.publicSlug, existing.id.toString());

    if (existing.seasonTeam.publicSlug !== targetTeam.publicSlug) {
      revalidateMatchPaths(targetTeam.publicSlug, existing.id.toString());
    }

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
      venueId: venue.id,
      venue: venue.name,
      isHome: payload.isHome,
      opponentId: opponent.id,
      opponentName: opponent.name,
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
