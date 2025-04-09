/*
  Warnings:

  - A unique constraint covering the columns `[element_name]` on the table `elements` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `elements_element_name_key` ON `elements`(`element_name`);
