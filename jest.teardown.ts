// jest.teardown.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

module.exports = async () => {
  await prisma.device.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.monitorizeConsumptionTask.deleteMany();
};
