import type { MatchManagementMatch } from "@/lib/admin/match-management-mocks";
import type { AdminPlayer } from "@/lib/admin/mock-data";
import type { PlayerStatIcon as PlayerStatIconType } from "@/lib/public/player-detail-helpers";

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

export type AdminEditableStatFieldKey = Exclude<
  AdminStatFieldKey,
  "minutes" | "matchesPlayed"
>;

export type AdminStatField = {
  key: AdminEditableStatFieldKey;
  label: string;
  icon: PlayerStatIconType;
};

export type AdminMatchPlayerEntry = {
  playerId: string;
  played: boolean;
} & Pick<AdminPlayer, AdminEditableStatFieldKey>;

export type AdminStatsState = {
  carryOverByPlayerId: Record<
    string,
    Pick<AdminPlayer, "matchesPlayed" | AdminEditableStatFieldKey>
  >;
  matchEntriesByMatchId: Record<string, Record<string, AdminMatchPlayerEntry>>;
};

const goalkeeperTokens = new Set(["POR", "PORTERO", "GOALKEEPER"]);
const seededMatchStatuses = new Set<MatchManagementMatch["status"]>(["played", "live"]);
const mobilePrimaryOutfieldFieldKeys = new Set<AdminEditableStatFieldKey>([
  "goals",
  "assists",
  "mvp",
  "yellowCards",
  "redCards",
]);
const mobilePrimaryGoalkeeperFieldKeys = new Set<AdminEditableStatFieldKey>([
  "mvp",
  "goalsConceded",
  "saves",
  "cleanSheets",
]);
const mobileAutoAdvanceFieldKeys = new Set<AdminEditableStatFieldKey>([
  "mvp",
  "yellowCards",
  "redCards",
  "cleanSheets",
]);
const editableStatFieldKeys: AdminEditableStatFieldKey[] = [
  "goals",
  "assists",
  "mvp",
  "yellowCards",
  "redCards",
  "recoveries",
  "shots",
  "shotsOnTarget",
  "ownGoals",
  "goalsConceded",
  "saves",
  "cleanSheets",
];

export const adminMatchEditableStatFieldKeys = editableStatFieldKeys;

const editableStatFieldMeta: Record<
  AdminEditableStatFieldKey,
  Omit<AdminStatField, "key">
> = {
  goals: { label: "Goles", icon: "goals" },
  assists: { label: "Asist.", icon: "assists" },
  mvp: { label: "MVP", icon: "mvps" },
  yellowCards: { label: "TA", icon: "yellowCard" },
  redCards: { label: "TR", icon: "redCard" },
  recoveries: { label: "Recup.", icon: "recoveries" },
  shots: { label: "Tiros", icon: "shots" },
  shotsOnTarget: { label: "A puerta", icon: "shotsOnTarget" },
  ownGoals: { label: "GP", icon: "ownGoals" },
  goalsConceded: { label: "GC", icon: "goalsAgainst" },
  saves: { label: "Paradas", icon: "saves" },
  cleanSheets: { label: "Port. a 0", icon: "cleanSheet" },
};

function sanitizeNonNegativeInt(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.trunc(value));
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function distributeValueAcrossBuckets(
  total: number,
  bucketCount: number,
  seedKey: string,
) {
  if (bucketCount <= 0 || total <= 0) {
    return Array.from({ length: bucketCount }, () => 0);
  }

  const baseValue = Math.floor(total / bucketCount);
  const remainder = total % bucketCount;
  const distribution = Array.from({ length: bucketCount }, () => baseValue);
  const startIndex = hashString(seedKey) % bucketCount;

  for (let index = 0; index < remainder; index += 1) {
    distribution[(startIndex + index) % bucketCount] += 1;
  }

  return distribution;
}

function getMatchSeedTimestamp(match: Pick<MatchManagementMatch, "date" | "time">) {
  if (!match.date) {
    return Number.NEGATIVE_INFINITY;
  }

  return Date.parse(`${match.date}T${match.time || "12:00"}:00`);
}

function createEmptyMatchEntry(playerId: string): AdminMatchPlayerEntry {
  return {
    playerId,
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
    goalsConceded: 0,
    saves: 0,
    cleanSheets: 0,
  };
}

function getEntryValue(entry: AdminMatchPlayerEntry, field: AdminEditableStatFieldKey) {
  return entry[field];
}

