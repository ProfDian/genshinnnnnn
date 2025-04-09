/*
  Warnings:

  - You are about to drop the column `crit_dmg` on the `character_stats` table. All the data in the column will be lost.
  - Added the required column `stat_type` to the `character_stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stat_value` to the `character_stats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `character_stats` DROP COLUMN `crit_dmg`,
    ADD COLUMN `stat_type` VARCHAR(20) NOT NULL,
    ADD COLUMN `stat_value` DOUBLE NOT NULL;
