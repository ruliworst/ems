import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { Frequency, PrismaClient } from "@prisma/client";
import PrismaGenerateAnomaliesReportTaskRepository from "@/adapters/repositories/tasks/PrismaGenerateAnomaliesReportTaskRepository";
import { CreateTaskDTO, TaskType } from "@/dtos/tasks/task.dto";

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

  describe("create", () => {
    it("should create a generate anomalies report task successfully", async () => {
      // Arrange
      const newTask: CreateTaskDTO = {
        startDate: "2024-07-01T10:00:00.000Z",
        endDate: "2024-07-10T10:00:00.000Z",
        startReportDate: "2024-07-01T10:00:00.000Z",
        endReportDate: "2024-07-10T10:00:00.000Z",
        title: "Anomalies Report 2",
        threshold: 10,
        frequency: Frequency.WEEKLY,
        deviceName: "Device 1",
        operatorEmail: "operator@example.com",
        type: TaskType.GENERATE_ANOMALIES_REPORT
      };

      // Act
      const createdTask = await anomaliesReportTaskRepository.create(newTask);

      // Assert
      expect(createdTask).toMatchObject({
        startDate: new Date(newTask.startDate),
        endDate: new Date(newTask.endDate!),
        startReportDate: new Date(newTask.startReportDate!),
        endReportDate: new Date(newTask.endReportDate!),
        title: newTask.title,
        threshold: newTask.threshold,
        frequency: newTask.frequency,
      });
    });

    it("should throw an error when some values are missing", async () => {
      // Arrange
      const invalidTask: Partial<CreateTaskDTO> = {
        startDate: "2024-07-01T10:00:00.000Z",
        endDate: "2024-07-10T10:00:00.000Z",
        // Missing required fields
      };

      // Act & Assert
      await expect(anomaliesReportTaskRepository.create(invalidTask as CreateTaskDTO))
        .rejects.toThrow("Some values are not valid.");
    });
  });
});
