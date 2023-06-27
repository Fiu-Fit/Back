/*
  Warnings:

  - You are about to drop the column `favorite_workouts` on the `User` table. All the data in the column will be lost.
  - Made the column `goal_title` on table `GoalNotification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sender_name` on table `MessageNotification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GoalNotification" ALTER COLUMN "goal_title" SET NOT NULL;

-- AlterTable
ALTER TABLE "MessageNotification" ALTER COLUMN "sender_name" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "favorite_workouts";

-- CreateTable
CREATE TABLE "FavoriteWorkout" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "workout_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteWorkout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FavoriteWorkout" ADD CONSTRAINT "FavoriteWorkout_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
