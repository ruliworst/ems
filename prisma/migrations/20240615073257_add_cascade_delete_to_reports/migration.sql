-- DropForeignKey
ALTER TABLE "AnomaliesReport" DROP CONSTRAINT "AnomaliesReport_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "ConsumptionReport" DROP CONSTRAINT "ConsumptionReport_deviceId_fkey";

-- AddForeignKey
ALTER TABLE "ConsumptionReport" ADD CONSTRAINT "ConsumptionReport_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomaliesReport" ADD CONSTRAINT "AnomaliesReport_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
