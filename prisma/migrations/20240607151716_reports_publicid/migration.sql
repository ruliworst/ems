/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `AnomaliesReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `ConsumptionReport` will be added. If there are existing duplicate values, this will fail.
  - The required column `publicId` was added to the `AnomaliesReport` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `publicId` was added to the `ConsumptionReport` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "AnomaliesReport" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ConsumptionReport" ADD COLUMN     "publicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AnomaliesReport_publicId_key" ON "AnomaliesReport"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsumptionReport_publicId_key" ON "ConsumptionReport"("publicId");
