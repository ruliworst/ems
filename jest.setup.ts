import { PrismaClient, Status } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

module.exports = async () => {
  const devicesToCreate = [
    {
      id: "1",
      name: "Device-Monitorize",
      ratedPower: 100,
      installationDate: new Date(),
      lastMaintenance: new Date(),
      observations: "Observation 1",
      status: Status.IDLE,
    },
  ];

  const operatorsToCreate = [
    {
      id: "2",
      firstName: "Bob",
      firstSurname: "Doe",
      secondSurname: "Smith",
      email: "bob.doe@example.com",
      password: uuidv4(),
      phoneNumber: "123456789",
    },
  ];

  await prisma.device.createMany({ data: devicesToCreate });
  await prisma.operator.createMany({ data: operatorsToCreate });
};
