import { mockDeep, mockReset } from 'jest-mock-extended';

import "reflect-metadata";
import "@/config/container";
import { PrismaClient, GenerateAnomaliesReportTask, PrismaPromise } from "@prisma/client";
import PrismaGenerateAnomaliesReportTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaGenerateAnomaliesReportTaskRepository";
import { v4 as uuidv4 } from 'uuid';
import { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";


jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockDeep<PrismaClient>()),
}));


jest.mock("@/src/domain/persistence/devices/DeviceRepository");

describe("GenerateAnomaliesReportTaskRepository", () => {
  let anomaliesReportTaskRepository: PrismaGenerateAnomaliesReportTaskRepository;
  let prismaMock: jest.Mocked<PrismaClient>;
  let deviceRepository: jest.Mocked<DeviceRepository>;

  const publicId = uuidv4();

  const tasksToCreate: GenerateAnomaliesReportTask[] = [
    {
      id: uuidv4(),
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Anomalies Report 1",
      threshold: 5,
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
    anomaliesReportTaskRepository = new PrismaGenerateAnomaliesReportTaskRepository(prismaMock, deviceRepository);
  });

  afterEach(() => {
    mockReset(prismaMock);
  });

  describe("getAll", () => {
    it("should fetch all generate anomalies report tasks", async () => {
      const generateAnomaliesReportTaskMock =
        prismaMock.generateAnomaliesReportTask as jest.Mocked<PrismaClient["generateAnomaliesReportTask"]>;

      generateAnomaliesReportTaskMock.findMany.mockImplementation(
        () => Promise.resolve(tasksToCreate) as PrismaPromise<GenerateAnomaliesReportTask[]>
      );

      const tasks = await anomaliesReportTaskRepository.getAll();

      expect(tasks).toEqual(tasksToCreate);
    });
  });

  describe("create", () => {
    it("should create a generate anomalies report task successfully", async () => {
      const newTask: Partial<GenerateAnomaliesReportTask> = {
        startDate: new Date("2024-07-01T10:00:00.000Z"),
        endDate: new Date("2024-07-10T10:00:00.000Z"),
        startReportDate: new Date("2024-07-01T10:00:00.000Z"),
        endReportDate: new Date("2024-07-10T10:00:00.000Z"),
        title: "Anomalies Report 2",
        threshold: 10,
        frequency: "WEEKLY",
      };
      const operatorEmail = "bob.doe@example.com";
      const deviceName = "Device-Monitorize";

      const createdTask: GenerateAnomaliesReportTask = {
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
        threshold: newTask.threshold!,
        title: newTask.title!
      };

      const generateAnomaliesReportTaskMock =
        prismaMock.generateAnomaliesReportTask as jest.Mocked<PrismaClient["generateAnomaliesReportTask"]>;

      generateAnomaliesReportTaskMock.create.mockResolvedValue(createdTask);

      const result = await anomaliesReportTaskRepository.create(newTask, operatorEmail, deviceName);

      expect(result).toEqual(createdTask);
    })
  });

  describe("getTaskByPublicId", () => {
    it("should fetch a task by public ID", async () => {
      // Arrange
      (prismaMock.generateAnomaliesReportTask.findUnique as jest.Mock).mockResolvedValueOnce(tasksToCreate[0]);

      // Act
      const task = await anomaliesReportTaskRepository.getTaskByPublicId(publicId);

      // Assert
      expect(task).toEqual(tasksToCreate[0]);
    });

    it("should return null if task not found", async () => {
      // Arrange
      (prismaMock.generateAnomaliesReportTask.findUnique as jest.Mock).mockResolvedValueOnce(null);

      // Act
      const task = await anomaliesReportTaskRepository.getTaskByPublicId("non-existent-task");

      // Assert
      expect(task).toBeNull();
    });
  });

  describe("update", () => {
    it("should update a generate anomalies report task successfully", async () => {
      // Arrange
      const updatedTaskData: Partial<GenerateAnomaliesReportTask> = {
        publicId,
        startDate: new Date("2024-07-20T10:00:00.000Z"),
        endDate: new Date("2024-07-30T10:00:00.000Z"),
        frequency: "MONTHLY",
        startReportDate: new Date("2024-07-20T10:00:00.000Z"),
        endReportDate: new Date("2024-07-30T10:00:00.000Z"),
        title: "Updated Anomalies Report",
        threshold: 8,
      };

      const updatedTask: GenerateAnomaliesReportTask = {
        ...tasksToCreate[0],
        ...updatedTaskData,
        startDate: new Date(updatedTaskData.startDate!),
        endDate: new Date(updatedTaskData.endDate!),
        startReportDate: new Date(updatedTaskData.startReportDate!),
        endReportDate: new Date(updatedTaskData.endReportDate!),
      };

      (prismaMock.generateAnomaliesReportTask.update as jest.Mock).mockResolvedValueOnce(updatedTask);

      // Act
      const result = await anomaliesReportTaskRepository.update(updatedTaskData.publicId!, updatedTaskData);

      // Assert
      expect(result).toEqual(updatedTask);
    });

    it("should return null if task not found", async () => {
      // Arrange
      const nonExistentPublicId = "non-existent-publicId";
      (prismaMock.generateAnomaliesReportTask.update as jest.Mock).mockResolvedValueOnce(null);

      // Act
      const updatedTask = await anomaliesReportTaskRepository.update(nonExistentPublicId, {
        publicId: nonExistentPublicId,
        startDate: new Date("2024-07-20T10:00:00.000Z"),
        endDate: new Date("2024-07-30T10:00:00.000Z"),
        frequency: "MONTHLY",
        startReportDate: new Date("2024-07-20T10:00:00.000Z"),
        endReportDate: new Date("2024-07-30T10:00:00.000Z"),
        title: "Updated Anomalies Report",
        threshold: 8,
      });

      // Assert
      expect(updatedTask).toBeNull();
    });
  });
});