/*
  Warnings:

  - You are about to drop the column `last_login` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password_resets` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserActivityType" AS ENUM ('Login', 'PasswordReset');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "last_login",
DROP COLUMN "password_resets";

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" SERIAL NOT NULL,
    "type" "UserActivityType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
