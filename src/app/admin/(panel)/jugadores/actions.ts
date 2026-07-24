"use server";

import { MediaUsage } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { AdminPlayersScreenData } from "@/server/services/admin-players";
import { resolveMediaAssetId } from "@/server/services/admin-media";
import { getAdminPlayersScreenData } from "@/server/services/admin-players";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import {
  getSafeServerErrorMessage,
  logServerError,
} from "@/server/logging/safe-server-log";
import {
  savePlayerProfileInputSchema,
  type SavePlayerProfileInput,
} from "@/server/validators/admin-players";

type AdminPlayersActionResult =
  | {
      ok: true;
      data: AdminPlayersScreenData;
      selectedPlayerId?: string;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

function revalidatePlayerPaths(teamSlugs: string[], previousSlug: string, nextSlug: string) {
  const slugs = Array.from(new Set([previousSlug, nextSlug].filter(Boolean)));
  const uniqueTeamSlugs = Array.from(new Set(teamSlugs.filter(Boolean)));

  revalidatePath("/admin/jugadores");
  revalidatePath("/equipos");

  for (const teamSlug of uniqueTeamSlugs) {
    if (teamSlug === "primer-equipo") {
      revalidatePath("/primer-equipo");
      revalidatePath("/primer-equipo/plantilla");
    } else {
      revalidatePath(`/equipos/${teamSlug}`);
      revalidatePath(`/equipos/${teamSlug}/plantilla`);
    }

    for (const slug of slugs) {
      if (teamSlug !== "primer-equipo") {
        revalidatePath(`/equipos/${teamSlug}/jugadores/${slug}`);
      }
    }
  }

  for (const slug of slugs) {
    revalidatePath(`/jugadores/${slug}`);
  }
}

export async function savePlayerProfileAction(
  input: SavePlayerProfileInput,
): Promise<AdminPlayersActionResult> {
  const user = await requireAdminSectionAccess("players");

  const parsed = savePlayerProfileInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar la ficha del jugador.",
    };
  }

  const payload = parsed.data;

  if (!/^\d+$/.test(payload.playerId)) {
    return {
      ok: false,
      message: "No hemos podido identificar al jugador.",
    };
  }

  const existing = await prisma.player.findFirst({
    where: {
      id: BigInt(payload.playerId),
      deletedAt: null,
    },
    select: {
      id: true,
      slug: true,
      assignments: {
        where: {
          active: true,
          deletedAt: null,
          season: {
            deletedAt: null,
          },
          seasonTeam: {
            active: true,
            deletedAt: null,
          },
        },
        orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }, { id: "asc" }],
        select: {
          seasonTeam: {
            select: {
              publicSlug: true,
            },
          },
        },
      },
    },
  });

  if (!existing) {
    return {
      ok: false,
      message: "El jugador ya no esta disponible para editar.",
    };
  }

  const slugConflict = await prisma.player.findFirst({
    where: {
      slug: payload.slug,
      id: {
        not: existing.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (slugConflict) {
    return {
      ok: false,
      message: "Ese slug ya esta en uso por otro jugador.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const photoMediaId = await resolveMediaAssetId(
        {
          mediaId: payload.photoMediaId,
          publicUrl: payload.photoUrl,
          usage: MediaUsage.PLAYER_PHOTO,
          uploadedById: user.id,
        },
        tx,
      );

      await tx.player.update({
        where: {
          id: existing.id,
        },
        data: {
          publicName: payload.publicName,
          slug: payload.slug,
          countryCode: payload.country,
          preferredFoot: payload.foot,
          publicVisible: payload.visible,
          active: payload.active,
          photoMediaId,
          updatedById: user.id,
        },
      });
    });
  } catch (error) {
    logServerError("admin.players.saveProfile", error, {
      userId: user.id,
      playerId: existing.id,
      slug: payload.slug,
    });

    return {
      ok: false,
      message: getSafeServerErrorMessage(error, "No hemos podido guardar la ficha."),
    };
  }

  const teamSlugs = existing.assignments.map(
    (assignment) => assignment.seasonTeam.publicSlug,
  );
  revalidatePlayerPaths(teamSlugs.length > 0 ? teamSlugs : ["primer-equipo"], existing.slug, payload.slug);

  return {
    ok: true,
    data: await getAdminPlayersScreenData(user),
    selectedPlayerId: existing.id.toString(),
    message: "Ficha publica actualizada.",
  };
}
