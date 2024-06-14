import { Priority, PrismaClient, Status } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const pwd = await bcrypt.hash("1234", 10);

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
      },
      {
        id: "123456",
        name: "MKAS-12334",
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
        password: pwd,
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
  await prisma.consumptionReport.createMany({
    data: [
      {
        publicId: uuidv4(),
        startDate: new Date(),
        endDate: new Date(),
        title: "Consumption report",
        operatorId: "2"
      },
    ]
  });
  await prisma.anomaliesReport.createMany({
    data: [
      {
        publicId: uuidv4(),
        startDate: new Date(),
        endDate: new Date(),
        title: "Anomalies report",
        operatorId: "2",
        threshold: 10
      },
    ]
  });
  await prisma.energyConsumptionRecord.createMany({
    data: [
      {
        deviceId: "1",
        recordDate: new Date(),
        quantity: 30,
        price: 0.32
      },
      {
        deviceId: "1",
        recordDate: new Date(),
        quantity: 34,
        price: 0.23
      },
      {
        deviceId: "1",
        recordDate: new Date(),
        quantity: 36,
        price: 0.37
      },
      {
        deviceId: "1",
        recordDate: new Date(),
        quantity: 16,
        price: 0.33
      },
      {
        deviceId: "123456",
        recordDate: new Date(),
        quantity: 12,
        price: 0.32
      },
      {
        deviceId: "123456",
        recordDate: new Date(),
        quantity: 65,
        price: 0.23
      },
      {
        deviceId: "123456",
        recordDate: new Date(),
        quantity: 34,
        price: 0.37
      },
      {
        deviceId: "123456",
        recordDate: new Date(),
        quantity: 67,
        price: 0.33
      },
    ]
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
