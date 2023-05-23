-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('InProgress', 'Completed', 'CompletedLate');

-- CreateTable
CREATE TABLE "Goal" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "targetValue" INTEGER NOT NULL,
    "actualValue" INTEGER NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "exerciseId" TEXT NOT NULL,
    "status" "GoalStatus" NOT NULL DEFAULT 'InProgress',

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);
