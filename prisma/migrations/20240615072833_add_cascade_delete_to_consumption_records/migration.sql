-- DropForeignKey
ALTER TABLE "EnergyConsumptionRecord" DROP CONSTRAINT "EnergyConsumptionRecord_deviceId_fkey";

-- AddForeignKey
ALTER TABLE "EnergyConsumptionRecord" ADD CONSTRAINT "EnergyConsumptionRecord_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
