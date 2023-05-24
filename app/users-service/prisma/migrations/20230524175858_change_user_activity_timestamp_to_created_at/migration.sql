/*
  Warnings:

  - You are about to drop the column `timestamp` on the `UserActivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserActivity" DROP COLUMN "timestamp",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
