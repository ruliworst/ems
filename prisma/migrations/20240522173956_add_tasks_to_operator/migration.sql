-- AlterTable
ALTER TABLE "GenerateAnomaliesReportTask" ADD COLUMN     "operatorId" TEXT,
ADD COLUMN     "supervisorId" TEXT;

-- AlterTable
ALTER TABLE "GenerateConsumptionReportTask" ADD COLUMN     "operatorId" TEXT,
ADD COLUMN     "supervisorId" TEXT;

-- AlterTable
ALTER TABLE "MaintenanceAlert" ADD COLUMN     "operatorId" TEXT,
ADD COLUMN     "supervisorId" TEXT;

-- AlterTable
ALTER TABLE "MaintenanceDeviceTask" ADD COLUMN     "operatorId" TEXT,
ADD COLUMN     "supervisorId" TEXT;

-- AlterTable
ALTER TABLE "MonitorizeConsumptionTask" ADD COLUMN     "operatorId" TEXT,
ADD COLUMN     "supervisorId" TEXT;

-- AlterTable
ALTER TABLE "UnusualConsumptionAlert" ADD COLUMN     "operatorId" TEXT,
ADD COLUMN     "supervisorId" TEXT;

-- AddForeignKey
ALTER TABLE "MonitorizeConsumptionTask" ADD CONSTRAINT "MonitorizeConsumptionTask_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonitorizeConsumptionTask" ADD CONSTRAINT "MonitorizeConsumptionTask_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerateConsumptionReportTask" ADD CONSTRAINT "GenerateConsumptionReportTask_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerateConsumptionReportTask" ADD CONSTRAINT "GenerateConsumptionReportTask_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerateAnomaliesReportTask" ADD CONSTRAINT "GenerateAnomaliesReportTask_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerateAnomaliesReportTask" ADD CONSTRAINT "GenerateAnomaliesReportTask_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceDeviceTask" ADD CONSTRAINT "MaintenanceDeviceTask_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceDeviceTask" ADD CONSTRAINT "MaintenanceDeviceTask_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnusualConsumptionAlert" ADD CONSTRAINT "UnusualConsumptionAlert_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnusualConsumptionAlert" ADD CONSTRAINT "UnusualConsumptionAlert_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceAlert" ADD CONSTRAINT "MaintenanceAlert_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceAlert" ADD CONSTRAINT "MaintenanceAlert_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