export function hasAdminMatchEntryImpact(entry?: AdminMatchPlayerEntry) {
  if (!entry) {
    return false;
  }

  return entry.played || editableStatFieldKeys.some((field) => entry[field] > 0);
}

function getPlayerStatValue(
  player: Pick<AdminPlayer, AdminEditableStatFieldKey>,
  field: AdminEditableStatFieldKey,
) {
  return player[field];
}

function cloneMatchEntry(entry: AdminMatchPlayerEntry): AdminMatchPlayerEntry {
  return { ...entry };
}

export function cloneAdminStatsState(state: AdminStatsState): AdminStatsState {
  return {
    carryOverByPlayerId: Object.fromEntries(
      Object.entries(state.carryOverByPlayerId).map(([playerId, totals]) => [
        playerId,
        { ...totals },
      ]),
    ),
    matchEntriesByMatchId: Object.fromEntries(
      Object.entries(state.matchEntriesByMatchId).map(([matchId, entries]) => [
        matchId,
        Object.fromEntries(
          Object.entries(entries).map(([playerId, entry]) => [
            playerId,
            cloneMatchEntry(entry),
          ]),
        ),
      ]),
    ),
  };
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
    const fields: AdminEditableStatFieldKey[] = isFirstTeam
      ? [
          "mvp",
          "goalsConceded",
          "saves",
          "cleanSheets",
          "yellowCards",
          "redCards",
          "ownGoals",
        ]
      : [
          "mvp",
          "goalsConceded",
          "cleanSheets",
          "yellowCards",
          "redCards",
          "ownGoals",
        ];

    return isFirstTeam
      ? fields.map((field) => ({
          key: field,
          ...editableStatFieldMeta[field],
        }))
      : fields.map((field) => ({
          key: field,
          ...editableStatFieldMeta[field],
        }));
  }

  const fields: AdminEditableStatFieldKey[] = isFirstTeam
    ? [
        "goals",
        "assists",
        "mvp",
        "yellowCards",
        "redCards",
        "recoveries",
        "shots",
        "shotsOnTarget",
        "ownGoals",
      ]
    : [
        "goals",
        "assists",
        "mvp",
        "yellowCards",
        "redCards",
        "ownGoals",
      ];

  return fields.map((field) => ({
    key: field,
    ...editableStatFieldMeta[field],
  }));
}

export function createInitialAdminStatsState(
  players: AdminPlayer[],
  matches: MatchManagementMatch[],
): AdminStatsState {
  const matchesByTeamSlug = matches.reduce<
    Record<string, MatchManagementMatch[]>
  >((accumulator, match) => {
    const currentTeamMatches = accumulator[match.teamSlug] ?? [];
    currentTeamMatches.push(match);
    accumulator[match.teamSlug] = currentTeamMatches;
    return accumulator;
  }, {});

  const carryOverByPlayerId: AdminStatsState["carryOverByPlayerId"] = {};
  const matchEntriesByMatchId: AdminStatsState["matchEntriesByMatchId"] = Object.fromEntries(
    matches.map((match) => [match.id, {}]),
  );

  players.forEach((player) => {
    const teamMatches = (matchesByTeamSlug[player.teamSlug] ?? []).slice();
    const seededMatches = teamMatches
      .filter((match) => seededMatchStatuses.has(match.status))
      .sort((left, right) => getMatchSeedTimestamp(right) - getMatchSeedTimestamp(left));
    const allocatedMatchCount = Math.min(player.matchesPlayed, seededMatches.length);
    const allocatedMatches = seededMatches.slice(0, allocatedMatchCount);
    const distributions = Object.fromEntries(
      editableStatFieldKeys.map((field) => [
        field,
        distributeValueAcrossBuckets(
          getPlayerStatValue(player, field),
          allocatedMatchCount,
          `${player.id}-${field}`,
        ),
      ]),
    ) as Record<AdminEditableStatFieldKey, number[]>;

    carryOverByPlayerId[player.id] = {
      matchesPlayed: player.matchesPlayed - allocatedMatchCount,
      goals: player.goals,
      assists: player.assists,
      mvp: player.mvp,
      yellowCards: player.yellowCards,
      redCards: player.redCards,
      recoveries: player.recoveries,
      shots: player.shots,
      shotsOnTarget: player.shotsOnTarget,
      ownGoals: player.ownGoals,
      goalsConceded: player.goalsConceded,
      saves: player.saves,
      cleanSheets: player.cleanSheets,
    };

    teamMatches.forEach((match) => {
      matchEntriesByMatchId[match.id][player.id] = createEmptyMatchEntry(player.id);
    });

    allocatedMatches.forEach((match, matchIndex) => {
      const seededEntry = createEmptyMatchEntry(player.id);
      seededEntry.played = true;

      editableStatFieldKeys.forEach((field) => {
        const value = distributions[field][matchIndex] ?? 0;
        seededEntry[field] = value;
        carryOverByPlayerId[player.id][field] -= value;
      });

      matchEntriesByMatchId[match.id][player.id] = seededEntry;
    });
  });

  return {
    carryOverByPlayerId,
    matchEntriesByMatchId,
  };
}

