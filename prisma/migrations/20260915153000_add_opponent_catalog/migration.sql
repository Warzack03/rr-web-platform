-- CreateTable
CREATE TABLE `opponents` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `competitionId` BIGINT NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `logoMediaId` BIGINT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `opponents_competitionId_slug_key`(`competitionId`, `slug`),
    INDEX `opponents_competitionId_active_idx`(`competitionId`, `active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `matches` ADD COLUMN `opponentId` BIGINT NULL;

-- AlterTable
ALTER TABLE `standing_rows` ADD COLUMN `opponentId` BIGINT NULL;

-- CreateIndex
CREATE INDEX `matches_opponentId_idx` ON `matches`(`opponentId`);

-- CreateIndex
CREATE INDEX `standing_rows_opponentId_idx` ON `standing_rows`(`opponentId`);

-- AddForeignKey
ALTER TABLE `opponents` ADD CONSTRAINT `opponents_competitionId_fkey` FOREIGN KEY (`competitionId`) REFERENCES `competitions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opponents` ADD CONSTRAINT `opponents_logoMediaId_fkey` FOREIGN KEY (`logoMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_opponentId_fkey` FOREIGN KEY (`opponentId`) REFERENCES `opponents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `standing_rows` ADD CONSTRAINT `standing_rows_opponentId_fkey` FOREIGN KEY (`opponentId`) REFERENCES `opponents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
