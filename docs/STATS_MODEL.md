# STATS_MODEL.md

## General principles

- Statistics stay attached to the player + team + season + match where they were created.
- If a player changes team, historical stats do not move.
- Goal participation = goals + assists.
- Do not allow negative stats.
- Derived metrics must avoid division by zero.
- The source of truth is the match-level stat line; season totals are derived from it.
- `matchesPlayed` should be derived from participation in matches, not edited as a manual aggregate in the main admin flow.

## Admin backoffice flow

- The selected match is the active edit context.
- The admin should be able to mark whether each player played that match.
- If a player did not play, that match contributes `0` stats and does not add `PJ`.
- The same screen should still keep season totals and derived metrics visible.
- The model should also allow occasional appearances for players outside the
  regular roster of that team, keeping those stats attached to the
  player + team-context + season + match where they occurred.

## First Team field player stats

- Matches played.
- Goals.
- Assists.
- Yellow cards.
- Red cards.
- Recoveries.
- Shots.
- Shots on target.
- Own goals.
- MVP's.

Derived examples:

- Goal participations.
- Goals per match.
- Assists per match.
- Goal participations per match.
- Shots per match.
- Shot accuracy = shots on target / shots.

## First Team goalkeeper stats

- Matches played.
- Goals.
- Assists.
- Yellow cards.
- Red cards.
- Clean sheets / imbatidos.
- Saves.
- Own goals.
- MVP's.

Derived examples:

- Goal participations.
- Saves per match.
- Clean sheet rate.
- Goal participations per match.

## Academy/rest field player stats

- Matches played.
- Goals.
- Assists.
- Yellow cards.
- Red cards.
- Own goals.
- MVP's.

Derived examples:

- Goal participations.
- Goals per match.
- Assists per match.
- Goal participations per match.

## Academy/rest goalkeeper stats

- Matches played.
- Goals.
- Assists.
- Yellow cards.
- Red cards.
- Clean sheets / imbatidos.
- Own goals.
- MVP's.

Derived examples:

- Goal participations.
- Clean sheet rate.
- Goal participations per match.

## Public rendering rules

- First Team player detail can show advanced stats.
- Academy player detail must not show recoveries, shots, shots on target or saves.
- Do not render radar/tactical charts without real data. Use the space for stats/metrics instead.
