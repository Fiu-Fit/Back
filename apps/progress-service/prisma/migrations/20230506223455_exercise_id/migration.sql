/*
  Warnings:

  - Added the required column `exerciseId` to the `ProgressMetric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProgressMetric" ADD COLUMN     "exerciseId" TEXT NOT NULL;
