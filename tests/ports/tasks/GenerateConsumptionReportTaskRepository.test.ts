import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { Frequency, PrismaClient } from "@prisma/client";
import PrismaGenerateConsumptionReportTaskRepository from "@/adapters/repositories/tasks/PrismaGenerateConsumptionReportTaskRepository";
import { v4 as uuidv4 } from 'uuid';

describe("GenerateConsumptionReportTaskRepository", () => {
  let consumptionReportTaskRepository: PrismaGenerateConsumptionReportTaskRepository;
  let prisma: PrismaClient = new PrismaClient();

  const tasksToCreate = [
    {
      id: uuidv4(),
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Consumption Report 1",
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      frequency: Frequency.DAILY,
    },
  ];

  beforeAll(async () => {
    consumptionReportTaskRepository = container.resolve(PrismaGenerateConsumptionReportTaskRepository);
    await prisma.generateConsumptionReportTask.createMany({ data: tasksToCreate });
  });

  describe("getAll", () => {
    it("should fetch all generate consumption report tasks", async () => {
      // Act.
      const tasks = await consumptionReportTaskRepository.getAll();

      // Assert.
      expect(tasks).toContainEqual(expect.objectContaining(tasksToCreate[0]));
    });
  });
});
