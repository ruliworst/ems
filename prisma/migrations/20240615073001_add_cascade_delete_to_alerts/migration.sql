-- DropForeignKey
ALTER TABLE "MaintenanceAlert" DROP CONSTRAINT "MaintenanceAlert_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "UnusualConsumptionAlert" DROP CONSTRAINT "UnusualConsumptionAlert_deviceId_fkey";

-- AddForeignKey
ALTER TABLE "UnusualConsumptionAlert" ADD CONSTRAINT "UnusualConsumptionAlert_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceAlert" ADD CONSTRAINT "MaintenanceAlert_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
