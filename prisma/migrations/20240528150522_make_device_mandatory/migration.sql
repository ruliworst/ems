/*
  Warnings:

  - Made the column `deviceId` on table `GenerateAnomaliesReportTask` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deviceId` on table `GenerateConsumptionReportTask` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deviceId` on table `MaintenanceAlert` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deviceId` on table `MaintenanceDeviceTask` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deviceId` on table `MonitorizeConsumptionTask` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deviceId` on table `UnusualConsumptionAlert` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "GenerateAnomaliesReportTask" DROP CONSTRAINT "GenerateAnomaliesReportTask_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "GenerateConsumptionReportTask" DROP CONSTRAINT "GenerateConsumptionReportTask_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceAlert" DROP CONSTRAINT "MaintenanceAlert_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceDeviceTask" DROP CONSTRAINT "MaintenanceDeviceTask_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "MonitorizeConsumptionTask" DROP CONSTRAINT "MonitorizeConsumptionTask_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "UnusualConsumptionAlert" DROP CONSTRAINT "UnusualConsumptionAlert_deviceId_fkey";

-- AlterTable
ALTER TABLE "GenerateAnomaliesReportTask" ALTER COLUMN "deviceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "GenerateConsumptionReportTask" ALTER COLUMN "deviceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MaintenanceAlert" ALTER COLUMN "deviceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MaintenanceDeviceTask" ALTER COLUMN "deviceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MonitorizeConsumptionTask" ALTER COLUMN "deviceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "UnusualConsumptionAlert" ALTER COLUMN "deviceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "MonitorizeConsumptionTask" ADD CONSTRAINT "MonitorizeConsumptionTask_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerateConsumptionReportTask" ADD CONSTRAINT "GenerateConsumptionReportTask_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerateAnomaliesReportTask" ADD CONSTRAINT "GenerateAnomaliesReportTask_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceDeviceTask" ADD CONSTRAINT "MaintenanceDeviceTask_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnusualConsumptionAlert" ADD CONSTRAINT "UnusualConsumptionAlert_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceAlert" ADD CONSTRAINT "MaintenanceAlert_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
