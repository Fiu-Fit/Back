-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoriteWorkouts" TEXT[] DEFAULT ARRAY[]::TEXT[];
