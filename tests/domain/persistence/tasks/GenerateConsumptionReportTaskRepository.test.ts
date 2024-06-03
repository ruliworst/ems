import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { Frequency, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO, TaskType } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import PrismaGenerateConsumptionReportTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaGenerateConsumptionReportTaskRepository";

describe("GenerateConsumptionReportTaskRepository", () => {
  let consumptionReportTaskRepository: PrismaGenerateConsumptionReportTaskRepository;
  let prisma: PrismaClient = new PrismaClient();

  const publicId = uuidv4();

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
      publicId
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

  describe("create", () => {
    it("should create a generate consumption report task successfully", async () => {
      // Arrange
      const newTask: CreateTaskDTO = {
        startDate: "2024-07-01T10:00:00.000Z",
        endDate: "2024-07-10T10:00:00.000Z",
        startReportDate: "2024-07-01T10:00:00.000Z",
        endReportDate: "2024-07-10T10:00:00.000Z",
        title: "Consumption Report 2",
        threshold: null,
        frequency: Frequency.WEEKLY,
        deviceName: "Device-Monitorize",
        operatorEmail: "bob.doe@example.com",
        type: TaskType.GENERATE_CONSUMPTION_REPORT
      };

      // Act
      const createdTask = await consumptionReportTaskRepository.create(newTask);

      // Assert
      expect(createdTask).toMatchObject({
        startDate: new Date(newTask.startDate),
        endDate: new Date(newTask.endDate!),
        startReportDate: new Date(newTask.startReportDate!),
        endReportDate: new Date(newTask.endReportDate!),
        title: newTask.title,
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
      await expect(consumptionReportTaskRepository.create(invalidTask as CreateTaskDTO))
        .rejects.toThrow("Some values are not valid.");
    });
  });

  describe("getTaskByPublicId", () => {
    it("should fetch a task by public ID", async () => {
      // Act
      const task = await consumptionReportTaskRepository.getTaskByPublicId(publicId);

      // Assert
      expect(task).toMatchObject(tasksToCreate[0]);
    });

    it("should return null if task not found", async () => {
      // Act
      const task = await consumptionReportTaskRepository.getTaskByPublicId("non-existent-task");

      // Assert
      expect(task).toBeNull();
    });
  });
});
