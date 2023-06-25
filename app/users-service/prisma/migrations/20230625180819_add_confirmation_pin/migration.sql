-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmation_pin" TEXT,
ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false;
