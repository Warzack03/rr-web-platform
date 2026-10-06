-- Restore the canonical second-leg fixture if the legacy de-duplication archived it.
-- The First Team record and its original matchday 17 are authoritative.
UPDATE `matches` AS canonical
INNER JOIN `season_teams` AS first_team
  ON first_team.id = canonical.seasonTeamId
INNER JOIN `teams` AS first_team_base
  ON first_team_base.id = first_team.teamId
INNER JOIN `season_teams` AS senior_c
  ON senior_c.seasonId = canonical.seasonId
  AND LOWER(senior_c.publicName) = 'senior c'
  AND senior_c.deletedAt IS NULL
SET
  canonical.clubOpponentSeasonTeamId = senior_c.id,
  canonical.opponentId = NULL,
  canonical.opponentName = senior_c.publicName,
  canonical.matchday = 17,
  canonical.deletedAt = NULL,
  canonical.updatedAt = CURRENT_TIMESTAMP(3)
WHERE
  first_team_base.isFirstTeam = TRUE
  AND canonical.matchday = 17
  AND LOWER(canonical.opponentName) = 'senior c'
  AND DATE(canonical.dateTime) = '2027-03-13';

-- Keep only the reverse legacy copy archived.
UPDATE `matches` AS duplicate
INNER JOIN `season_teams` AS senior_c
  ON senior_c.id = duplicate.seasonTeamId
INNER JOIN `season_teams` AS first_team
  ON first_team.seasonId = duplicate.seasonId
  AND LOWER(first_team.publicName) = 'primer equipo'
  AND first_team.deletedAt IS NULL
SET
  duplicate.deletedAt = COALESCE(duplicate.deletedAt, CURRENT_TIMESTAMP(3)),
  duplicate.updatedAt = CURRENT_TIMESTAMP(3)
WHERE
  LOWER(senior_c.publicName) = 'senior c'
  AND LOWER(duplicate.opponentName) = 'primer equipo'
  AND duplicate.matchday = 16
  AND DATE(duplicate.dateTime) = '2027-03-13';
