-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('Available', 'Blocked');

-- CreateTable
CREATE TABLE "Services" (
    "id" SERIAL NOT NULL,
    "api_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'Available',

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Services_api_key_key" ON "Services"("api_key");
