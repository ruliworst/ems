/*
  Warnings:

  - Made the column `deviceId` on table `EnergyConsumptionRecord` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "EnergyConsumptionRecord" DROP CONSTRAINT "EnergyConsumptionRecord_deviceId_fkey";

-- AlterTable
ALTER TABLE "EnergyConsumptionRecord" ALTER COLUMN "deviceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "EnergyConsumptionRecord" ADD CONSTRAINT "EnergyConsumptionRecord_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
