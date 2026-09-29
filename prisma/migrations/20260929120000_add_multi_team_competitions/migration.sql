-- A team can participate in several independent competitions during one season.
CREATE TABLE `season_team_competitions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `seasonTeamId` BIGINT NOT NULL,
    `competitionId` BIGINT NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `publicVisible` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `startDate` DATE NULL,
    `endDate` DATE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `stc_team_competition_uq`(`seasonTeamId`, `competitionId`),
    INDEX `stc_competition_active_idx`(`competitionId`, `active`),
    INDEX `stc_team_public_order_idx`(`seasonTeamId`, `publicVisible`, `displayOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Preserve every existing primary assignment as the first participation.
INSERT INTO `season_team_competitions` (
    `seasonTeamId`,
    `competitionId`,
    `isPrimary`,
    `active`,
    `publicVisible`,
    `displayOrder`,
    `createdAt`,
    `updatedAt`
)
SELECT
    `id`,
    `competitionId`,
    true,
    true,
    true,
    0,
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
FROM `season_teams`
WHERE `competitionId` IS NOT NULL;

ALTER TABLE `season_team_competitions`
    ADD CONSTRAINT `stc_season_team_fk`
    FOREIGN KEY (`seasonTeamId`) REFERENCES `season_teams`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `season_team_competitions`
    ADD CONSTRAINT `stc_competition_fk`
    FOREIGN KEY (`competitionId`) REFERENCES `competitions`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;
