/*
  Warnings:

  - You are about to drop the `user_activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_mysql` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_activities` DROP FOREIGN KEY `user_activities_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_favorites` DROP FOREIGN KEY `user_favorites_user_id_fkey`;

-- DropIndex
DROP INDEX `user_favorites_user_id_fkey` ON `user_favorites`;

-- DropTable
DROP TABLE `user_activities`;

-- DropTable
DROP TABLE `users_mysql`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NULL,
    `bio` TEXT NULL,
    `profile_image` VARCHAR(255) NULL,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `last_login` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
