import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
  ImportAction,
  ImportStatus,
  MediaType,
  MediaUsage,
  PrismaClient,
  SeasonStatus,
  type Prisma,
} from "@prisma/client";
import { getRuntimeDatabaseConfig } from "../server/db/runtime-config";

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(getRuntimeDatabaseConfig()),
});

const BOOTSTRAP_SOURCE = "initial-bootstrap";
const ACTIVE_SEASON = {
  code: "TEMP_2026_2027",
  name: "Temporada 2026/27",
  slug: "2026-2027",
  startDate: "2026-07-01",
  endDate: "2027-06-30",
} as const;

const TEAM_LOGOS = {
  madrid: {
    relativePath: "public/media/teams/logos/escudo-madrid.webp",
    publicUrl: "/media/teams/logos/escudo-madrid.webp",
    altText: "Escudo Rising Raimon Madrid",
  },
  catalunya: {
    relativePath: "public/media/teams/logos/escudo-catalunya.webp",
    publicUrl: "/media/teams/logos/escudo-catalunya.webp",
    altText: "Escudo Rising Raimon Catalunya",
  },
} as const;

const TEAM_CONFIGS = [
  {
    key: "senior_a",
    code: "PRIMER_EQUIPO",
    name: "Rising Raimon Senior A",
    slug: "primer-equipo",
    publicName: "Primer Equipo",
    category: "Senior",
    branch: "Madrid",
    isFirstTeam: true,
    displayOrder: 1,
    competitionKey: "liga_f7_sabado_tarde_madrid",
    logoKey: "madrid",
  },
  {
    key: "senior_b",
    code: "SENIOR_B",
    name: "Rising Raimon Senior B",
    slug: "senior-b",
    publicName: "Senior B",
    category: "Senior",
    branch: "Madrid",
    isFirstTeam: false,
    displayOrder: 2,
    competitionKey: "liga_f7_domingo_manana_madrid",
    logoKey: "madrid",
  },
  {
    key: "senior_c",
    code: "SENIOR_C",
    name: "Rising Raimon Senior C",
    slug: "senior-c",
    publicName: "Senior C",
    category: "Senior",
    branch: "Madrid",
    isFirstTeam: false,
    displayOrder: 3,
    competitionKey: "liga_f7_sabado_tarde_madrid",
    logoKey: "madrid",
  },
  {
    key: "senior_tarragona",
    code: "SENIOR_TARRAGONA",
    name: "Rising Raimon Senior Tarragona",
    slug: "senior-tarragona",
    publicName: "Senior Tarragona",
    category: "Senior",
    branch: "Catalunya",
    isFirstTeam: false,
    displayOrder: 4,
    competitionKey: "minifutbol_tarragona",
    logoKey: "catalunya",
  },
  {
    key: "senior_barcelona",
    code: "SENIOR_BARCELONA",
    name: "Rising Raimon Senior Barcelona",
    slug: "senior-barcelona",
    publicName: "Senior Barcelona",
    category: "Senior",
    branch: "Catalunya",
    isFirstTeam: false,
    displayOrder: 5,
    competitionKey: "liga_barcelona",
    logoKey: "catalunya",
  },
 ] as const;

const COMPETITION_CONFIGS = [
  {
    key: "liga_f7_sabado_tarde_madrid",
    slug: "liga-f7-sabado-tarde",
    name: "Liga F7 Sábado Tarde",
    organizer: null,
    groupName: null,
  },
  {
    key: "liga_f7_domingo_manana_madrid",
    slug: "liga-f7-domingo-manana",
    name: "Liga F7 Domingo Mañana",
    organizer: null,
    groupName: null,
  },
  {
    key: "minifutbol_tarragona",
    slug: "minifutbol-tarragona",
    name: "Minifutbol Tarragona",
    organizer: "Minifutbol Catalunya",
    groupName: null,
  },
  {
    key: "liga_barcelona",
    slug: "liga-barcelona",
    name: "Liga Barcelona",
    organizer: null,
    groupName: null,
  },
] as const;

