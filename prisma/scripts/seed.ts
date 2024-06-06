import { Priority, PrismaClient, Status } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  await prisma.device.createMany({
    data: [
      {
        id: "1",
        name: "MKAS-123",
        ratedPower: 100,
        installationDate: new Date(),
        lastMaintenance: new Date(),
        observations: "Observation 1",
        status: Status.IDLE,
      }
    ]
  });
  await prisma.operator.createMany({
    data: [
      {
        id: "2",
        firstName: "Bob",
        firstSurname: "Doe",
        secondSurname: "Smith",
        email: "bob.doe@example.com",
        password: uuidv4(),
        phoneNumber: "123456789",
      },
    ],
  });
  await prisma.maintenanceAlert.createMany({
    data: [
      {
        message: "Maintenance alert message",
        resolved: false,
        priority: Priority.HIGH,
        deviceId: "1",
        operatorId: "2",
        publicId: uuidv4()
      }
    ],
  });
  await prisma.unusualConsumptionAlert.createMany({
    data: [
      {
        message: "Unusual consumption",
        priority: Priority.HIGH,
        deviceId: "1",
        operatorId: "2",
        threshold: 10,
        publicId: uuidv4()
      },
      {
        message: "Unusual consumption",
        resolved: false,
        priority: Priority.HIGH,
        deviceId: "1",
        operatorId: "2",
        threshold: 10,
        publicId: uuidv4()
      }
    ],
  });
}

main()
  .catch(async (e) => {
    await prisma.unusualConsumptionAlert.deleteMany({});
    await prisma.maintenanceAlert.deleteMany({});
    await prisma.operator.deleteMany({});
    await prisma.device.deleteMany({});
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
