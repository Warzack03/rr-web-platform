"use server";

import { revalidatePath } from "next/cache";
import type { AdminCompetitionsScreenData } from "@/server/services/admin-competitions";
import { getAdminCompetitionsScreenData } from "@/server/services/admin-competitions";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import {
  saveCompetitionInputSchema,
  toggleCompetitionInputSchema,
  type SaveCompetitionInput,
  type ToggleCompetitionInput,
} from "@/server/validators/admin-competitions";

type AdminCompetitionsActionResult =
  | { ok: true; data: AdminCompetitionsScreenData; message: string }
  | { ok: false; message: string };

function slugifyCompetition(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function revalidateCompetitionPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/competiciones");
  revalidatePath("/admin/equipos");
  revalidatePath("/admin/partidos");
  revalidatePath("/admin/clasificaciones");
  revalidatePath("/");
  revalidatePath("/equipos");
}

export async function saveCompetitionAction(
  input: SaveCompetitionInput,
): Promise<AdminCompetitionsActionResult> {
  const user = await requireAdminSectionAccess("competitions");
  const parsed = saveCompetitionInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar la competicion.",
    };
  }

  const season = await prisma.season.findFirst({
    where: { name: parsed.data.season, deletedAt: null },
    select: { id: true },
  });

  if (!season) {
    return { ok: false, message: "La temporada seleccionada ya no esta disponible." };
  }

  const competitionId = parsed.data.competitionId
    ? BigInt(parsed.data.competitionId)
    : null;
  const existing = competitionId
    ? await prisma.competition.findUnique({
        where: { id: competitionId },
        select: { id: true, seasonId: true, slug: true },
      })
    : null;

  if (competitionId && !existing) {
    return { ok: false, message: "La competicion ya no esta disponible." };
  }

  if (existing && existing.seasonId !== season.id) {
    return {
      ok: false,
      message: "No se puede cambiar la temporada de una competicion con historial.",
    };
  }

  const slug = existing?.slug ?? slugifyCompetition(parsed.data.name) ?? "competicion";
  const duplicate = await prisma.competition.findFirst({
    where: {
      seasonId: season.id,
      ...(competitionId ? { id: { not: competitionId } } : {}),
      OR: [{ name: parsed.data.name }, { slug }],
    },
    select: { id: true },
  });

  if (duplicate) {
    return { ok: false, message: "Ya existe una competicion con ese nombre en la temporada." };
  }

  if (existing) {
    await prisma.$transaction([
      prisma.competition.update({
        where: { id: existing.id },
        data: {
          name: parsed.data.name,
          organizer: parsed.data.organizer || null,
          groupName: parsed.data.groupName || null,
          active: parsed.data.active,
        },
      }),
      prisma.seasonTeam.updateMany({
        where: { competitionId: existing.id },
        data: { competitionName: parsed.data.name },
      }),
    ]);
  } else {
    await prisma.competition.create({
      data: {
        seasonId: season.id,
        name: parsed.data.name,
        slug: slugifyCompetition(parsed.data.name) || "competicion",
        organizer: parsed.data.organizer || null,
        groupName: parsed.data.groupName || null,
        active: parsed.data.active,
      },
    });
  }

  revalidateCompetitionPaths();

  return {
    ok: true,
    data: await getAdminCompetitionsScreenData(user),
    message: existing ? "Competicion actualizada." : "Competicion creada.",
  };
}

export async function toggleCompetitionActiveAction(
  input: ToggleCompetitionInput,
): Promise<AdminCompetitionsActionResult> {
  const user = await requireAdminSectionAccess("competitions");
  const parsed = toggleCompetitionInputSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "No hemos podido identificar la competicion." };
  }

  const existing = await prisma.competition.findUnique({
    where: { id: BigInt(parsed.data.competitionId) },
    select: { id: true, active: true },
  });

  if (!existing) {
    return { ok: false, message: "La competicion ya no esta disponible." };
  }

  const updated = await prisma.competition.update({
    where: { id: existing.id },
    data: { active: !existing.active },
    select: { active: true },
  });

  revalidateCompetitionPaths();

  return {
    ok: true,
    data: await getAdminCompetitionsScreenData(user),
    message: updated.active ? "Competicion reactivada." : "Competicion desactivada.",
  };
}