const COACH_CONFIGS = [
  {
    teamKey: "senior_b",
    name: "Aarón Blanco Medrano",
    publicName: "Aarón Blanco Medrano",
    roleLabel: "Entrenador principal",
    displayOrder: 1,
  },
  {
    teamKey: "senior_c",
    name: "Alejandro Meca Marugán",
    publicName: "Alejandro Meca",
    roleLabel: "Entrenador principal",
    displayOrder: 1,
  },
] as const;

const NAME_SPLIT_OVERRIDES = new Map([
  [
    "Daniel De la Cruz Redondo",
    {
      firstName: "Daniel",
      lastName: "De la Cruz Redondo",
    },
  ],
]);

const SURNAME_PARTICLES = new Set([
  "da",
  "de",
  "del",
  "di",
  "do",
  "dos",
  "la",
  "las",
  "los",
  "van",
  "von",
]);

const COUNTRY_CODE_BY_LABEL: Record<string, string> = {
  espana: "ES",
  bolivia: "BO",
  polonia: "PL",
};

type TeamKey = (typeof TEAM_CONFIGS)[number]["key"];

type CsvAssignmentRow = {
  team: string;
  public_name: string;
  full_name: string;
  player_slug: string;
  dorsal: string;
  primary_position: string;
  secondary_position: string;
  captain: string;
  birth_date: string;
  nationality: string;
  dominant_foot: string;
  active: string;
  photo: string;
};

type ParsedAssignment = {
  teamName: string;
  publicName: string;
  fullName: string;
  playerSlug: string;
  shirtNumber: number | null;
  primaryPosition: string | null;
  secondaryPosition: string | null;
  isCaptain: boolean;
  birthDate: string | null;
  nationality: string | null;
  dominantFoot: string | null;
  active: boolean;
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function parseBooleanLabel(value: string) {
  return normalizeText(value) === "si";
}

function parseOptionalText(value: string) {
  const trimmed = value.trim();

  if (!trimmed || normalizeText(trimmed) === "pendiente") {
    return null;
  }

  return trimmed;
}

function parseOptionalDate(value: string) {
  const normalized = parseOptionalText(value);

  return normalized ? normalized : null;
}

function parseOptionalNumber(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);

  return Number.isFinite(parsed) ? parsed : null;
}

function splitCsvLine(line: string) {
  return line.split(",").map((value) => value.trim());
}

function extractPseudoCsvSection(markdown: string) {
  const match = markdown.match(/### Pseudo-CSV compacto de perfiles[\s\S]*?```csv\s*([\s\S]*?)```/i);

  if (!match?.[1]) {
    throw new Error("No hemos encontrado el bloque `Pseudo-CSV compacto de perfiles jugador-temporada`.");
  }

  return match[1];
}

function parseAssignmentsFromMarkdown(markdown: string): ParsedAssignment[] {
  const csvBlock = extractPseudoCsvSection(markdown);
  const lines = csvBlock
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("El pseudo-CSV no contiene datos suficientes para bootstrap.");
  }

  const headers = splitCsvLine(lines[0]);
  const requiredHeaders = [
    "team",
    "public_name",
    "full_name",
    "player_slug",
    "dorsal",
    "primary_position",
    "secondary_position",
    "captain",
    "birth_date",
    "nationality",
    "dominant_foot",
    "active",
    "photo",
  ];

  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      throw new Error(`Falta la columna obligatoria \`${header}\` en el pseudo-CSV.`);
    }
  }

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);

    if (values.length !== headers.length) {
      throw new Error(`Fila CSV inválida, esperábamos ${headers.length} columnas y hemos recibido ${values.length}: ${line}`);
    }

    const row = Object.fromEntries(headers.map((header, index) => [header, values[index]])) as CsvAssignmentRow;

    return {
      teamName: row.team,
      publicName: row.public_name,
      fullName: row.full_name,
      playerSlug: row.player_slug,
      shirtNumber: parseOptionalNumber(row.dorsal),
      primaryPosition: parseOptionalText(row.primary_position),
      secondaryPosition: parseOptionalText(row.secondary_position),
      isCaptain: parseBooleanLabel(row.captain),
      birthDate: parseOptionalDate(row.birth_date),
      nationality: parseOptionalText(row.nationality),
      dominantFoot: parseOptionalText(row.dominant_foot),
      active: parseBooleanLabel(row.active),
    };
  });
}

