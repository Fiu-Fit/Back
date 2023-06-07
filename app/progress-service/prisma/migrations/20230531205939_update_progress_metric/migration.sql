/*
  Warnings:

  - A unique constraint covering the columns `[exerciseId,userId]` on the table `ProgressMetric` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `timeSpent` to the `ProgressMetric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Unit" ADD VALUE 'REPETITIONS';

-- AlterTable
ALTER TABLE "ProgressMetric" ADD COLUMN     "timeSpent" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProgressMetric_exerciseId_userId_key" ON "ProgressMetric"("exerciseId", "userId");
