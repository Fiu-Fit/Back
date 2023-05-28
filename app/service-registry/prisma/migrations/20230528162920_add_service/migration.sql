-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('Available', 'Blocked');

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "api_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'Available',

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_api_key_key" ON "Service"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "Service_url_key" ON "Service"("url");
