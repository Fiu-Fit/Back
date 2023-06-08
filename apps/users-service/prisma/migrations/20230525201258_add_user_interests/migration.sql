-- AlterTable
ALTER TABLE "User" ADD COLUMN     "interests" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