function splitPlayerName(fullName: string) {
  const override = NAME_SPLIT_OVERRIDES.get(fullName);

  if (override) {
    return override;
  }

  const tokens = fullName.trim().split(/\s+/).filter(Boolean);

  if (tokens.length <= 1) {
    return {
      firstName: fullName.trim(),
      lastName: fullName.trim(),
    };
  }

  let splitIndex = Math.max(1, tokens.length - 2);

  while (splitIndex > 1 && SURNAME_PARTICLES.has(normalizeText(tokens[splitIndex - 1]))) {
    splitIndex -= 1;
  }

  return {
    firstName: tokens.slice(0, splitIndex).join(" "),
    lastName: tokens.slice(splitIndex).join(" "),
  };
}

function mapCountryCode(value: string | null) {
  if (!value) {
    return null;
  }

  return COUNTRY_CODE_BY_LABEL[normalizeText(value)] ?? null;
}

function resolveMarkdownSourcePath() {
  const cliArg = process.argv.find((arg) => arg.startsWith("--source="));
  const fromCli = cliArg ? cliArg.slice("--source=".length) : null;
  const fromEnv = process.env.INITIAL_LOAD_DOC_PATH ?? null;
  const sourcePath = fromCli ?? fromEnv;

  if (!sourcePath) {
    throw new Error(
      "Indica la ruta del documento funcional con `--source=...` o define `INITIAL_LOAD_DOC_PATH`.",
    );
  }

  return path.resolve(sourcePath);
}

function getRequiredLogoEntries() {
  return Object.entries(TEAM_LOGOS).map(([key, value]) => ({
    key: key as keyof typeof TEAM_LOGOS,
    absolutePath: path.resolve(process.cwd(), value.relativePath),
    ...value,
  }));
}

function assertRequiredLogoFilesExist() {
  const missing = getRequiredLogoEntries().filter((entry) => !fs.existsSync(entry.absolutePath));

  if (missing.length > 0) {
    throw new Error(
      [
        "Faltan los escudos obligatorios para el bootstrap inicial:",
        ...missing.map((entry) => `- ${entry.relativePath}`),
      ].join("\n"),
    );
  }
}

