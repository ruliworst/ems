import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { Frequency, PrismaClient } from "@prisma/client";
import PrismaMonitorizeConsumptionTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaMonitorizeConsumptionTaskRepository";
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO, TaskType } from "@/src/infrastructure/api/dtos/tasks/task.dto";

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

  afterEach(async () => {
    await prisma.monitorizeConsumptionTask.deleteMany();
  });

  describe("getAll", () => {
    it("should fetch all monitorize consumption tasks", async () => {
      // Act
      const tasks = await monitorizeConsumptionTaskRepository.getAll();

      // Assert
      expect(tasks).toContainEqual(expect.objectContaining(tasksToCreate[0]));
    });
  });

  describe("create", () => {
    it("should create a monitorize consumption task successfully", async () => {
      // Arrange
      const newTask: CreateTaskDTO = {
        startDate: "2024-07-01T10:00:00.000Z",
        endDate: "2024-07-10T10:00:00.000Z",
        title: "Monitorize Consumption Task 1",
        threshold: 10,
        frequency: Frequency.WEEKLY,
        deviceName: "Device 1",
        operatorEmail: "operator@example.com",
        type: TaskType.MONITORIZE_CONSUMPTION,
        startReportDate: null,
        endReportDate: null
      };

      // Act
      const createdTask = await monitorizeConsumptionTaskRepository.create(newTask);

      // Assert
      expect(createdTask).toMatchObject({
        startDate: new Date(newTask.startDate),
        endDate: new Date(newTask.endDate!),
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
      await expect(monitorizeConsumptionTaskRepository.create(invalidTask as CreateTaskDTO))
        .rejects.toThrow("Some values are not valid.");
    });
  });
});
