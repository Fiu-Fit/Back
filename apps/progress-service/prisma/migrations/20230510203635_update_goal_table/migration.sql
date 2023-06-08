/*
  Warnings:

  - You are about to drop the column `actualValue` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Goal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "actualValue",
DROP COLUMN "updatedAt";
