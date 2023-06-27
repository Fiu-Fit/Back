/*
  Warnings:

  - You are about to drop the column `message_id` on the `MessageNotification` table. All the data in the column will be lost.
  - Added the required column `sender_id` to the `MessageNotification` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MessageNotification_message_id_key";

-- AlterTable
ALTER TABLE "MessageNotification" DROP COLUMN "message_id",
ADD COLUMN     "sender_id" INTEGER NOT NULL;
