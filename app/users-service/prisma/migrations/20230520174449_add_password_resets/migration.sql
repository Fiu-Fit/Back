/*
  Warnings:

  - You are about to drop the column `bodyWeight` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `favoriteWorkouts` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `federatedIdentity` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `User` table. All the data in the column will be lost.
  - Added the required column `body_weight` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "bodyWeight",
DROP COLUMN "createdAt",
DROP COLUMN "favoriteWorkouts",
DROP COLUMN "federatedIdentity",
DROP COLUMN "lastLogin",
ADD COLUMN     "body_weight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "favorite_workouts" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "federated_identity" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password_resets" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[];
