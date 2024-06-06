import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.unusualConsumptionAlert.deleteMany({});
  await prisma.maintenanceAlert.deleteMany({});
  await prisma.operator.deleteMany({});
  await prisma.device.deleteMany({});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
