/*
  Warnings:

  - You are about to drop the `character_skills` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `character_skills` DROP FOREIGN KEY `character_skills_character_id_fkey`;

-- DropTable
DROP TABLE `character_skills`;

-- CreateTable
CREATE TABLE `character_talents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `character_id` INTEGER NOT NULL,
    `talent_type` VARCHAR(20) NOT NULL,
    `talent_name` VARCHAR(100) NOT NULL,
    `talent_description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `character_passives` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `character_id` INTEGER NOT NULL,
    `passive_order` INTEGER NOT NULL,
    `passive_name` VARCHAR(100) NOT NULL,
    `passive_description` TEXT NULL,
    `unlock_level` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `character_talents` ADD CONSTRAINT `character_talents_character_id_fkey` FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_passives` ADD CONSTRAINT `character_passives_character_id_fkey` FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
