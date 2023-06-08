/*
  Warnings:

  - You are about to drop the column `calories_burnt` on the `ProgressMetric` table. All the data in the column will be lost.
  - Added the required column `burntCalories` to the `ProgressMetric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProgressMetric" DROP COLUMN "calories_burnt",
ADD COLUMN     "burntCalories" DOUBLE PRECISION NOT NULL;
