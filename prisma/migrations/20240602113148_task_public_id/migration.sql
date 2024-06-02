/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `GenerateAnomaliesReportTask` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `GenerateConsumptionReportTask` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `MaintenanceDeviceTask` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `MonitorizeConsumptionTask` will be added. If there are existing duplicate values, this will fail.
  - The required column `publicId` was added to the `GenerateAnomaliesReportTask` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `publicId` was added to the `GenerateConsumptionReportTask` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `publicId` was added to the `MaintenanceDeviceTask` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `publicId` was added to the `MonitorizeConsumptionTask` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "GenerateAnomaliesReportTask" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GenerateConsumptionReportTask" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MaintenanceDeviceTask" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MonitorizeConsumptionTask" ADD COLUMN     "publicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GenerateAnomaliesReportTask_publicId_key" ON "GenerateAnomaliesReportTask"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "GenerateConsumptionReportTask_publicId_key" ON "GenerateConsumptionReportTask"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceDeviceTask_publicId_key" ON "MaintenanceDeviceTask"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "MonitorizeConsumptionTask_publicId_key" ON "MonitorizeConsumptionTask"("publicId");
