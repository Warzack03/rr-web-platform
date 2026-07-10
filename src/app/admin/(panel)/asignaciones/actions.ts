"use server";

import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { slugifyPlayerName } from "@/lib/admin/player-management";
import type { AdminAssignmentsScreenData } from "@/server/services/admin-assignments";
import {
  getAdminAssignmentsScope,
  getAdminAssignmentsScreenData,
} from "@/server/services/admin-assignments";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import {
  createAssignmentInputSchema,
  saveAssignmentInputSchema,
  type CreateAssignmentInput,
  type SaveAssignmentInput,
} from "@/server/validators/admin-assignments";

type AdminAssignmentsActionResult =
  | {
      ok: true;
      data: AdminAssignmentsScreenData;
      selectedAssignmentId?: string;
      selectedTeamSlug?: string;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

function isNumericId(value: string) {
  return /^\d+$/.test(value);
}

function parseDateInput(value: string) {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00.000Z`);
}

function getTodayDate() {
  return new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z");
}

const MAX_ACTIVE_ASSIGNMENTS_PER_SEASON = 2;

function splitPublicName(publicName: string) {
  const normalized = publicName.trim().replace(/\s+/g, " ");
  const parts = normalized.split(" ");

  return {
    firstName: parts[0] ?? normalized,
    lastName: parts.slice(1).join(" "),
  };
}

async function buildUniquePlayerSlug(baseName: string) {
  const baseSlug = slugifyPlayerName(baseName) || "jugador";
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await prisma.player.findFirst({
      where: {
        slug: candidate,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

function revalidateAssignmentPaths(input: Array<{ teamSlug: string; playerSlug?: string }>) {
  const uniqueEntries = Array.from(
    new Map(
      input
        .filter((item) => item.teamSlug)
        .map((item) => [`${item.teamSlug}:${item.playerSlug ?? ""}`, item]),
    ).values(),
  );

  revalidatePath("/admin/asignaciones");
  revalidatePath("/admin/jugadores");
  revalidatePath("/equipos");

  for (const entry of uniqueEntries) {
    if (entry.teamSlug === "primer-equipo") {
      revalidatePath("/primer-equipo");
      revalidatePath("/primer-equipo/plantilla");
    } else {
      revalidatePath(`/equipos/${entry.teamSlug}`);
      revalidatePath(`/equipos/${entry.teamSlug}/plantilla`);
    }

    if (entry.playerSlug) {
      revalidatePath(`/jugadores/${entry.playerSlug}`);

      if (entry.teamSlug !== "primer-equipo") {
        revalidatePath(`/equipos/${entry.teamSlug}/jugadores/${entry.playerSlug}`);
      }
    }
  }
}

async function assertAssignmentWriteRole() {
  const user = await requireAdminSectionAccess("assignments");

  if (user.role === UserRole.COACH) {
    return {
      ok: false as const,
      message: "Esta cuenta solo puede consultar la plantilla.",
    };
  }

  return {
    ok: true as const,
    user,
  };
}

export async function saveAssignmentAction(
  input: SaveAssignmentInput,
): Promise<AdminAssignmentsActionResult> {
  const access = await assertAssignmentWriteRole();

  if (!access.ok) {
    return access;
  }

  const parsed = saveAssignmentInputSchema.safeParse(input);

  if (!parsed.success || !isNumericId(parsed.data.assignmentId)) {
    return {
      ok: false,
      message: parsed.success
        ? "No hemos podido identificar la asignacion."
        : parsed.error.issues[0]?.message ?? "No hemos podido validar la asignacion.",
    };
  }

  const { user } = access;
  const { activeSeason, teams } = await getAdminAssignmentsScope(user);

  if (!activeSeason || teams.length === 0) {
    return {
      ok: false,
      message: "No hay temporada activa disponible para esta plantilla.",
    };
  }

  const payload = parsed.data;
  const joinedAt = parseDateInput(payload.joinedAt);
  const leftAt = parseDateInput(payload.leftAt);

  if (joinedAt && leftAt && leftAt < joinedAt) {
    return {
      ok: false,
      message: "La fecha de baja no puede ir antes del alta.",
    };
  }

  const existing = await prisma.teamPlayerAssignment.findFirst({
    where: {
      id: BigInt(payload.assignmentId),
      seasonId: activeSeason.id,
      deletedAt: null,
      seasonTeamId: {
        in: teams.map((team) => team.id),
      },
    },
    select: {
      id: true,
      playerId: true,
      seasonId: true,
      active: true,
      isPrimary: true,
      seasonTeam: {
        select: {
          publicSlug: true,
        },
      },
      player: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!existing) {
    return {
      ok: false,
      message: "La asignacion ya no esta disponible para editar.",
    };
  }

  const siblingActiveAssignments = await prisma.teamPlayerAssignment.findMany({
    where: {
      seasonId: existing.seasonId,
      playerId: existing.playerId,
      active: true,
      deletedAt: null,
      id: {
        not: existing.id,
      },
    },
    orderBy: [{ isPrimary: "desc" }, { id: "asc" }],
    select: {
      id: true,
      isPrimary: true,
    },
  });

  if (
    payload.active &&
    !existing.active &&
    siblingActiveAssignments.length >= MAX_ACTIVE_ASSIGNMENTS_PER_SEASON
  ) {
    return {
      ok: false,
      message: "Ese jugador ya tiene dos equipos activos en la temporada.",
    };
  }

  const nextLeftAt = payload.active ? null : leftAt ?? getTodayDate();
  const hasSiblingPrimary = siblingActiveAssignments.some((assignment) => assignment.isPrimary);
  const nextIsPrimary = payload.active
    ? siblingActiveAssignments.length === 0
      ? true
      : hasSiblingPrimary
        ? existing.active && existing.isPrimary
        : true
    : false;

  await prisma.$transaction(async (tx) => {
    await tx.teamPlayerAssignment.update({
      where: {
        id: existing.id,
      },
      data: {
        shirtNumber: payload.shirtNumber,
        position: payload.publicPosition,
        isCaptain: payload.captain,
        active: payload.active,
        isPrimary: nextIsPrimary,
        joinedAt,
        leftAt: nextLeftAt,
        updatedById: user.id,
      },
    });

    if (!payload.active && existing.isPrimary && siblingActiveAssignments.length > 0) {
      await tx.teamPlayerAssignment.update({
        where: {
          id: siblingActiveAssignments[0].id,
        },
        data: {
          isPrimary: true,
          updatedById: user.id,
        },
      });
    }
  });

  revalidateAssignmentPaths([
    {
      teamSlug: existing.seasonTeam.publicSlug,
      playerSlug: existing.player.slug,
    },
  ]);

  return {
    ok: true,
    data: await getAdminAssignmentsScreenData(user),
    selectedAssignmentId: existing.id.toString(),
    selectedTeamSlug: existing.seasonTeam.publicSlug,
    message: "Plantilla actualizada.",
  };
}

export async function createAssignmentAction(
  input: CreateAssignmentInput,
): Promise<AdminAssignmentsActionResult> {
  const access = await assertAssignmentWriteRole();

  if (!access.ok) {
    return access;
  }

  const parsed = createAssignmentInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar el alta.",
    };
  }

  const { user } = access;
  const { activeSeason, teams } = await getAdminAssignmentsScope(user);

  if (!activeSeason || teams.length === 0) {
    return {
      ok: false,
      message: "No hay temporada activa disponible para esta plantilla.",
    };
  }

  const payload = parsed.data;
  const targetTeam = teams.find((team) => team.publicSlug === payload.teamSlug);

  if (!targetTeam) {
    return {
      ok: false,
      message: "El equipo seleccionado ya no esta disponible.",
    };
  }

  const joinedAt = parseDateInput(payload.joinedAt) ?? getTodayDate();
  let selectedAssignmentId = "";
  let playerSlugForRevalidation = "";
  const teamSlugsForRevalidation = new Set<string>([targetTeam.publicSlug]);

  try {
    await prisma.$transaction(async (tx) => {
      let targetPlayerId: bigint;

      if (payload.mode === "existing") {
        if (!isNumericId(payload.playerId)) {
          throw new Error("Selecciona un jugador valido.");
        }

        const player = await tx.player.findFirst({
          where: {
            id: BigInt(payload.playerId),
            deletedAt: null,
          },
          select: {
            id: true,
            slug: true,
          },
        });

        if (!player) {
          throw new Error("El jugador seleccionado ya no existe.");
        }

        targetPlayerId = player.id;
        playerSlugForRevalidation = player.slug;
      } else {
        const publicName = payload.publicName.trim();
        const slug = await buildUniquePlayerSlug(publicName);
        const nameParts = splitPublicName(publicName);
        const player = await tx.player.create({
          data: {
            firstName: nameParts.firstName,
            lastName: nameParts.lastName,
            publicName,
            slug,
            active: true,
            publicVisible: true,
            createdById: user.id,
            updatedById: user.id,
          },
          select: {
            id: true,
            slug: true,
          },
        });

        targetPlayerId = player.id;
        playerSlugForRevalidation = player.slug;
      }

      const currentActiveAssignments = await tx.teamPlayerAssignment.findMany({
        where: {
          seasonId: activeSeason.id,
          playerId: targetPlayerId,
          active: true,
          deletedAt: null,
        },
        select: {
          id: true,
          isPrimary: true,
          seasonTeam: {
            select: {
              publicSlug: true,
            },
          },
        },
      });

      const currentActiveForTeam = currentActiveAssignments.find(
        (assignment) => assignment.seasonTeam.publicSlug === targetTeam.publicSlug,
      );

      if (currentActiveForTeam) {
        throw new Error("Ese jugador ya forma parte de la plantilla activa del equipo.");
      }

      currentActiveAssignments.forEach((assignment) => {
        teamSlugsForRevalidation.add(assignment.seasonTeam.publicSlug);
      });

      const hasPrimaryActiveAssignment = currentActiveAssignments.some(
        (assignment) => assignment.isPrimary,
      );

      if (payload.keepCurrentTeamsActive) {
        if (currentActiveAssignments.length >= MAX_ACTIVE_ASSIGNMENTS_PER_SEASON) {
          throw new Error("Ese jugador ya tiene dos equipos activos en la temporada.");
        }
      } else if (currentActiveAssignments.length > 0) {
        await tx.teamPlayerAssignment.updateMany({
          where: {
            id: {
              in: currentActiveAssignments.map((assignment) => assignment.id),
            },
          },
          data: {
            active: false,
            isPrimary: false,
            leftAt: joinedAt,
            updatedById: user.id,
          },
        });
      }

      const nextAssignmentIsPrimary =
        !payload.keepCurrentTeamsActive ||
        currentActiveAssignments.length === 0 ||
        !hasPrimaryActiveAssignment;

      const reusableAssignment = await tx.teamPlayerAssignment.findFirst({
        where: {
          seasonId: activeSeason.id,
          seasonTeamId: targetTeam.id,
          playerId: targetPlayerId,
          deletedAt: null,
        },
        orderBy: { id: "desc" },
        select: {
          id: true,
        },
      });

      if (reusableAssignment) {
        const updated = await tx.teamPlayerAssignment.update({
          where: {
            id: reusableAssignment.id,
          },
          data: {
            shirtNumber: payload.shirtNumber,
            position: payload.publicPosition,
            isCaptain: payload.captain,
            active: true,
            isPrimary: nextAssignmentIsPrimary,
            isManualException: true,
            joinedAt,
            leftAt: null,
            updatedById: user.id,
          },
          select: {
            id: true,
          },
        });

        selectedAssignmentId = updated.id.toString();
        return;
      }

      const highestDisplayOrder = await tx.teamPlayerAssignment.aggregate({
        where: {
          seasonTeamId: targetTeam.id,
          seasonId: activeSeason.id,
          deletedAt: null,
        },
        _max: {
          displayOrder: true,
        },
      });

      const created = await tx.teamPlayerAssignment.create({
        data: {
          playerId: targetPlayerId,
          seasonTeamId: targetTeam.id,
          seasonId: activeSeason.id,
          shirtNumber: payload.shirtNumber,
          position: payload.publicPosition,
          isCaptain: payload.captain,
          isPrimary: nextAssignmentIsPrimary,
          isManualException: true,
          active: true,
          joinedAt,
          displayOrder: (highestDisplayOrder._max.displayOrder ?? 0) + 1,
          createdById: user.id,
          updatedById: user.id,
        },
        select: {
          id: true,
        },
      });

      selectedAssignmentId = created.id.toString();
    });
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "No hemos podido completar el alta de plantilla.",
    };
  }

  revalidateAssignmentPaths(
    Array.from(teamSlugsForRevalidation).map((teamSlug) => ({
      teamSlug,
      playerSlug: playerSlugForRevalidation,
    })),
  );

  return {
    ok: true,
    data: await getAdminAssignmentsScreenData(user),
    selectedAssignmentId,
    selectedTeamSlug: targetTeam.publicSlug,
    message:
      payload.mode === "new"
        ? "Jugador creado y anadido a la plantilla."
        : "Jugador anadido a la plantilla.",
  };
}
