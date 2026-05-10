-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(190) NOT NULL,
    `username` VARCHAR(80) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `displayName` VARCHAR(150) NOT NULL,
    `role` ENUM('SUPERADMIN', 'MANAGER', 'COACH') NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `activeSeasonId` BIGINT NULL,
    `publicSiteName` VARCHAR(150) NOT NULL DEFAULT 'Rising Raimon',
    `shopUrl` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seasons` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    `status` ENUM('DRAFT', 'CURRENT', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `activeKey` VARCHAR(20) NULL,
    `sourceSystem` VARCHAR(80) NULL,
    `sourceExternalId` VARCHAR(80) NULL,
    `lastImportBatchId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `seasons_name_key`(`name`),
    UNIQUE INDEX `seasons_slug_key`(`slug`),
    UNIQUE INDEX `seasons_activeKey_key`(`activeKey`),
    INDEX `seasons_sourceSystem_sourceExternalId_idx`(`sourceSystem`, `sourceExternalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `branch` VARCHAR(50) NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `isFirstTeam` BOOLEAN NOT NULL DEFAULT false,
    `sourceSystem` VARCHAR(80) NULL,
    `sourceExternalId` VARCHAR(80) NULL,
    `lastImportBatchId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `teams_code_key`(`code`),
    UNIQUE INDEX `teams_slug_key`(`slug`),
    INDEX `teams_sourceSystem_sourceExternalId_idx`(`sourceSystem`, `sourceExternalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `season_teams` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `seasonId` BIGINT NOT NULL,
    `teamId` BIGINT NOT NULL,
    `competitionId` BIGINT NULL,
    `publicName` VARCHAR(150) NOT NULL,
    `publicSlug` VARCHAR(160) NOT NULL,
    `category` VARCHAR(100) NULL,
    `competitionName` VARCHAR(150) NULL,
    `description` TEXT NULL,
    `publicVisible` BOOLEAN NOT NULL DEFAULT true,
    `logoMediaId` BIGINT NULL,
    `bannerMediaId` BIGINT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `sourceSystem` VARCHAR(80) NULL,
    `sourceExternalId` VARCHAR(80) NULL,
    `lastImportBatchId` BIGINT NULL,
    `createdById` BIGINT NULL,
    `updatedById` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `season_teams_publicVisible_active_idx`(`publicVisible`, `active`),
    INDEX `season_teams_sourceSystem_sourceExternalId_idx`(`sourceSystem`, `sourceExternalId`),
    UNIQUE INDEX `season_teams_seasonId_teamId_key`(`seasonId`, `teamId`),
    UNIQUE INDEX `season_teams_seasonId_publicSlug_key`(`seasonId`, `publicSlug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(150) NOT NULL,
    `lastName` VARCHAR(200) NOT NULL,
    `publicName` VARCHAR(180) NULL,
    `slug` VARCHAR(190) NOT NULL,
    `birthDate` DATE NULL,
    `countryCode` VARCHAR(2) NULL,
    `preferredFoot` VARCHAR(20) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `publicVisible` BOOLEAN NOT NULL DEFAULT true,
    `photoMediaId` BIGINT NULL,
    `premiumCardMediaId` BIGINT NULL,
    `sourceSystem` VARCHAR(80) NULL,
    `sourceExternalId` VARCHAR(80) NULL,
    `lastImportBatchId` BIGINT NULL,
    `createdById` BIGINT NULL,
    `updatedById` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `players_slug_key`(`slug`),
    INDEX `players_sourceSystem_sourceExternalId_idx`(`sourceSystem`, `sourceExternalId`),
    INDEX `players_publicVisible_active_idx`(`publicVisible`, `active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_season_profiles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `playerId` BIGINT NOT NULL,
    `seasonId` BIGINT NOT NULL,
    `primaryPosition` VARCHAR(50) NULL,
    `secondaryPosition` VARCHAR(50) NULL,
    `tertiaryPosition` VARCHAR(50) NULL,
    `publicPosition` VARCHAR(80) NULL,
    `level` INTEGER NULL,
    `sourceSystem` VARCHAR(80) NULL,
    `sourceExternalId` VARCHAR(80) NULL,
    `lastImportBatchId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `player_season_profiles_sourceSystem_sourceExternalId_idx`(`sourceSystem`, `sourceExternalId`),
    UNIQUE INDEX `player_season_profiles_playerId_seasonId_key`(`playerId`, `seasonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_player_assignments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `playerId` BIGINT NOT NULL,
    `seasonTeamId` BIGINT NOT NULL,
    `seasonId` BIGINT NOT NULL,
    `shirtNumber` INTEGER NULL,
    `position` VARCHAR(80) NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT true,
    `isManualException` BOOLEAN NOT NULL DEFAULT false,
    `isCaptain` BOOLEAN NOT NULL DEFAULT false,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `joinedAt` DATE NULL,
    `leftAt` DATE NULL,
    `sourceSystem` VARCHAR(80) NULL,
    `sourceExternalId` VARCHAR(80) NULL,
    `lastImportBatchId` BIGINT NULL,
    `createdById` BIGINT NULL,
    `updatedById` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `team_player_assignments_playerId_seasonId_idx`(`playerId`, `seasonId`),
    INDEX `team_player_assignments_seasonTeamId_active_idx`(`seasonTeamId`, `active`),
    INDEX `team_player_assignments_seasonId_active_idx`(`seasonId`, `active`),
    INDEX `team_player_assignments_sourceSystem_sourceExternalId_idx`(`sourceSystem`, `sourceExternalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_coaches` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `seasonTeamId` BIGINT NOT NULL,
    `userId` BIGINT NULL,
    `name` VARCHAR(150) NOT NULL,
    `roleLabel` VARCHAR(100) NOT NULL,
    `photoMediaId` BIGINT NULL,
    `publicVisible` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `team_coaches_seasonTeamId_publicVisible_idx`(`seasonTeamId`, `publicVisible`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coach_team_permissions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `seasonTeamId` BIGINT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdById` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `coach_team_permissions_seasonTeamId_active_idx`(`seasonTeamId`, `active`),
    UNIQUE INDEX `coach_team_permissions_userId_seasonTeamId_key`(`userId`, `seasonTeamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competitions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `seasonId` BIGINT NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `organizer` VARCHAR(100) NULL,
    `groupName` VARCHAR(100) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `competitions_seasonId_slug_key`(`seasonId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matches` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `seasonId` BIGINT NOT NULL,
    `seasonTeamId` BIGINT NOT NULL,
    `competitionId` BIGINT NULL,
    `matchday` INTEGER NULL,
    `dateTime` DATETIME(3) NULL,
    `venue` VARCHAR(180) NULL,
    `isHome` BOOLEAN NOT NULL DEFAULT true,
    `opponentName` VARCHAR(150) NOT NULL,
    `opponentLogoMediaId` BIGINT NULL,
    `status` ENUM('SCHEDULED', 'LIVE', 'PLAYED', 'POSTPONED') NOT NULL DEFAULT 'SCHEDULED',
    `homeScore` INTEGER NULL,
    `awayScore` INTEGER NULL,
    `summary` TEXT NULL,
    `videoUrl` VARCHAR(500) NULL,
    `videoLabel` VARCHAR(120) NULL,
    `liveUrl` VARCHAR(500) NULL,
    `publicVisible` BOOLEAN NOT NULL DEFAULT true,
    `createdById` BIGINT NULL,
    `updatedById` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `matches_seasonTeamId_status_idx`(`seasonTeamId`, `status`),
    INDEX `matches_seasonTeamId_dateTime_idx`(`seasonTeamId`, `dateTime`),
    INDEX `matches_seasonId_dateTime_idx`(`seasonId`, `dateTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `standing_tables` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `seasonId` BIGINT NOT NULL,
    `seasonTeamId` BIGINT NOT NULL,
    `competitionId` BIGINT NULL,
    `title` VARCHAR(150) NOT NULL,
    `sourceLabel` VARCHAR(150) NULL,
    `updatedLabel` VARCHAR(150) NULL,
    `publicVisible` BOOLEAN NOT NULL DEFAULT true,
    `createdById` BIGINT NULL,
    `updatedById` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `standing_tables_seasonTeamId_publicVisible_idx`(`seasonTeamId`, `publicVisible`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `standing_rows` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `standingTableId` BIGINT NOT NULL,
    `position` INTEGER NOT NULL,
    `teamName` VARCHAR(150) NOT NULL,
    `played` INTEGER NOT NULL DEFAULT 0,
    `won` INTEGER NOT NULL DEFAULT 0,
    `drawn` INTEGER NOT NULL DEFAULT 0,
    `lost` INTEGER NOT NULL DEFAULT 0,
    `goalsFor` INTEGER NOT NULL DEFAULT 0,
    `goalsAgainst` INTEGER NOT NULL DEFAULT 0,
    `goalDifference` INTEGER NOT NULL DEFAULT 0,
    `points` INTEGER NOT NULL DEFAULT 0,
    `isOwnTeam` BOOLEAN NOT NULL DEFAULT false,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `standing_rows_standingTableId_displayOrder_idx`(`standingTableId`, `displayOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_match_stats` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `matchId` BIGINT NOT NULL,
    `seasonId` BIGINT NOT NULL,
    `seasonTeamId` BIGINT NOT NULL,
    `playerId` BIGINT NOT NULL,
    `statRole` ENUM('FIELD_PLAYER', 'GOALKEEPER') NOT NULL DEFAULT 'FIELD_PLAYER',
    `played` BOOLEAN NOT NULL DEFAULT false,
    `goals` INTEGER NOT NULL DEFAULT 0,
    `assists` INTEGER NOT NULL DEFAULT 0,
    `yellowCards` INTEGER NOT NULL DEFAULT 0,
    `redCards` INTEGER NOT NULL DEFAULT 0,
    `recoveries` INTEGER NOT NULL DEFAULT 0,
    `shots` INTEGER NOT NULL DEFAULT 0,
    `shotsOnTarget` INTEGER NOT NULL DEFAULT 0,
    `ownGoals` INTEGER NOT NULL DEFAULT 0,
    `saves` INTEGER NOT NULL DEFAULT 0,
    `goalsAgainst` INTEGER NOT NULL DEFAULT 0,
    `cleanSheets` INTEGER NOT NULL DEFAULT 0,
    `shotsOnTargetAgainst` INTEGER NOT NULL DEFAULT 0,
    `createdById` BIGINT NULL,
    `updatedById` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `player_match_stats_playerId_seasonId_idx`(`playerId`, `seasonId`),
    INDEX `player_match_stats_seasonTeamId_seasonId_idx`(`seasonTeamId`, `seasonId`),
    UNIQUE INDEX `player_match_stats_matchId_playerId_key`(`matchId`, `playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news_posts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(180) NOT NULL,
    `slug` VARCHAR(190) NOT NULL,
    `excerpt` VARCHAR(300) NULL,
    `bodyMarkdown` TEXT NOT NULL,
    `coverMediaId` BIGINT NULL,
    `externalVideoUrl` VARCHAR(500) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `authorId` BIGINT NULL,
    `createdById` BIGINT NULL,
    `updatedById` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `news_posts_slug_key`(`slug`),
    INDEX `news_posts_status_publishedAt_idx`(`status`, `publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news_post_teams` (
    `newsPostId` BIGINT NOT NULL,
    `seasonTeamId` BIGINT NOT NULL,

    PRIMARY KEY (`newsPostId`, `seasonTeamId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media_assets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `type` ENUM('IMAGE', 'VIDEO_LINK', 'DOCUMENT') NOT NULL DEFAULT 'IMAGE',
    `usage` ENUM('PLAYER_PHOTO', 'PLAYER_CARD', 'TEAM_LOGO', 'TEAM_BANNER', 'NEWS_COVER', 'OPPONENT_LOGO', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `storagePath` VARCHAR(500) NULL,
    `publicUrl` VARCHAR(500) NOT NULL,
    `externalUrl` VARCHAR(500) NULL,
    `altText` VARCHAR(255) NULL,
    `mimeType` VARCHAR(100) NULL,
    `sizeBytes` INTEGER NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `uploadedById` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `media_assets_usage_idx`(`usage`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `import_batches` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sourceSystem` VARCHAR(80) NOT NULL DEFAULT 'rr-management',
    `seasonId` BIGINT NULL,
    `status` ENUM('UPLOADED', 'VALIDATED', 'APPLIED', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'UPLOADED',
    `fileName` VARCHAR(255) NULL,
    `fileHash` VARCHAR(128) NULL,
    `summaryJson` JSON NULL,
    `createdById` BIGINT NULL,
    `validatedAt` DATETIME(3) NULL,
    `appliedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `import_batches_sourceSystem_status_idx`(`sourceSystem`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `import_batch_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `importBatchId` BIGINT NOT NULL,
    `entityType` VARCHAR(80) NOT NULL,
    `sourceExternalId` VARCHAR(80) NULL,
    `action` ENUM('CREATE', 'UPDATE', 'INACTIVATE', 'SKIP', 'CONFLICT', 'ERROR') NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    `message` VARCHAR(500) NULL,
    `beforeJson` JSON NULL,
    `afterJson` JSON NULL,
    `errorJson` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `appliedAt` DATETIME(3) NULL,

    INDEX `import_batch_items_importBatchId_entityType_idx`(`importBatchId`, `entityType`),
    INDEX `import_batch_items_sourceExternalId_idx`(`sourceExternalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `site_settings` ADD CONSTRAINT `site_settings_activeSeasonId_fkey` FOREIGN KEY (`activeSeasonId`) REFERENCES `seasons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seasons` ADD CONSTRAINT `seasons_lastImportBatchId_fkey` FOREIGN KEY (`lastImportBatchId`) REFERENCES `import_batches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_lastImportBatchId_fkey` FOREIGN KEY (`lastImportBatchId`) REFERENCES `import_batches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `season_teams` ADD CONSTRAINT `season_teams_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `seasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `season_teams` ADD CONSTRAINT `season_teams_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `season_teams` ADD CONSTRAINT `season_teams_competitionId_fkey` FOREIGN KEY (`competitionId`) REFERENCES `competitions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `season_teams` ADD CONSTRAINT `season_teams_logoMediaId_fkey` FOREIGN KEY (`logoMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `season_teams` ADD CONSTRAINT `season_teams_bannerMediaId_fkey` FOREIGN KEY (`bannerMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `season_teams` ADD CONSTRAINT `season_teams_lastImportBatchId_fkey` FOREIGN KEY (`lastImportBatchId`) REFERENCES `import_batches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `players` ADD CONSTRAINT `players_photoMediaId_fkey` FOREIGN KEY (`photoMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `players` ADD CONSTRAINT `players_premiumCardMediaId_fkey` FOREIGN KEY (`premiumCardMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `players` ADD CONSTRAINT `players_lastImportBatchId_fkey` FOREIGN KEY (`lastImportBatchId`) REFERENCES `import_batches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_season_profiles` ADD CONSTRAINT `player_season_profiles_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_season_profiles` ADD CONSTRAINT `player_season_profiles_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `seasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_season_profiles` ADD CONSTRAINT `player_season_profiles_lastImportBatchId_fkey` FOREIGN KEY (`lastImportBatchId`) REFERENCES `import_batches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_player_assignments` ADD CONSTRAINT `team_player_assignments_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_player_assignments` ADD CONSTRAINT `team_player_assignments_seasonTeamId_fkey` FOREIGN KEY (`seasonTeamId`) REFERENCES `season_teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_player_assignments` ADD CONSTRAINT `team_player_assignments_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `seasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_player_assignments` ADD CONSTRAINT `team_player_assignments_lastImportBatchId_fkey` FOREIGN KEY (`lastImportBatchId`) REFERENCES `import_batches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_coaches` ADD CONSTRAINT `team_coaches_seasonTeamId_fkey` FOREIGN KEY (`seasonTeamId`) REFERENCES `season_teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_coaches` ADD CONSTRAINT `team_coaches_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_coaches` ADD CONSTRAINT `team_coaches_photoMediaId_fkey` FOREIGN KEY (`photoMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coach_team_permissions` ADD CONSTRAINT `coach_team_permissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coach_team_permissions` ADD CONSTRAINT `coach_team_permissions_seasonTeamId_fkey` FOREIGN KEY (`seasonTeamId`) REFERENCES `season_teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competitions` ADD CONSTRAINT `competitions_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `seasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `seasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_seasonTeamId_fkey` FOREIGN KEY (`seasonTeamId`) REFERENCES `season_teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_competitionId_fkey` FOREIGN KEY (`competitionId`) REFERENCES `competitions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_opponentLogoMediaId_fkey` FOREIGN KEY (`opponentLogoMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `standing_tables` ADD CONSTRAINT `standing_tables_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `seasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `standing_tables` ADD CONSTRAINT `standing_tables_seasonTeamId_fkey` FOREIGN KEY (`seasonTeamId`) REFERENCES `season_teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `standing_tables` ADD CONSTRAINT `standing_tables_competitionId_fkey` FOREIGN KEY (`competitionId`) REFERENCES `competitions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `standing_rows` ADD CONSTRAINT `standing_rows_standingTableId_fkey` FOREIGN KEY (`standingTableId`) REFERENCES `standing_tables`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_match_stats` ADD CONSTRAINT `player_match_stats_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `matches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_match_stats` ADD CONSTRAINT `player_match_stats_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `seasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_match_stats` ADD CONSTRAINT `player_match_stats_seasonTeamId_fkey` FOREIGN KEY (`seasonTeamId`) REFERENCES `season_teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_match_stats` ADD CONSTRAINT `player_match_stats_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_posts` ADD CONSTRAINT `news_posts_coverMediaId_fkey` FOREIGN KEY (`coverMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_posts` ADD CONSTRAINT `news_posts_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_post_teams` ADD CONSTRAINT `news_post_teams_newsPostId_fkey` FOREIGN KEY (`newsPostId`) REFERENCES `news_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_post_teams` ADD CONSTRAINT `news_post_teams_seasonTeamId_fkey` FOREIGN KEY (`seasonTeamId`) REFERENCES `season_teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media_assets` ADD CONSTRAINT `media_assets_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `import_batches` ADD CONSTRAINT `import_batches_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `seasons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `import_batch_items` ADD CONSTRAINT `import_batch_items_importBatchId_fkey` FOREIGN KEY (`importBatchId`) REFERENCES `import_batches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
