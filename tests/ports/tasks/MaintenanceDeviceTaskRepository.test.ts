import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { Frequency, PrismaClient } from "@prisma/client";
import PrismaMaintenanceDeviceTaskRepository from "@/adapters/repositories/tasks/PrismaMaintenanceDeviceTaskRepository";
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO, TaskType } from "@/dtos/tasks/task.dto";

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

  afterEach(async () => {
    await prisma.maintenanceDeviceTask.deleteMany();
  });

  describe("getAll", () => {
    it("should fetch all maintenance device tasks", async () => {
      // Act
      const tasks = await maintenanceDeviceTaskRepository.getAll();

      // Assert
      expect(tasks).toContainEqual(expect.objectContaining(tasksToCreate[0]));
    });
  });

  describe("create", () => {
    it("should create a maintenance device task successfully", async () => {
      // Arrange
      const newTask: CreateTaskDTO = {
        startDate: "2024-07-01T10:00:00.000Z",
        endDate: "2024-07-10T10:00:00.000Z",
        title: null,
        threshold: null,
        frequency: Frequency.WEEKLY,
        deviceName: "Device 1",
        operatorEmail: "operator@example.com",
        type: TaskType.MAINTENANCE_DEVICE,
        startReportDate: null,
        endReportDate: null
      };

      // Act
      const createdTask = await maintenanceDeviceTaskRepository.create(newTask);

      // Assert
      expect(createdTask).toMatchObject({
        startDate: new Date(newTask.startDate),
        endDate: new Date(newTask.endDate!),
      });
    });
  });
});
