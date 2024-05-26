import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { Frequency, PrismaClient } from "@prisma/client";
import PrismaGenerateAnomaliesReportTaskRepository from "@/adapters/repositories/tasks/PrismaGenerateAnomaliesReportTaskRepository";

describe("GenerateAnomaliesReportTaskRepository", () => {
  let anomaliesReportTaskRepository: PrismaGenerateAnomaliesReportTaskRepository;
  let prisma: PrismaClient = new PrismaClient();

  const tasksToCreate = [
    {
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Anomalies Report 1",
      threshold: 5,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      frequency: Frequency.DAILY,
    },
  ];

  beforeAll(async () => {
    anomaliesReportTaskRepository = container.resolve(PrismaGenerateAnomaliesReportTaskRepository);
    await prisma.generateAnomaliesReportTask.createMany({ data: tasksToCreate });
  });

  describe("getAll", () => {
    it("should fetch all generate anomalies report tasks", async () => {
      // Act.
      const tasks = await anomaliesReportTaskRepository.getAll();

      // Assert.
      expect(tasks).toContainEqual(expect.objectContaining(tasksToCreate[0]));
    });
  });
});
