"use server";

import { MediaType, MediaUsage, Prisma, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { AdminTeamsScreenData } from "@/server/services/admin-teams";
import { getAdminTeamsScreenData } from "@/server/services/admin-teams";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import {
  saveTeamInputSchema,
  toggleTeamInputSchema,
  type SaveTeamInput,
  type ToggleTeamInput,
} from "@/server/validators/admin-teams";

type AdminTeamsActionResult =
  | {
      ok: true;
      data: AdminTeamsScreenData;
      selectedTeamId?: string;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

function isNumericId(value: string) {
  return /^\d+$/.test(value);
}

async function resolveMediaId(
  publicUrl: string,
  usage: MediaUsage,
  uploadedById: bigint,
  tx: Prisma.TransactionClient,
) {
  const normalizedUrl = publicUrl.trim();

  if (!normalizedUrl) {
    return null;
  }

  const existing = await tx.mediaAsset.findFirst({
    where: {
      deletedAt: null,
      publicUrl: normalizedUrl,
      usage,
    },
    select: {
      id: true,
    },
    orderBy: { id: "desc" },
  });

  if (existing) {
    return existing.id;
  }

  const created = await tx.mediaAsset.create({
    data: {
      type: MediaType.IMAGE,
      usage,
      publicUrl: normalizedUrl,
      uploadedById,
    },
    select: {
      id: true,
    },
  });

  return created.id;
}

async function ensureUniqueTeamSlug(
  slug: string,
  excludedTeamId?: bigint,
) {
  const conflict = await prisma.team.findFirst({
    where: {
      slug,
      ...(excludedTeamId ? { id: { not: excludedTeamId } } : {}),
    },
    select: {
      id: true,
    },
  });

  return !conflict;
}

async function ensureUniqueSeasonSlug(
  seasonId: bigint,
  slug: string,
  excludedSeasonTeamId?: bigint,
) {
  const conflict = await prisma.seasonTeam.findFirst({
    where: {
      seasonId,
      publicSlug: slug,
      deletedAt: null,
      ...(excludedSeasonTeamId ? { id: { not: excludedSeasonTeamId } } : {}),
    },
    select: {
      id: true,
    },
  });

  return !conflict;
}

async function buildUniqueTeamCode(slug: string) {
  const baseCode = slug.replace(/-/g, "_").toUpperCase().slice(0, 40) || "TEAM";
  let candidate = baseCode;
  let index = 2;

  while (true) {
    const existing = await prisma.team.findFirst({
      where: {
        code: candidate,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${baseCode}_${index}`;
    index += 1;
  }
}

function revalidateTeamPaths(teamSlugs: string[]) {
  const uniqueSlugs = Array.from(new Set(teamSlugs.filter(Boolean)));

  revalidatePath("/admin");
  revalidatePath("/admin/equipos");
  revalidatePath("/equipos");
  revalidatePath("/");

  for (const teamSlug of uniqueSlugs) {
    if (teamSlug === "primer-equipo") {
      revalidatePath("/primer-equipo");
      revalidatePath("/primer-equipo/plantilla");
      revalidatePath("/primer-equipo/calendario");
      revalidatePath("/primer-equipo/clasificacion");
      continue;
    }

    revalidatePath(`/equipos/${teamSlug}`);
    revalidatePath(`/equipos/${teamSlug}/plantilla`);
    revalidatePath(`/equipos/${teamSlug}/calendario`);
    revalidatePath(`/equipos/${teamSlug}/clasificacion`);
  }
}

async function getScopedSeasonTeamForWrite(
  userId: bigint,
  role: UserRole,
  seasonTeamId: bigint,
) {
  return prisma.seasonTeam.findFirst({
    where: {
      id: seasonTeamId,
      deletedAt: null,
      ...(role === UserRole.COACH
        ? {
            coachPermissions: {
              some: {
                userId,
                active: true,
              },
            },
          }
        : {}),
    },
    select: {
      id: true,
      seasonId: true,
      publicSlug: true,
      publicName: true,
      active: true,
      publicVisible: true,
      teamId: true,
      team: {
        select: {
          id: true,
          slug: true,
          isFirstTeam: true,
        },
      },
      coaches: {
        select: {
          id: true,
          userId: true,
          photoMediaId: true,
        },
      },
    },
  });
}

async function assertTeamWriteRole() {
  const user = await requireAdminSectionAccess("teams");

  if (user.role === UserRole.COACH) {
    return {
      ok: false as const,
      message: "Esta cuenta solo puede consultar equipos.",
    };
  }

  return {
    ok: true as const,
    user,
  };
}

export async function saveTeamAction(
  input: SaveTeamInput,
): Promise<AdminTeamsActionResult> {
  const access = await assertTeamWriteRole();

  if (!access.ok) {
    return access;
  }

  const parsed = saveTeamInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar el equipo.",
    };
  }

  const { user } = access;
  const payload = {
    ...parsed.data,
    slug: parsed.data.isFirstTeam ? "primer-equipo" : parsed.data.slug,
  };
  const season = await prisma.season.findFirst({
    where: {
      name: payload.season,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!season) {
    return {
      ok: false,
      message: "La temporada seleccionada ya no esta disponible.",
    };
  }

  const competition = await prisma.competition.findFirst({
    where: {
      seasonId: season.id,
      name: payload.competition,
    },
    select: {
      id: true,
    },
  });

  if (payload.seasonTeamId && isNumericId(payload.seasonTeamId)) {
    const existing = await getScopedSeasonTeamForWrite(
      user.id,
      user.role,
      BigInt(payload.seasonTeamId),
    );

    if (!existing) {
      return {
        ok: false,
        message: "El equipo ya no esta disponible para editar.",
      };
    }

    if (existing.seasonId !== season.id) {
      return {
        ok: false,
        message: "Cambiar la temporada de un equipo existente aun no esta soportado.",
      };
    }

    if (!(await ensureUniqueTeamSlug(payload.slug, existing.team.id))) {
      return {
        ok: false,
        message: "Ese slug ya esta en uso por otro equipo base.",
      };
    }

    if (!(await ensureUniqueSeasonSlug(season.id, payload.slug, existing.id))) {
      return {
        ok: false,
        message: "Ya existe un equipo de esa temporada con el mismo slug publico.",
      };
    }

    await prisma.$transaction(async (tx) => {
      if (payload.isFirstTeam) {
        await tx.team.updateMany({
          where: {
            id: {
              not: existing.team.id,
            },
          },
          data: {
            isFirstTeam: false,
            branch: "Cantera",
          },
        });
      }

      const [logoMediaId, bannerMediaId] = await Promise.all([
        resolveMediaId(payload.logoUrl, MediaUsage.TEAM_LOGO, user.id, tx),
        resolveMediaId(payload.bannerUrl, MediaUsage.TEAM_BANNER, user.id, tx),
      ]);

      await tx.team.update({
        where: {
          id: existing.team.id,
        },
        data: {
          name: payload.name,
          slug: payload.slug,
          isFirstTeam: payload.isFirstTeam,
          branch: payload.isFirstTeam ? "Primer equipo" : "Cantera",
        },
      });

      await tx.seasonTeam.update({
        where: {
          id: existing.id,
        },
        data: {
          publicName: payload.name,
          publicSlug: payload.slug,
          category: payload.category,
          competitionId: competition?.id ?? null,
          competitionName: payload.competition,
          publicVisible: payload.publicVisible,
          active: payload.active,
          displayOrder: payload.displayOrder,
          logoMediaId,
          bannerMediaId,
          updatedById: user.id,
        },
      });

      const existingCoachIds = new Set(existing.coaches.map((coach) => coach.id.toString()));
      const incomingCoachIds = new Set(
        payload.coaches
          .map((coach) => coach.id)
          .filter((coachId) => existingCoachIds.has(coachId)),
      );

      for (const [index, coach] of payload.coaches.entries()) {
        if (existingCoachIds.has(coach.id) && isNumericId(coach.id)) {
          const currentCoach = existing.coaches.find(
            (existingCoach) => existingCoach.id.toString() === coach.id,
          );

          await tx.teamCoach.update({
            where: {
              id: BigInt(coach.id),
            },
            data: {
              name: coach.name,
              roleLabel: coach.roleLabel,
              publicVisible: coach.publicVisible,
              displayOrder: index + 1,
              userId: currentCoach?.userId ?? undefined,
              photoMediaId: currentCoach?.photoMediaId ?? undefined,
            },
          });
        } else {
          await tx.teamCoach.create({
            data: {
              seasonTeamId: existing.id,
              name: coach.name,
              roleLabel: coach.roleLabel,
              publicVisible: coach.publicVisible,
              displayOrder: index + 1,
            },
          });
        }
      }

      const coachIdsToDelete = existing.coaches
        .filter((coach) => !incomingCoachIds.has(coach.id.toString()))
        .map((coach) => coach.id);

      if (coachIdsToDelete.length > 0) {
        await tx.teamCoach.deleteMany({
          where: {
            id: {
              in: coachIdsToDelete,
            },
          },
        });
      }
    });

    revalidateTeamPaths([existing.publicSlug, payload.slug]);

    return {
      ok: true,
      data: await getAdminTeamsScreenData(user),
      selectedTeamId: existing.id.toString(),
      message: "Equipo actualizado.",
    };
  }

  const existingBaseTeam = await prisma.team.findFirst({
    where: {
      slug: payload.slug,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (existingBaseTeam && !(await ensureUniqueSeasonSlug(season.id, payload.slug))) {
    return {
      ok: false,
      message: "Ese equipo ya existe en la temporada seleccionada.",
    };
  }

  if (!existingBaseTeam && !(await ensureUniqueTeamSlug(payload.slug))) {
    return {
      ok: false,
      message: "Ese slug ya esta en uso por otro equipo base.",
    };
  }

  const created = await prisma.$transaction(async (tx) => {
    if (payload.isFirstTeam) {
      await tx.team.updateMany({
        where: existingBaseTeam?.id
          ? {
              id: {
                not: existingBaseTeam.id,
              },
            }
          : {},
        data: {
          isFirstTeam: false,
          branch: "Cantera",
        },
      });
    }

    const [logoMediaId, bannerMediaId] = await Promise.all([
      resolveMediaId(payload.logoUrl, MediaUsage.TEAM_LOGO, user.id, tx),
      resolveMediaId(payload.bannerUrl, MediaUsage.TEAM_BANNER, user.id, tx),
    ]);

    const baseTeam =
      existingBaseTeam ??
      (await tx.team.create({
        data: {
          code: await buildUniqueTeamCode(payload.slug),
          name: payload.name,
          slug: payload.slug,
          isFirstTeam: payload.isFirstTeam,
          branch: payload.isFirstTeam ? "Primer equipo" : "Cantera",
          active: payload.active,
        },
        select: {
          id: true,
        },
      }));

    if (existingBaseTeam) {
      await tx.team.update({
        where: {
          id: existingBaseTeam.id,
        },
        data: {
          name: payload.name,
          slug: payload.slug,
          isFirstTeam: payload.isFirstTeam,
          branch: payload.isFirstTeam ? "Primer equipo" : "Cantera",
          active: payload.active,
        },
      });
    }

    const seasonTeam = await tx.seasonTeam.create({
      data: {
        seasonId: season.id,
        teamId: baseTeam.id,
        competitionId: competition?.id ?? null,
        publicName: payload.name,
        publicSlug: payload.slug,
        category: payload.category,
        competitionName: payload.competition,
        publicVisible: payload.publicVisible,
        active: payload.active,
        displayOrder: payload.displayOrder,
        logoMediaId,
        bannerMediaId,
        createdById: user.id,
        updatedById: user.id,
      },
      select: {
        id: true,
      },
    });

    await tx.teamCoach.createMany({
      data: payload.coaches.map((coach, index) => ({
        seasonTeamId: seasonTeam.id,
        name: coach.name,
        roleLabel: coach.roleLabel,
        publicVisible: coach.publicVisible,
        displayOrder: index + 1,
      })),
    });

    return seasonTeam;
  });

  revalidateTeamPaths([payload.slug]);

  return {
    ok: true,
    data: await getAdminTeamsScreenData(user),
    selectedTeamId: created.id.toString(),
    message: "Equipo creado.",
  };
}

async function toggleTeamFieldAction(
  input: ToggleTeamInput,
  field: "active" | "publicVisible",
): Promise<AdminTeamsActionResult> {
  const access = await assertTeamWriteRole();

  if (!access.ok) {
    return access;
  }

  const parsed = toggleTeamInputSchema.safeParse(input);

  if (!parsed.success || !isNumericId(parsed.data.seasonTeamId)) {
    return {
      ok: false,
      message: "No hemos podido identificar el equipo.",
    };
  }

  const { user } = access;
  const existing = await getScopedSeasonTeamForWrite(
    user.id,
    user.role,
    BigInt(parsed.data.seasonTeamId),
  );

  if (!existing) {
    return {
      ok: false,
      message: "El equipo ya no esta disponible para editar.",
    };
  }

  const updated = await prisma.seasonTeam.update({
    where: {
      id: existing.id,
    },
    data: {
      [field]: field === "active" ? !existing.active : !existing.publicVisible,
      updatedById: user.id,
    },
    select: {
      id: true,
      publicSlug: true,
      active: true,
      publicVisible: true,
    },
  });

  const nextValue = field === "active" ? updated.active : updated.publicVisible;

  revalidateTeamPaths([existing.publicSlug]);

  return {
    ok: true,
    data: await getAdminTeamsScreenData(user),
    selectedTeamId: existing.id.toString(),
    message:
      field === "active"
        ? nextValue
          ? "Equipo reactivado."
          : "Equipo desactivado."
        : nextValue
          ? "Equipo visible en la web."
          : "Equipo oculto de la web.",
  };
}

export async function toggleTeamActiveAction(
  input: ToggleTeamInput,
): Promise<AdminTeamsActionResult> {
  return toggleTeamFieldAction(input, "active");
}

export async function toggleTeamVisibilityAction(
  input: ToggleTeamInput,
): Promise<AdminTeamsActionResult> {
  return toggleTeamFieldAction(input, "publicVisible");
}
