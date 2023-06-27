/*
  Warnings:

  - A unique constraint covering the columns `[goal_id]` on the table `GoalNotification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[message_id]` on the table `MessageNotification` will be added. If there are existing duplicate values, this will fail.
  - Made the column `goal_title` on table `GoalNotification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sender_name` on table `MessageNotification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GoalNotification" ALTER COLUMN "goal_title" SET NOT NULL;

-- AlterTable
ALTER TABLE "MessageNotification" ALTER COLUMN "sender_name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GoalNotification_goal_id_key" ON "GoalNotification"("goal_id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageNotification_message_id_key" ON "MessageNotification"("message_id");
