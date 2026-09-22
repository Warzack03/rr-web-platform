-- Add a dedicated media category for the compact player portrait used in statistics.
ALTER TABLE `media_assets`
    MODIFY `usage` ENUM('PLAYER_PHOTO', 'PLAYER_CARD', 'PLAYER_STATS', 'TEAM_LOGO', 'TEAM_LISTING', 'TEAM_BANNER', 'NEWS_COVER', 'OPPONENT_LOGO', 'OTHER') NOT NULL DEFAULT 'OTHER';

-- Keep detail, card and statistics images independent for every player.
ALTER TABLE `players` ADD COLUMN `statsMediaId` BIGINT NULL;

ALTER TABLE `players`
    ADD CONSTRAINT `players_statsMediaId_fkey`
    FOREIGN KEY (`statsMediaId`) REFERENCES `media_assets`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;
