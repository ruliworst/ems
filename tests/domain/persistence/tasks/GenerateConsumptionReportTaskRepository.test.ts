import { mockDeep, mockReset } from 'jest-mock-extended';

import "reflect-metadata";
import "@/config/container";
import { PrismaClient, PrismaPromise, GenerateConsumptionReportTask, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";
import PrismaGenerateConsumptionReportTaskRepository from '@/src/infrastructure/prisma/tasks/PrismaGenerateConsumptionReportTaskRepository';


jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockDeep<PrismaClient>()),
}));

jest.mock("@/src/domain/persistence/devices/DeviceRepository");

describe("GenerateConsumptionReportTaskRepository", () => {
  let consumptionReportTaskRepository: PrismaGenerateConsumptionReportTaskRepository;
  let prismaMock: jest.Mocked<PrismaClient>;
  let deviceRepository: jest.Mocked<DeviceRepository>;

  const publicId = uuidv4();

  const tasksToCreate: GenerateConsumptionReportTask[] = [
    {
      id: uuidv4(),
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Anomalies Report 1",
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      frequency: "DAILY",
      publicId,
    },
  ];

  beforeEach(() => {
    prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;

    (prismaMock.operator.findUnique as jest.MockedFunction<
      typeof prismaMock.operator.findUnique
    >).mockResolvedValue({
      id: "2",
      firstName: "Bob",
      firstSurname: "Doe",
      secondSurname: "Smith",
      email: "bob.doe@example.com",
      password: uuidv4(),
      phoneNumber: "123456789",
    });

    (prismaMock.supervisor.findUnique as jest.MockedFunction<
      typeof prismaMock.supervisor.findUnique
    >).mockResolvedValue(null);

    deviceRepository = {
      getByName: jest.fn().mockResolvedValue({ id: "1" }),
    } as unknown as jest.Mocked<DeviceRepository>;
    consumptionReportTaskRepository = new PrismaGenerateConsumptionReportTaskRepository(prismaMock, deviceRepository);
  });

  afterEach(() => {
    mockReset(prismaMock);
  });

  describe("getAll", () => {
    it("should fetch all generate consumption report tasks", async () => {
      const generateConsumptionReportTaskMock =
        prismaMock.generateConsumptionReportTask as jest.Mocked<PrismaClient["generateConsumptionReportTask"]>;

      generateConsumptionReportTaskMock.findMany.mockImplementation(
        () => Promise.resolve(tasksToCreate) as PrismaPromise<GenerateConsumptionReportTask[]>
      );

      const tasks = await consumptionReportTaskRepository.getAll();

      expect(tasks).toEqual(tasksToCreate);
    });
  });

  describe("create", () => {
    it("should create a generate consumption report task successfully", async () => {
      const newTask: Partial<GenerateConsumptionReportTask> = {
        startDate: new Date("2024-07-01T10:00:00.000Z"),
        endDate: new Date("2024-07-10T10:00:00.000Z"),
        startReportDate: new Date("2024-07-01T10:00:00.000Z"),
        endReportDate: new Date("2024-07-10T10:00:00.000Z"),
        title: "Anomalies Report 2",
        frequency: "WEEKLY",
      };
      const operatorEmail = "bob.doe@example.com";
      const deviceName = "Device-Monitorize";

      const createdTask: GenerateConsumptionReportTask = {
        ...newTask,
        startDate: new Date(newTask.startDate!),
        endDate: new Date(newTask.endDate!),
        startReportDate: new Date(newTask.startReportDate!),
        endReportDate: new Date(newTask.endReportDate!),
        id: uuidv4(),
        deviceId: "1",
        operatorId: "2",
        supervisorId: null,
        publicId: uuidv4(),
        frequency: newTask.frequency!,
        title: newTask.title!
      };

      const generateConsumptionReportTaskMock =
        prismaMock.generateConsumptionReportTask as jest.Mocked<PrismaClient["generateConsumptionReportTask"]>;

      generateConsumptionReportTaskMock.create.mockResolvedValue(createdTask);

      const result = await consumptionReportTaskRepository.create(newTask, operatorEmail, deviceName);

      expect(result).toEqual(createdTask);
    })
  });
  describe("getTaskByPublicId", () => {
    it("should fetch a task by public ID", async () => {
      (prismaMock.generateConsumptionReportTask.findUnique as jest.MockedFunction<
        typeof prismaMock.generateConsumptionReportTask.findUnique
      >).mockResolvedValueOnce(tasksToCreate[0]);

      const task = await consumptionReportTaskRepository.getTaskByPublicId(publicId);

      expect(task).toEqual(tasksToCreate[0]);
    });

    it("should return null if task not found", async () => {
      (prismaMock.generateConsumptionReportTask.findUnique as jest.MockedFunction<
        typeof prismaMock.generateConsumptionReportTask.findUnique
      >).mockResolvedValueOnce(null);

      const task = await consumptionReportTaskRepository.getTaskByPublicId("non-existent-task");

      expect(task).toBeNull();
    });
  });

  describe("update", () => {
    it("should update a generate consumption report task successfully", async () => {
      const updatedTaskData: Partial<GenerateConsumptionReportTask> = {
        publicId,
        startDate: new Date("2024-07-20T10:00:00.000Z"),
        endDate: new Date("2024-07-30T10:00:00.000Z"),
        frequency: "MONTHLY",
        startReportDate: new Date("2024-07-20T10:00:00.000Z"),
        endReportDate: new Date("2024-07-30T10:00:00.000Z"),
        title: "Updated Anomalies Report",
      };

      const updatedTask: GenerateConsumptionReportTask = {
        ...tasksToCreate[0],
        ...updatedTaskData,
        startDate: new Date(updatedTaskData.startDate!),
        endDate: new Date(updatedTaskData.endDate!),
        startReportDate: new Date(updatedTaskData.startReportDate!),
        endReportDate: new Date(updatedTaskData.endReportDate!),
      };

      (prismaMock.generateConsumptionReportTask.update as jest.MockedFunction<
        typeof prismaMock.generateConsumptionReportTask.update
      >).mockResolvedValueOnce(updatedTask); // <-- Use the correct mock and .mockResolvedValueOnce()

      const result = await consumptionReportTaskRepository.update(
        updatedTaskData.publicId!,
        updatedTaskData
      );

      expect(result).toEqual(updatedTask);
    });

    it("should return null if task not found", async () => {
      const nonExistentPublicId = "non-existent-publicId";

      (prismaMock.generateConsumptionReportTask.update as jest.MockedFunction<
        typeof prismaMock.generateConsumptionReportTask.update
      >).mockRejectedValueOnce({
        code: "P2025",
        message: "An operation failed because it depends on one or more records that were required but not found. {cause}",
      });

      const updatedTask = await consumptionReportTaskRepository.update(
        nonExistentPublicId,
        {
          publicId: nonExistentPublicId,
          startDate: new Date("2024-07-20T10:00:00.000Z"),
          endDate: new Date("2024-07-30T10:00:00.000Z"),
          frequency: "MONTHLY",
          startReportDate: new Date("2024-07-20T10:00:00.000Z"),
          endReportDate: new Date("2024-07-30T10:00:00.000Z"),
          title: "Updated Anomalies Report",
        }
      );

      expect(updatedTask).toBeNull();
    });
  });
});