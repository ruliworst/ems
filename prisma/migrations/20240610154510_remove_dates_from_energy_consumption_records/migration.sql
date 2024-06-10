/*
  Warnings:

  - You are about to drop the column `endDate` on the `EnergyConsumptionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `EnergyConsumptionRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EnergyConsumptionRecord" DROP COLUMN "endDate",
DROP COLUMN "startDate";
