-- CreateTable
CREATE TABLE `elements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `element_name` VARCHAR(30) NOT NULL,
    `element_color` VARCHAR(10) NOT NULL,
    `element_icon` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weapon_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weapon_type_name` VARCHAR(30) NOT NULL,
    `weapon_type_icon` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `region_name` VARCHAR(50) NOT NULL,
    `overview` TEXT NULL,
    `world_map` VARCHAR(30) NULL,
    `archon_quest` VARCHAR(100) NULL,
    `associated_element` VARCHAR(30) NULL,
    `archon` VARCHAR(50) NULL,
    `ideal` VARCHAR(30) NULL,
    `main_city` VARCHAR(50) NULL,
    `controlling_entity` VARCHAR(100) NULL,
    `celebrated_festivals` TEXT NULL,
    `how_to_access` TEXT NULL,
    `region_icon` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `region_areas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `region_id` INTEGER NOT NULL,
    `area_name` VARCHAR(100) NOT NULL,
    `area_description` TEXT NULL,
    `area_image` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `region_features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `region_id` INTEGER NOT NULL,
    `feature_name` VARCHAR(100) NOT NULL,
    `feature_description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rarities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rarity_value` INTEGER NOT NULL,
    `rarity_color` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `characters` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `title` VARCHAR(100) NULL,
    `detail` TEXT NULL,
    `constellation` VARCHAR(100) NULL,
    `element_id` INTEGER NULL,
    `weapon_type_id` INTEGER NULL,
    `region_id` INTEGER NULL,
    `rarity_id` INTEGER NULL,
    `icon` VARCHAR(255) NULL,
    `gacha_img` VARCHAR(255) NULL,
    `birthday` VARCHAR(20) NULL,
    `release_date` BIGINT NULL,
    `native` VARCHAR(100) NULL,
    `cv_en` VARCHAR(100) NULL,
    `cv_chs` VARCHAR(100) NULL,
    `cv_jp` VARCHAR(100) NULL,
    `cv_kr` VARCHAR(100) NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `character_stats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `character_id` INTEGER NOT NULL,
    `ascension` INTEGER NOT NULL,
    `level` INTEGER NOT NULL,
    `base_atk` DOUBLE NOT NULL,
    `crit_dmg` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `character_skills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `character_id` INTEGER NOT NULL,
    `skill_type` VARCHAR(20) NOT NULL,
    `skill_name` VARCHAR(100) NOT NULL,
    `skill_description` TEXT NULL,
    `skill_icon` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `character_constellations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `character_id` INTEGER NOT NULL,
    `constellation_level` INTEGER NOT NULL,
    `constellation_name` VARCHAR(100) NOT NULL,
    `constellation_description` TEXT NULL,
    `constellation_icon` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weapons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `weapon_type_id` INTEGER NOT NULL,
    `rarity_id` INTEGER NOT NULL,
    `special_property` VARCHAR(50) NULL,
    `icon` VARCHAR(255) NULL,
    `story` TEXT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weapon_passives` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weapon_id` INTEGER NOT NULL,
    `passive_name` VARCHAR(100) NOT NULL,
    `passive_description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weapon_refinements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weapon_id` INTEGER NOT NULL,
    `refinement_level` INTEGER NOT NULL,
    `refinement_description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weapon_stats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weapon_id` INTEGER NOT NULL,
    `level` INTEGER NOT NULL,
    `base_atk` DOUBLE NOT NULL,
    `sub_stat_value` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_mysql` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firebase_uid` VARCHAR(128) NOT NULL,
    `username` VARCHAR(50) NULL,
    `email` VARCHAR(100) NULL,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `last_login` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_mysql_firebase_uid_key`(`firebase_uid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_favorites` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `character_id` INTEGER NULL,
    `weapon_id` INTEGER NULL,
    `favorite_type` VARCHAR(10) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_activities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `activity_type` VARCHAR(20) NOT NULL,
    `related_id` INTEGER NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `region_areas` ADD CONSTRAINT `region_areas_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `region_features` ADD CONSTRAINT `region_features_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `characters_element_id_fkey` FOREIGN KEY (`element_id`) REFERENCES `elements`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `characters_weapon_type_id_fkey` FOREIGN KEY (`weapon_type_id`) REFERENCES `weapon_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `characters_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `characters_rarity_id_fkey` FOREIGN KEY (`rarity_id`) REFERENCES `rarities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_stats` ADD CONSTRAINT `character_stats_character_id_fkey` FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_skills` ADD CONSTRAINT `character_skills_character_id_fkey` FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_constellations` ADD CONSTRAINT `character_constellations_character_id_fkey` FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weapons` ADD CONSTRAINT `weapons_weapon_type_id_fkey` FOREIGN KEY (`weapon_type_id`) REFERENCES `weapon_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weapons` ADD CONSTRAINT `weapons_rarity_id_fkey` FOREIGN KEY (`rarity_id`) REFERENCES `rarities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weapon_passives` ADD CONSTRAINT `weapon_passives_weapon_id_fkey` FOREIGN KEY (`weapon_id`) REFERENCES `weapons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weapon_refinements` ADD CONSTRAINT `weapon_refinements_weapon_id_fkey` FOREIGN KEY (`weapon_id`) REFERENCES `weapons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weapon_stats` ADD CONSTRAINT `weapon_stats_weapon_id_fkey` FOREIGN KEY (`weapon_id`) REFERENCES `weapons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users_mysql`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_character_id_fkey` FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_weapon_id_fkey` FOREIGN KEY (`weapon_id`) REFERENCES `weapons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_activities` ADD CONSTRAINT `user_activities_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users_mysql`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