export function getMatchEntryForPlayer(
  state: AdminStatsState,
  matchId: string,
  playerId: string,
) {
  return (
    state.matchEntriesByMatchId[matchId]?.[playerId] ??
    createEmptyMatchEntry(playerId)
  );
}

function withUpdatedEntry(
  state: AdminStatsState,
  matchId: string,
  playerId: string,
  transform: (entry: AdminMatchPlayerEntry) => AdminMatchPlayerEntry,
) {
  const currentMatchEntries = state.matchEntriesByMatchId[matchId] ?? {};
  const currentEntry =
    currentMatchEntries[playerId] ?? createEmptyMatchEntry(playerId);

  return {
    ...state,
    matchEntriesByMatchId: {
      ...state.matchEntriesByMatchId,
      [matchId]: {
        ...currentMatchEntries,
        [playerId]: transform(currentEntry),
      },
    },
  };
}

export function togglePlayerMatchParticipation(
  state: AdminStatsState,
  matchId: string,
  playerId: string,
) {
  return withUpdatedEntry(state, matchId, playerId, (entry) => {
    if (entry.played) {
      return createEmptyMatchEntry(playerId);
    }

    return {
      ...entry,
      played: true,
    };
  });
}

export function updatePlayerMatchStat(
  state: AdminStatsState,
  matchId: string,
  playerId: string,
  field: AdminEditableStatFieldKey,
  value: number,
) {
  const nextValue = sanitizeNonNegativeInt(value);

  return withUpdatedEntry(state, matchId, playerId, (entry) => ({
    ...entry,
    played: entry.played || nextValue > 0,
    [field]: nextValue,
  }));
}

export function incrementPlayerMatchStat(
  state: AdminStatsState,
  matchId: string,
  playerId: string,
  field: AdminEditableStatFieldKey,
  delta: number,
) {
  return withUpdatedEntry(state, matchId, playerId, (entry) => {
    const nextValue = sanitizeNonNegativeInt(getEntryValue(entry, field) + delta);

    return {
      ...entry,
      played: entry.played || nextValue > 0,
      [field]: nextValue,
    };
  });
}

export function getSeasonPlayerTotals(
  player: AdminPlayer,
  state: AdminStatsState,
): AdminPlayer {
  const carryOver = state.carryOverByPlayerId[player.id];
  const playerEntries = Object.values(state.matchEntriesByMatchId)
    .map((matchEntries) => matchEntries[player.id])
    .filter((entry): entry is AdminMatchPlayerEntry => Boolean(entry));

  const aggregated = editableStatFieldKeys.reduce<
    Pick<AdminPlayer, AdminEditableStatFieldKey>
  >((accumulator, field) => {
    accumulator[field] =
      (carryOver?.[field] ?? 0) +
      playerEntries.reduce((total, entry) => total + entry[field], 0);
    return accumulator;
  }, {} as Pick<AdminPlayer, AdminEditableStatFieldKey>);

  const matchesPlayed =
    (carryOver?.matchesPlayed ?? player.matchesPlayed) +
    playerEntries.filter((entry) => entry.played).length;

  return {
    ...player,
    matchesPlayed,
    ...aggregated,
  };
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

export function isMobileStepperField(fieldKey: AdminEditableStatFieldKey) {
  void fieldKey;
  return true;
}

export function isMobileAutoAdvanceField(fieldKey: AdminEditableStatFieldKey) {
  return mobileAutoAdvanceFieldKeys.has(fieldKey);
}
