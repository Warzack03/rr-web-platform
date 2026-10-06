-- A fixture between two Rising Raimon teams is stored once and projected in both calendars.
ALTER TABLE `matches`
  ADD COLUMN `clubOpponentSeasonTeamId` BIGINT NULL;

CREATE INDEX `matches_clubOpponentSeasonTeamId_status_idx`
  ON `matches`(`clubOpponentSeasonTeamId`, `status`);

ALTER TABLE `matches`
  ADD CONSTRAINT `matches_clubOpponentSeasonTeamId_fkey`
  FOREIGN KEY (`clubOpponentSeasonTeamId`) REFERENCES `season_teams`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Repair legacy home/away duplicates created independently from both club teams.
-- The First Team row is kept as the canonical fixture; its existing matchday wins.
UPDATE `matches` AS canonical
INNER JOIN `season_teams` AS canonical_st
  ON canonical_st.id = canonical.seasonTeamId
INNER JOIN `teams` AS canonical_team
  ON canonical_team.id = canonical_st.teamId
INNER JOIN `matches` AS duplicate
  ON duplicate.competitionId = canonical.competitionId
  AND duplicate.dateTime <=> canonical.dateTime
  AND duplicate.id <> canonical.id
  AND duplicate.deletedAt IS NULL
INNER JOIN `season_teams` AS duplicate_st
  ON duplicate_st.id = duplicate.seasonTeamId
  AND duplicate_st.publicName = canonical.opponentName
SET
  canonical.clubOpponentSeasonTeamId = duplicate.seasonTeamId,
  canonical.opponentId = NULL,
  canonical.opponentName = duplicate_st.publicName,
  canonical.updatedAt = CURRENT_TIMESTAMP(3)
WHERE
  canonical.deletedAt IS NULL
  AND canonical.dateTime IS NOT NULL
  AND canonical_team.isFirstTeam = TRUE
  AND duplicate.opponentName = canonical_st.publicName
  AND NOT EXISTS (
    SELECT 1
    FROM `player_match_stats` AS duplicate_stats
    WHERE duplicate_stats.matchId = duplicate.id
  );

UPDATE `matches` AS duplicate
INNER JOIN `season_teams` AS duplicate_st
  ON duplicate_st.id = duplicate.seasonTeamId
INNER JOIN `matches` AS canonical
  ON canonical.clubOpponentSeasonTeamId = duplicate.seasonTeamId
  AND canonical.competitionId = duplicate.competitionId
  AND canonical.dateTime <=> duplicate.dateTime
  AND canonical.deletedAt IS NULL
INNER JOIN `season_teams` AS canonical_st
  ON canonical_st.id = canonical.seasonTeamId
SET
  duplicate.deletedAt = CURRENT_TIMESTAMP(3),
  duplicate.updatedAt = CURRENT_TIMESTAMP(3)
WHERE
  duplicate.deletedAt IS NULL
  AND duplicate.dateTime IS NOT NULL
  AND duplicate.id <> canonical.id
  AND duplicate.opponentName = canonical_st.publicName
  AND NOT EXISTS (
    SELECT 1
    FROM `player_match_stats` AS duplicate_stats
    WHERE duplicate_stats.matchId = duplicate.id
  );
