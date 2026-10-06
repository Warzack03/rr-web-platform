-- A fixture between two Rising Raimon teams is stored once and projected in both calendars.
ALTER TABLE `matches`
  ADD COLUMN `clubOpponentSeasonTeamId` BIGINT NULL;

CREATE INDEX `matches_clubOpponentSeasonTeamId_status_idx`
  ON `matches`(`clubOpponentSeasonTeamId`, `status`);

ALTER TABLE `matches`
  ADD CONSTRAINT `matches_clubOpponentSeasonTeamId_fkey`
  FOREIGN KEY (`clubOpponentSeasonTeamId`) REFERENCES `season_teams`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
