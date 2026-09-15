-- CreateTable
CREATE TABLE `venues` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `competitionId` BIGINT NOT NULL,
    `name` VARCHAR(180) NOT NULL,
    `slug` VARCHAR(190) NOT NULL,
    `address` VARCHAR(255) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `venues_competitionId_slug_key`(`competitionId`, `slug`),
    INDEX `venues_competitionId_active_idx`(`competitionId`, `active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `matches` ADD COLUMN `venueId` BIGINT NULL;

-- CreateIndex
CREATE INDEX `matches_venueId_idx` ON `matches`(`venueId`);

-- AddForeignKey
ALTER TABLE `venues` ADD CONSTRAINT `venues_competitionId_fkey` FOREIGN KEY (`competitionId`) REFERENCES `competitions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `venues`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
