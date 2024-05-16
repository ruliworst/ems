import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.device.deleteMany();
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.device.deleteMany();
  await prisma.$disconnect();
});

export default prisma;
