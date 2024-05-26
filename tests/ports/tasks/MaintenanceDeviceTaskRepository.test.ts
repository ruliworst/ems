import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { Frequency, PrismaClient } from "@prisma/client";
import PrismaMaintenanceDeviceTaskRepository from "@/adapters/repositories/tasks/PrismaMaintenanceDeviceTaskRepository";
import { v4 as uuidv4 } from 'uuid';

describe("MaintenanceDeviceTaskRepository", () => {
  let maintenanceDeviceTaskRepository: PrismaMaintenanceDeviceTaskRepository;
  let prisma: PrismaClient = new PrismaClient();

  const tasksToCreate = [
    {
      id: uuidv4(),
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      frequency: Frequency.DAILY,
    },
  ];

  beforeAll(async () => {
    maintenanceDeviceTaskRepository = container.resolve(PrismaMaintenanceDeviceTaskRepository);
    await prisma.maintenanceDeviceTask.createMany({ data: tasksToCreate });
  });

  describe("getAll", () => {
    it("should fetch all maintenance device tasks", async () => {
      // Act.
      const tasks = await maintenanceDeviceTaskRepository.getAll();

      // Assert.
      expect(tasks).toContainEqual(expect.objectContaining(tasksToCreate[0]));
    });
  });
});
