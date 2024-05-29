import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

module.exports = async () => {
  await prisma.monitorizeConsumptionTask.deleteMany();
  await prisma.generateAnomaliesReportTask.deleteMany();
  await prisma.generateConsumptionReportTask.deleteMany();
  await prisma.maintenanceDeviceTask.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.device.deleteMany();
};