async function ensureLogoMedia(
  key: keyof typeof TEAM_LOGOS,
  uploadedById: bigint | null,
  tx: Prisma.TransactionClient,
) {
  const config = TEAM_LOGOS[key];
  const absolutePath = path.resolve(process.cwd(), config.relativePath);

  const existing = await tx.mediaAsset.findFirst({
    where: {
      publicUrl: config.publicUrl,
      usage: MediaUsage.TEAM_LOGO,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return existing.id;
  }

  const created = await tx.mediaAsset.create({
    data: {
      type: MediaType.IMAGE,
      usage: MediaUsage.TEAM_LOGO,
      storagePath: config.relativePath.replace(/\\/g, "/"),
      publicUrl: config.publicUrl,
      altText: config.altText,
      mimeType: "image/webp",
      sizeBytes: fs.statSync(absolutePath).size,
      uploadedById: uploadedById ?? undefined,
    },
    select: {
      id: true,
    },
  });

  return created.id;
}

async function main() {
  assertRequiredLogoFilesExist();

  const sourcePath = resolveMarkdownSourcePath();
  const markdown = fs.readFileSync(sourcePath, "utf8");
  const assignments = parseAssignmentsFromMarkdown(markdown);
  const uniquePlayerSlugs = new Set(assignments.map((assignment) => assignment.playerSlug));

  if (assignments.length !== 57) {
    throw new Error(`Esperábamos 57 asignaciones en el documento y hemos encontrado ${assignments.length}.`);
  }

  if (uniquePlayerSlugs.size !== 54) {
    throw new Error(`Esperábamos 54 jugadores únicos en el documento y hemos encontrado ${uniquePlayerSlugs.size}.`);
  }

  const [superadmin] = await prisma.user.findMany({
    where: {
      active: true,
    },
    orderBy: [{ id: "asc" }],
    take: 1,
    select: {
      id: true,
    },
  });

  const sourceHash = crypto.createHash("sha256").update(markdown).digest("hex");

  await prisma.$transaction(async (tx) => {
    const importBatch = await tx.importBatch.create({
      data: {
        sourceSystem: BOOTSTRAP_SOURCE,
        status: ImportStatus.APPLIED,
        fileName: path.basename(sourcePath),
        fileHash: sourceHash,
        createdById: superadmin?.id,
        validatedAt: new Date(),
        appliedAt: new Date(),
        summaryJson: {
          seasonCode: ACTIVE_SEASON.code,
          playerCount: uniquePlayerSlugs.size,
          assignmentCount: assignments.length,
          teamCount: TEAM_CONFIGS.length,
          competitionCount: COMPETITION_CONFIGS.length,
          coachCount: COACH_CONFIGS.length,
          standingsCount: COMPETITION_CONFIGS.length,
          sourcePath,
        },
      },
      select: {
        id: true,
      },
    });

    const logoMediaMap = new Map<keyof typeof TEAM_LOGOS, bigint>();

    for (const [logoKey] of Object.entries(TEAM_LOGOS) as Array<
      [keyof typeof TEAM_LOGOS, (typeof TEAM_LOGOS)[keyof typeof TEAM_LOGOS]]
    >) {
      const mediaId = await ensureLogoMedia(logoKey, superadmin?.id ?? null, tx);
      logoMediaMap.set(logoKey, mediaId);
    }

    const season = await tx.season.upsert({
      where: {
        slug: ACTIVE_SEASON.slug,
      },
      update: {
        name: ACTIVE_SEASON.name,
        startDate: new Date(ACTIVE_SEASON.startDate),
        endDate: new Date(ACTIVE_SEASON.endDate),
        status: SeasonStatus.CURRENT,
        activeKey: "CURRENT",
        sourceSystem: BOOTSTRAP_SOURCE,
        sourceExternalId: ACTIVE_SEASON.code,
        lastImportBatchId: importBatch.id,
        deletedAt: null,
      },
      create: {
        name: ACTIVE_SEASON.name,
        slug: ACTIVE_SEASON.slug,
        startDate: new Date(ACTIVE_SEASON.startDate),
        endDate: new Date(ACTIVE_SEASON.endDate),
        status: SeasonStatus.CURRENT,
        activeKey: "CURRENT",
        sourceSystem: BOOTSTRAP_SOURCE,
        sourceExternalId: ACTIVE_SEASON.code,
        lastImportBatchId: importBatch.id,
      },
      select: {
        id: true,
      },
    });

    await tx.siteSettings.deleteMany();
    await tx.siteSettings.create({
      data: {
        activeSeasonId: season.id,
        publicSiteName: "Rising Raimon",
        shopUrl: "https://tienda.risingraimon.es",
      },
    });

    const competitionMap = new Map<string, { id: bigint; name: string }>();

    for (const competitionConfig of COMPETITION_CONFIGS) {
      const competition = await tx.competition.upsert({
        where: {
          seasonId_slug: {
            seasonId: season.id,
            slug: competitionConfig.slug,
          },
        },
        update: {
          name: competitionConfig.name,
          organizer: competitionConfig.organizer ?? undefined,
          groupName: competitionConfig.groupName ?? undefined,
          active: true,
        },
        create: {
          seasonId: season.id,
          slug: competitionConfig.slug,
          name: competitionConfig.name,
          organizer: competitionConfig.organizer ?? undefined,
          groupName: competitionConfig.groupName ?? undefined,
          active: true,
        },
        select: {
          id: true,
          name: true,
        },
      });

      competitionMap.set(competitionConfig.key, competition);
    }

    const seasonTeamMap = new Map<
      TeamKey,
      { id: bigint; publicName: string; displayOrder: number; competitionId: bigint }
    >();
    const teamNameToKey = new Map<string, TeamKey>(
      TEAM_CONFIGS.map((team) => [team.name, team.key]),
    );

    for (const teamConfig of TEAM_CONFIGS) {
      const logoMediaId = logoMediaMap.get(teamConfig.logoKey);
      const competition = competitionMap.get(teamConfig.competitionKey);

      if (!logoMediaId || !competition) {
        throw new Error(`No hemos podido resolver la configuracion base del equipo ${teamConfig.name}.`);
      }

      const team = await tx.team.upsert({
        where: {
          slug: teamConfig.slug,
        },
        update: {
          code: teamConfig.code,
          name: teamConfig.name,
          branch: teamConfig.branch,
          displayOrder: teamConfig.displayOrder,
          active: true,
          isFirstTeam: teamConfig.isFirstTeam,
          sourceSystem: BOOTSTRAP_SOURCE,
          sourceExternalId: teamConfig.key,
          lastImportBatchId: importBatch.id,
          deletedAt: null,
        },
        create: {
          code: teamConfig.code,
          name: teamConfig.name,
          slug: teamConfig.slug,
          branch: teamConfig.branch,
          displayOrder: teamConfig.displayOrder,
          active: true,
          isFirstTeam: teamConfig.isFirstTeam,
          sourceSystem: BOOTSTRAP_SOURCE,
          sourceExternalId: teamConfig.key,
          lastImportBatchId: importBatch.id,
        },
        select: {
          id: true,
        },
      });

      const seasonTeam = await tx.seasonTeam.upsert({
        where: {
          seasonId_teamId: {
            seasonId: season.id,
            teamId: team.id,
          },
        },
        update: {
          competitionId: competition.id,
          publicName: teamConfig.publicName,
          publicSlug: teamConfig.slug,
          category: teamConfig.category,
          competitionName: competition.name,
          description: null,
          publicVisible: true,
          logoMediaId,
          bannerMediaId: null,
          displayOrder: teamConfig.displayOrder,
          active: true,
          sourceSystem: BOOTSTRAP_SOURCE,
          sourceExternalId: `${ACTIVE_SEASON.code}:${teamConfig.key}`,
          lastImportBatchId: importBatch.id,
          createdById: superadmin?.id,
          updatedById: superadmin?.id,
          deletedAt: null,
        },
        create: {
          seasonId: season.id,
          teamId: team.id,
          competitionId: competition.id,
          publicName: teamConfig.publicName,
          publicSlug: teamConfig.slug,
          category: teamConfig.category,
          competitionName: competition.name,
          description: null,
          publicVisible: true,
          logoMediaId,
          bannerMediaId: null,
          displayOrder: teamConfig.displayOrder,
          active: true,
          sourceSystem: BOOTSTRAP_SOURCE,
          sourceExternalId: `${ACTIVE_SEASON.code}:${teamConfig.key}`,
          lastImportBatchId: importBatch.id,
          createdById: superadmin?.id,
          updatedById: superadmin?.id,
        },
        select: {
          id: true,
          publicName: true,
        },
      });

      seasonTeamMap.set(teamConfig.key, {
        id: seasonTeam.id,
        publicName: seasonTeam.publicName,
        displayOrder: teamConfig.displayOrder,
        competitionId: competition.id,
      });
    }

    const playerRowsBySlug = new Map<string, ParsedAssignment[]>();

    for (const assignment of assignments) {
      const current = playerRowsBySlug.get(assignment.playerSlug);

      if (current) {
        current.push(assignment);
      } else {
        playerRowsBySlug.set(assignment.playerSlug, [assignment]);
      }
    }

    for (const [playerSlug, playerAssignments] of playerRowsBySlug) {
      const primaryAssignment = [...playerAssignments].sort((left, right) => {
        const leftKey = teamNameToKey.get(left.teamName);
        const rightKey = teamNameToKey.get(right.teamName);
        const leftOrder = leftKey ? TEAM_CONFIGS.find((team) => team.key === leftKey)?.displayOrder ?? 999 : 999;
        const rightOrder = rightKey ? TEAM_CONFIGS.find((team) => team.key === rightKey)?.displayOrder ?? 999 : 999;

        return leftOrder - rightOrder;
      })[0];

      if (!primaryAssignment) {
        continue;
      }

      const splitName = splitPlayerName(primaryAssignment.fullName);

      const player = await tx.player.upsert({
        where: {
          slug: playerSlug,
        },
        update: {
          firstName: splitName.firstName,
          lastName: splitName.lastName,
          publicName: primaryAssignment.publicName,
          birthDate: primaryAssignment.birthDate ? new Date(primaryAssignment.birthDate) : null,
          countryCode: mapCountryCode(primaryAssignment.nationality),
          preferredFoot: primaryAssignment.dominantFoot,
          active: true,
          publicVisible: true,
          photoMediaId: null,
          sourceSystem: BOOTSTRAP_SOURCE,
          sourceExternalId: `${ACTIVE_SEASON.code}:${playerSlug}`,
          lastImportBatchId: importBatch.id,
          createdById: superadmin?.id,
          updatedById: superadmin?.id,
          deletedAt: null,
        },
        create: {
          firstName: splitName.firstName,
          lastName: splitName.lastName,
          publicName: primaryAssignment.publicName,
          slug: playerSlug,
          birthDate: primaryAssignment.birthDate ? new Date(primaryAssignment.birthDate) : null,
          countryCode: mapCountryCode(primaryAssignment.nationality),
          preferredFoot: primaryAssignment.dominantFoot,
          active: true,
          publicVisible: true,
          photoMediaId: null,
          sourceSystem: BOOTSTRAP_SOURCE,
          sourceExternalId: `${ACTIVE_SEASON.code}:${playerSlug}`,
          lastImportBatchId: importBatch.id,
          createdById: superadmin?.id,
          updatedById: superadmin?.id,
        },
        select: {
          id: true,
        },
      });

      await tx.playerSeasonProfile.upsert({
        where: {
          playerId_seasonId: {
            playerId: player.id,
            seasonId: season.id,
          },
        },
        update: {
          primaryPosition: primaryAssignment.primaryPosition,
          secondaryPosition: primaryAssignment.secondaryPosition,
          tertiaryPosition: null,
          publicPosition: primaryAssignment.primaryPosition,
          level: null,
          sourceSystem: BOOTSTRAP_SOURCE,
          sourceExternalId: `${ACTIVE_SEASON.code}:${playerSlug}:profile`,
          lastImportBatchId: importBatch.id,
        },
        create: {
          playerId: player.id,
          seasonId: season.id,
          primaryPosition: primaryAssignment.primaryPosition,
          secondaryPosition: primaryAssignment.secondaryPosition,
          tertiaryPosition: null,
          publicPosition: primaryAssignment.primaryPosition,
          level: null,
          sourceSystem: BOOTSTRAP_SOURCE,
          sourceExternalId: `${ACTIVE_SEASON.code}:${playerSlug}:profile`,
          lastImportBatchId: importBatch.id,
        },
      });

      const orderedAssignments = [...playerAssignments].sort((left, right) => {
        const leftKey = teamNameToKey.get(left.teamName);
        const rightKey = teamNameToKey.get(right.teamName);
        const leftOrder = leftKey ? TEAM_CONFIGS.find((team) => team.key === leftKey)?.displayOrder ?? 999 : 999;
        const rightOrder = rightKey ? TEAM_CONFIGS.find((team) => team.key === rightKey)?.displayOrder ?? 999 : 999;

        return leftOrder - rightOrder;
      });

      for (const [index, assignment] of orderedAssignments.entries()) {
        const teamKey = teamNameToKey.get(assignment.teamName);

        if (!teamKey) {
          throw new Error(`El equipo \`${assignment.teamName}\` no existe en la configuracion del bootstrap.`);
        }

        const seasonTeam = seasonTeamMap.get(teamKey);

        if (!seasonTeam) {
          throw new Error(`No hemos encontrado el season team para \`${assignment.teamName}\`.`);
        }

        const sourceExternalId = `${ACTIVE_SEASON.code}:${teamKey}:${playerSlug}`;
        const existingAssignment = await tx.teamPlayerAssignment.findFirst({
          where: {
            sourceSystem: BOOTSTRAP_SOURCE,
            sourceExternalId,
          },
          select: {
            id: true,
          },
        });

        const assignmentData = {
          playerId: player.id,
          seasonTeamId: seasonTeam.id,
          seasonId: season.id,
          shirtNumber: assignment.shirtNumber,
          position: assignment.primaryPosition,
          isPrimary: index === 0,
          isManualException: orderedAssignments.length > 1,
          isCaptain: assignment.isCaptain,
          displayOrder: assignment.shirtNumber ?? (index + 1) * 100,
          active: assignment.active,
          joinedAt: new Date(ACTIVE_SEASON.startDate),
          leftAt: null,
          sourceSystem: BOOTSTRAP_SOURCE,
          sourceExternalId,
          lastImportBatchId: importBatch.id,
          createdById: superadmin?.id,
          updatedById: superadmin?.id,
          deletedAt: null,
        } satisfies Prisma.TeamPlayerAssignmentUncheckedCreateInput;

        if (existingAssignment) {
          await tx.teamPlayerAssignment.update({
            where: {
              id: existingAssignment.id,
            },
            data: assignmentData,
          });
        } else {
          await tx.teamPlayerAssignment.create({
            data: assignmentData,
          });
        }
      }
    }

    for (const coachConfig of COACH_CONFIGS) {
      const seasonTeam = seasonTeamMap.get(coachConfig.teamKey);

      if (!seasonTeam) {
        throw new Error(`No hemos encontrado el season team para el coach ${coachConfig.name}.`);
      }

      const existingCoach = await tx.teamCoach.findFirst({
        where: {
          seasonTeamId: seasonTeam.id,
          name: coachConfig.name,
          roleLabel: coachConfig.roleLabel,
        },
        select: {
          id: true,
        },
      });

      const coachData = {
        seasonTeamId: seasonTeam.id,
        userId: null,
        name: coachConfig.publicName,
        roleLabel: coachConfig.roleLabel,
        photoMediaId: null,
        publicVisible: true,
        displayOrder: coachConfig.displayOrder,
      };

      if (existingCoach) {
        await tx.teamCoach.update({
          where: {
            id: existingCoach.id,
          },
          data: coachData,
        });
      } else {
        await tx.teamCoach.create({
          data: coachData,
        });
      }
    }

    const competitionGroups = new Map<string, TeamKey[]>();

    for (const teamConfig of TEAM_CONFIGS) {
      const group = competitionGroups.get(teamConfig.competitionKey) ?? [];
      group.push(teamConfig.key);
      competitionGroups.set(teamConfig.competitionKey, group);
    }

    for (const competitionConfig of COMPETITION_CONFIGS) {
      const groupedTeamKeys = (competitionGroups.get(competitionConfig.key) ?? []).sort((left, right) => {
        const leftOrder = TEAM_CONFIGS.find((team) => team.key === left)?.displayOrder ?? 999;
        const rightOrder = TEAM_CONFIGS.find((team) => team.key === right)?.displayOrder ?? 999;

        return leftOrder - rightOrder;
      });

      if (groupedTeamKeys.length === 0) {
        continue;
      }

      const ownerKey = groupedTeamKeys[0];
      const ownerSeasonTeam = ownerKey ? seasonTeamMap.get(ownerKey) : null;
      const competition = competitionMap.get(competitionConfig.key);

      if (!ownerSeasonTeam || !competition) {
        throw new Error(`No hemos podido preparar la clasificacion inicial de ${competitionConfig.name}.`);
      }

      const existingStanding = await tx.standingTable.findFirst({
        where: {
          seasonId: season.id,
          competitionId: competition.id,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      const standing =
        existingStanding
          ? await tx.standingTable.update({
              where: {
                id: existingStanding.id,
              },
              data: {
                seasonTeamId: ownerSeasonTeam.id,
                title: competition.name,
                sourceLabel: "Carga inicial",
                updatedLabel: "Carga inicial 2026/27",
                publicVisible: true,
                updatedById: superadmin?.id,
                deletedAt: null,
              },
              select: {
                id: true,
              },
            })
          : await tx.standingTable.create({
              data: {
                seasonId: season.id,
                seasonTeamId: ownerSeasonTeam.id,
                competitionId: competition.id,
                title: competition.name,
                sourceLabel: "Carga inicial",
                updatedLabel: "Carga inicial 2026/27",
                publicVisible: true,
                createdById: superadmin?.id,
                updatedById: superadmin?.id,
              },
              select: {
                id: true,
              },
            });

      await tx.standingRow.deleteMany({
        where: {
          standingTableId: standing.id,
        },
      });

      await tx.standingRow.createMany({
        data: groupedTeamKeys.map((teamKey, index) => {
          const seasonTeam = seasonTeamMap.get(teamKey);

          if (!seasonTeam) {
            throw new Error(`No hemos encontrado el season team ${teamKey} para la clasificacion inicial.`);
          }

          return {
            standingTableId: standing.id,
            position: index + 1,
            teamName: seasonTeam.publicName,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
            isOwnTeam: true,
            displayOrder: index + 1,
          };
        }),
      });
    }

    await tx.importBatchItem.createMany({
      data: [
        {
          importBatchId: importBatch.id,
          entityType: "Season",
          sourceExternalId: ACTIVE_SEASON.code,
          action: ImportAction.CREATE,
          status: "APPLIED",
          message: "Temporada activa 2026/27 cargada",
          appliedAt: new Date(),
        },
        {
          importBatchId: importBatch.id,
          entityType: "Team",
          sourceExternalId: "teams:5",
          action: ImportAction.CREATE,
          status: "APPLIED",
          message: "Equipos base y season teams cargados",
          appliedAt: new Date(),
        },
        {
          importBatchId: importBatch.id,
          entityType: "Player",
          sourceExternalId: "players:54",
          action: ImportAction.CREATE,
          status: "APPLIED",
          message: "Jugadores y perfiles de temporada cargados",
          appliedAt: new Date(),
        },
        {
          importBatchId: importBatch.id,
          entityType: "Assignment",
          sourceExternalId: "assignments:57",
          action: ImportAction.CREATE,
          status: "APPLIED",
          message: "Asignaciones jugador-equipo cargadas",
          appliedAt: new Date(),
        },
        {
          importBatchId: importBatch.id,
          entityType: "StandingTable",
          sourceExternalId: "standings:4",
          action: ImportAction.CREATE,
          status: "APPLIED",
          message: "Clasificaciones iniciales vacias creadas",
          appliedAt: new Date(),
        },
      ],
    });
  });

  const [seasonCount, teamCount, seasonTeamCount, playerCount, assignmentCount, standingCount, coachCount] =
    await Promise.all([
      prisma.season.count(),
      prisma.team.count(),
      prisma.seasonTeam.count(),
      prisma.player.count(),
      prisma.teamPlayerAssignment.count(),
      prisma.standingTable.count(),
      prisma.teamCoach.count(),
    ]);

  console.log(
    JSON.stringify(
      {
        ok: true,
        operation: "initial-bootstrap",
        season: ACTIVE_SEASON.name,
        source: sourcePath,
        counts: {
          seasons: seasonCount,
          teams: teamCount,
          seasonTeams: seasonTeamCount,
          players: playerCount,
          assignments: assignmentCount,
          standings: standingCount,
          visibleCoaches: coachCount,
        },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error("[db:bootstrap:initial] Failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
