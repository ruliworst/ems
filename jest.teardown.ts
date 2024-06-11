import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

module.exports = async () => {
  await prisma.energyConsumptionRecord.deleteMany();
  await prisma.monitorizeConsumptionTask.deleteMany();
  await prisma.generateAnomaliesReportTask.deleteMany();
  await prisma.generateConsumptionReportTask.deleteMany();
  await prisma.maintenanceDeviceTask.deleteMany();
  await prisma.maintenanceAlert.deleteMany();
  await prisma.unusualConsumptionAlert.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.supervisor.deleteMany();
  await prisma.device.deleteMany();
};
