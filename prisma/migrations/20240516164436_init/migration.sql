-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('STOPPED', 'IDLE', 'RUNNING', 'PEAK');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "Operator" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "firstSurname" TEXT NOT NULL,
    "secondSurname" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supervisor" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "firstSurname" TEXT NOT NULL,
    "secondSurname" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "Supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ratedPower" DOUBLE PRECISION NOT NULL,
    "installationDate" TIMESTAMP(3) NOT NULL,
    "lastMaintenance" TIMESTAMP(3),
    "observations" TEXT,
    "status" "Status" NOT NULL DEFAULT 'RUNNING',

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsumptionReport" (
    "id" TEXT NOT NULL,
    "observations" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "operatorId" TEXT,
    "supervisorId" TEXT,
    "deviceId" TEXT,

    CONSTRAINT "ConsumptionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnomaliesReport" (
    "id" TEXT NOT NULL,
    "observations" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "operatorId" TEXT,
    "supervisorId" TEXT,
    "deviceId" TEXT,

    CONSTRAINT "AnomaliesReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyConsumptionRecord" (
    "id" TEXT NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "deviceId" TEXT,
    "consumptionReportId" TEXT,
    "anomaliesReportId" TEXT,

    CONSTRAINT "EnergyConsumptionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonitorizeConsumptionTask" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "frequency" "Frequency" NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "deviceId" TEXT,

    CONSTRAINT "MonitorizeConsumptionTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerateConsumptionReportTask" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "frequency" "Frequency" NOT NULL,
    "startReportDate" TIMESTAMP(3) NOT NULL,
    "endReportDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "deviceId" TEXT,

    CONSTRAINT "GenerateConsumptionReportTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerateAnomaliesReportTask" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "frequency" "Frequency" NOT NULL,
    "startReportDate" TIMESTAMP(3) NOT NULL,
    "endReportDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "deviceId" TEXT,

    CONSTRAINT "GenerateAnomaliesReportTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceDeviceTask" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "frequency" "Frequency" NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "deviceId" TEXT,

    CONSTRAINT "MaintenanceDeviceTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnusualConsumptionAlert" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "priority" "Priority" NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "deviceId" TEXT,

    CONSTRAINT "UnusualConsumptionAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceAlert" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "priority" "Priority" NOT NULL,
    "deviceId" TEXT,

    CONSTRAINT "MaintenanceAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Operator_email_key" ON "Operator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Supervisor_email_key" ON "Supervisor"("email");

-- AddForeignKey
ALTER TABLE "ConsumptionReport" ADD CONSTRAINT "ConsumptionReport_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumptionReport" ADD CONSTRAINT "ConsumptionReport_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumptionReport" ADD CONSTRAINT "ConsumptionReport_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomaliesReport" ADD CONSTRAINT "AnomaliesReport_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomaliesReport" ADD CONSTRAINT "AnomaliesReport_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomaliesReport" ADD CONSTRAINT "AnomaliesReport_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyConsumptionRecord" ADD CONSTRAINT "EnergyConsumptionRecord_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyConsumptionRecord" ADD CONSTRAINT "EnergyConsumptionRecord_consumptionReportId_fkey" FOREIGN KEY ("consumptionReportId") REFERENCES "ConsumptionReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyConsumptionRecord" ADD CONSTRAINT "EnergyConsumptionRecord_anomaliesReportId_fkey" FOREIGN KEY ("anomaliesReportId") REFERENCES "AnomaliesReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonitorizeConsumptionTask" ADD CONSTRAINT "MonitorizeConsumptionTask_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerateConsumptionReportTask" ADD CONSTRAINT "GenerateConsumptionReportTask_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerateAnomaliesReportTask" ADD CONSTRAINT "GenerateAnomaliesReportTask_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceDeviceTask" ADD CONSTRAINT "MaintenanceDeviceTask_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnusualConsumptionAlert" ADD CONSTRAINT "UnusualConsumptionAlert_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceAlert" ADD CONSTRAINT "MaintenanceAlert_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;
