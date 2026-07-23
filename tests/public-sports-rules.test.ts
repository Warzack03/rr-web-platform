import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getVisualMatchStatus } from "@/lib/admin/match-management";
import type { PublicPlayerStats } from "@/lib/contracts/public";
import {
  calculateDerivedStatsFromValues,
  formatStatValueFromStats,
  getGoalContributions,
  getPlayerCardStats,
  getStatsColumns,
} from "@/lib/public/team-statistics-utils";
import { aggregatePublicPlayerStats } from "@/server/services/public/player-mappers";

function stats(overrides: Partial<PublicPlayerStats> = {}): PublicPlayerStats {
  return {
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    goalsAgainst: 0,
    yellowCards: 0,
    redCards: 0,
    recoveries: 0,
    shots: 0,
    shotsOnTarget: 0,
    ownGoals: 0,
    saves: 0,
    cleanSheets: 0,
    mvps: 0,
    ...overrides,
  };
}

describe("public sports rules", () => {
  it("aggregates global player stats across public rows", () => {
    const aggregated = aggregatePublicPlayerStats([
      {
        played: true,
        goals: 2,
        assists: 1,
        mvp: 1,
        yellowCards: 1,
        redCards: 0,
        recoveries: 4,
        shots: 5,
        shotsOnTarget: 3,
        ownGoals: 0,
        saves: 0,
        goalsAgainst: 0,
        cleanSheets: 0,
      },
      {
        played: true,
        goals: 1,
        assists: 2,
        mvp: 0,
        yellowCards: 0,
        redCards: 1,
        recoveries: 2,
        shots: 4,
        shotsOnTarget: 2,
        ownGoals: 1,
        saves: 0,
        goalsAgainst: 0,
        cleanSheets: 0,
      },
    ]);

    assert.equal(aggregated.matchesPlayed, 2);
    assert.equal(aggregated.goals, 3);
    assert.equal(aggregated.assists, 3);
    assert.equal(getGoalContributions(aggregated), 6);
    assert.equal(aggregated.mvps, 1);
    assert.equal(aggregated.ownGoals, 1);
  });

  it("uses safe derived stats and keeps goalsAgainstPerMatch for academy goalkeepers", () => {
    const derived = calculateDerivedStatsFromValues(
      stats({ matchesPlayed: 4, goals: 2, assists: 3, goalsAgainst: 6, cleanSheets: 2 }),
    );

    assert.equal(derived.goalContributions, 5);
    assert.equal(derived.goalsPerMatch, 0.5);
    assert.equal(derived.goalsAgainstPerMatch, 1.5);
    assert.equal(calculateDerivedStatsFromValues(stats({ goals: 3 })).goalsPerMatch, undefined);
    assert.equal(formatStatValueFromStats(stats({ goalsAgainst: 3 }), "goalsAgainstPerMatch"), "-");

    const academyGoalkeeperColumns = getStatsColumns("academy", "goalkeeper");
    assert.equal(
      academyGoalkeeperColumns.some((column) => column.key === "goalsAgainstPerMatch"),
      true,
    );
  });

  it("keeps first-team and academy card variants intentionally different", () => {
    const baseStats = stats({ matchesPlayed: 3, goals: 4, assists: 2, saves: 9, cleanSheets: 1 });

    assert.deepEqual(getPlayerCardStats("goalkeeper", baseStats, "academy"), [
      { label: "Goles", value: "4" },
      { label: "Asist.", value: "2" },
    ]);
    assert.deepEqual(getPlayerCardStats("goalkeeper", baseStats, "first-team"), [
      { label: "PJ", value: 3 },
      { label: "Imbat.", value: "1" },
      { label: "Paradas", value: "9" },
    ]);
  });

  it("normalizes postponed matches as pending in visual status", () => {
    assert.equal(getVisualMatchStatus("scheduled"), "pending");
    assert.equal(getVisualMatchStatus("postponed"), "pending");
    assert.equal(getVisualMatchStatus("live"), "live");
    assert.equal(getVisualMatchStatus("played"), "played");
  });
});
