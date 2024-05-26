import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

module.exports = async () => {
  console.log("TEAR DOWN")
  await prisma.device.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.generateAnomaliesReportTask.deleteMany();
  await prisma.generateConsumptionReportTask.deleteMany();
  await prisma.maintenanceDeviceTask.deleteMany();
  await prisma.monitorizeConsumptionTask.deleteMany();
};
