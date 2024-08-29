/*
  Warnings:

  - A unique constraint covering the columns `[userid]` on the table `refreshtoken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `refreshtoken_userid_key` ON `refreshtoken`(`userid`);
