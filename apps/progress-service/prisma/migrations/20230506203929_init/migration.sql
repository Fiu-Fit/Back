-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('KILOGRAMS', 'METERS', 'SECONDS');

-- CreateTable
CREATE TABLE "ProgressMetric" (
    "id" SERIAL NOT NULL,
    "calories_burnt" DOUBLE PRECISION NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" "Unit" NOT NULL,
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgressMetric_pkey" PRIMARY KEY ("id")
);
