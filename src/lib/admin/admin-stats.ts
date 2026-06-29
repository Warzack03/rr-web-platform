import type { AdminPlayer } from "@/lib/admin/mock-data";

export type AdminStatFieldKey =
  | "minutes"
  | "matchesPlayed"
  | "goals"
  | "assists"
  | "mvp"
  | "yellowCards"
  | "redCards"
  | "recoveries"
  | "shots"
  | "shotsOnTarget"
  | "ownGoals"
  | "goalsConceded"
  | "saves"
  | "cleanSheets";

export type AdminStatField = {
  key: AdminStatFieldKey;
  label: string;
};

const goalkeeperTokens = new Set(["POR", "PORTERO", "GOALKEEPER"]);
const mobilePrimaryOutfieldFieldKeys = new Set<AdminStatFieldKey>([
  "goals",
  "assists",
  "mvp",
  "yellowCards",
  "redCards",
]);
const mobilePrimaryGoalkeeperFieldKeys = new Set<AdminStatFieldKey>([
  "goalsConceded",
  "saves",
  "cleanSheets",
  "mvp",
]);
const mobileAutoAdvanceFieldKeys = new Set<AdminStatFieldKey>([
  "mvp",
  "yellowCards",
  "redCards",
  "cleanSheets",
]);

function sanitizeNonNegativeInt(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.trunc(value));
}

export function isGoalkeeperPlayer(
  player: Pick<AdminPlayer, "position">,
) {
  return goalkeeperTokens.has(player.position.toUpperCase());
}

export function getAdminStatFields({
  isFirstTeam,
  isGoalkeeper,
}: {
  isFirstTeam: boolean;
  isGoalkeeper: boolean;
}): AdminStatField[] {
  if (isGoalkeeper) {
    return isFirstTeam
      ? [
          { key: "matchesPlayed", label: "PJ" },
          { key: "goalsConceded", label: "GC" },
          { key: "saves", label: "Paradas" },
          { key: "cleanSheets", label: "Port. a 0" },
          { key: "mvp", label: "MVP" },
          { key: "yellowCards", label: "TA" },
          { key: "redCards", label: "TR" },
          { key: "ownGoals", label: "GP" },
        ]
      : [
          { key: "matchesPlayed", label: "PJ" },
          { key: "goalsConceded", label: "GC" },
          { key: "cleanSheets", label: "Port. a 0" },
          { key: "mvp", label: "MVP" },
          { key: "yellowCards", label: "TA" },
          { key: "redCards", label: "TR" },
          { key: "ownGoals", label: "GP" },
        ];
  }

  return isFirstTeam
    ? [
        { key: "matchesPlayed", label: "PJ" },
        { key: "goals", label: "Goles" },
        { key: "assists", label: "Asist." },
        { key: "mvp", label: "MVP" },
        { key: "yellowCards", label: "TA" },
        { key: "redCards", label: "TR" },
        { key: "recoveries", label: "Recup." },
        { key: "shots", label: "Tiros" },
        { key: "shotsOnTarget", label: "A puerta" },
        { key: "ownGoals", label: "GP" },
      ]
    : [
        { key: "matchesPlayed", label: "PJ" },
        { key: "goals", label: "Goles" },
        { key: "assists", label: "Asist." },
        { key: "mvp", label: "MVP" },
        { key: "yellowCards", label: "TA" },
        { key: "redCards", label: "TR" },
        { key: "ownGoals", label: "GP" },
      ];
}

export function updatePlayerStat(
  players: AdminPlayer[],
  playerId: string,
  field: AdminStatFieldKey,
  value: number,
) {
  return players.map((player) =>
    player.id === playerId
      ? {
          ...player,
          [field]: sanitizeNonNegativeInt(value),
        }
      : player,
  );
}

export function incrementPlayerStat(
  players: AdminPlayer[],
  playerId: string,
  field: AdminStatFieldKey,
  delta: number,
) {
  return players.map((player) =>
    player.id === playerId
      ? {
          ...player,
          [field]: sanitizeNonNegativeInt(player[field] + delta),
        }
      : player,
  );
}

export function splitAdminStatFieldsForMobile(
  fields: AdminStatField[],
  isGoalkeeper: boolean,
) {
  const primaryKeys = isGoalkeeper
    ? mobilePrimaryGoalkeeperFieldKeys
    : mobilePrimaryOutfieldFieldKeys;
  const primaryFields: AdminStatField[] = [];
  const secondaryFields: AdminStatField[] = [];

  fields.forEach((field) => {
    if (primaryKeys.has(field.key)) {
      primaryFields.push(field);
      return;
    }

    secondaryFields.push(field);
  });

  return {
    primaryFields,
    secondaryFields,
  };
}

export function isMobileStepperField(fieldKey: AdminStatFieldKey) {
  void fieldKey;
  return true;
}

export function isMobileAutoAdvanceField(fieldKey: AdminStatFieldKey) {
  return mobileAutoAdvanceFieldKeys.has(fieldKey);
}
