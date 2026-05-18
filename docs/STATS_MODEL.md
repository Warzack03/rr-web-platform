# STATS_MODEL.md

## General principles

- Statistics stay attached to the player + team + season + match where they were created.
- If a player changes team, historical stats do not move.
- Goal participation = goals + assists.
- Do not allow negative stats.
- Derived metrics must avoid division by zero.

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
