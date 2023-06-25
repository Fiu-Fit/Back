/*
  Warnings:

  - A unique constraint covering the columns `[user_id,workout_id]` on the table `FavoriteWorkout` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FavoriteWorkout_user_id_workout_id_key" ON "FavoriteWorkout"("user_id", "workout_id");
