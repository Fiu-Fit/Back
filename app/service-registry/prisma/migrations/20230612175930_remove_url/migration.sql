/*
  Warnings:

  - You are about to drop the column `url` on the `Service` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Service_url_key";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "url";
