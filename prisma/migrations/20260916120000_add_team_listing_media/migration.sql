-- AlterTable
ALTER TABLE `media_assets`
    MODIFY `usage` ENUM('PLAYER_PHOTO', 'PLAYER_CARD', 'TEAM_LOGO', 'TEAM_LISTING', 'TEAM_BANNER', 'NEWS_COVER', 'OPPONENT_LOGO', 'OTHER') NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE `season_teams` ADD COLUMN `listingMediaId` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `season_teams` ADD CONSTRAINT `season_teams_listingMediaId_fkey` FOREIGN KEY (`listingMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
