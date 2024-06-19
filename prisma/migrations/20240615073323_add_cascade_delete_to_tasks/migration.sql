-- DropForeignKey
ALTER TABLE "GenerateAnomaliesReportTask" DROP CONSTRAINT "GenerateAnomaliesReportTask_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "GenerateConsumptionReportTask" DROP CONSTRAINT "GenerateConsumptionReportTask_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceDeviceTask" DROP CONSTRAINT "MaintenanceDeviceTask_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "MonitorizeConsumptionTask" DROP CONSTRAINT "MonitorizeConsumptionTask_deviceId_fkey";

-- AddForeignKey
ALTER TABLE "MonitorizeConsumptionTask" ADD CONSTRAINT "MonitorizeConsumptionTask_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerateConsumptionReportTask" ADD CONSTRAINT "GenerateConsumptionReportTask_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerateAnomaliesReportTask" ADD CONSTRAINT "GenerateAnomaliesReportTask_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceDeviceTask" ADD CONSTRAINT "MaintenanceDeviceTask_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
