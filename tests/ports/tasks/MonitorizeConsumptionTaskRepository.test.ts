import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { Frequency, PrismaClient } from "@prisma/client";
import PrismaMonitorizeConsumptionTaskRepository from "@/adapters/repositories/tasks/PrismaMonitorizeConsumptionTaskRepository";
import { v4 as uuidv4 } from 'uuid';

describe("MonitorizeConsumptionTaskRepository", () => {
  let monitorizeConsumptionTaskRepository: PrismaMonitorizeConsumptionTaskRepository;
  let prisma: PrismaClient = new PrismaClient();

  const tasksToCreate = [
    {
      id: uuidv4(),
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      threshold: 5,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      frequency: Frequency.DAILY,
    },
  ];

  beforeAll(async () => {
    monitorizeConsumptionTaskRepository = container.resolve(PrismaMonitorizeConsumptionTaskRepository);
    await prisma.monitorizeConsumptionTask.createMany({ data: tasksToCreate });
  });

  describe("getAll", () => {
    it("should fetch all monitorize consumption tasks", async () => {
      // Act.
      const tasks = await monitorizeConsumptionTaskRepository.getAll();

      // Assert.
      expect(tasks).toContainEqual(expect.objectContaining(tasksToCreate[0]));
    });
  });
});
