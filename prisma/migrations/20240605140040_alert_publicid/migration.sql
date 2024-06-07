/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `MaintenanceAlert` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `UnusualConsumptionAlert` will be added. If there are existing duplicate values, this will fail.
  - The required column `publicId` was added to the `MaintenanceAlert` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `publicId` was added to the `UnusualConsumptionAlert` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "MaintenanceAlert" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UnusualConsumptionAlert" ADD COLUMN     "publicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceAlert_publicId_key" ON "MaintenanceAlert"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "UnusualConsumptionAlert_publicId_key" ON "UnusualConsumptionAlert"("publicId");
