import { mockDeep, mockReset } from 'jest-mock-extended';

import "reflect-metadata";
import "@/config/container";
import { MonitorizeConsumptionTask, PrismaClient, PrismaPromise } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";
import PrismaMonitorizeConsumptionTaskRepository from '@/src/infrastructure/prisma/tasks/PrismaMonitorizeConsumptionTaskRepository';


jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockDeep<PrismaClient>()),
}));

jest.mock("@/src/domain/persistence/devices/DeviceRepository");

describe("MonitorizeConsumptionTaskRepository", () => {
  let monitorizeConsumptionTaskRepository: PrismaMonitorizeConsumptionTaskRepository;
  let prismaMock: jest.Mocked<PrismaClient>;
  let deviceRepository: jest.Mocked<DeviceRepository>;

  const publicId = uuidv4();

  const tasksToCreate: MonitorizeConsumptionTask[] = [
    {
      id: uuidv4(),
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      frequency: "DAILY",
      publicId,
      threshold: 10,
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
    monitorizeConsumptionTaskRepository = new PrismaMonitorizeConsumptionTaskRepository(prismaMock, deviceRepository);
  });

  afterEach(() => {
    mockReset(prismaMock);
  });

  describe("getAll", () => {
    it("should fetch all monitorize consumption tasks", async () => {
      const monitorizeConsumptionTaskMock =
        prismaMock.monitorizeConsumptionTask as jest.Mocked<PrismaClient["monitorizeConsumptionTask"]>;

      monitorizeConsumptionTaskMock.findMany.mockImplementation(
        () => Promise.resolve(tasksToCreate) as PrismaPromise<MonitorizeConsumptionTask[]>
      );

      const tasks = await monitorizeConsumptionTaskRepository.getAll();

      expect(tasks).toEqual(tasksToCreate);
    });
  });

  describe("create", () => {
    it("should create a monitorize consumption task successfully", async () => {
      const newTask: Partial<MonitorizeConsumptionTask> = {
        startDate: new Date("2024-07-01T10:00:00.000Z"),
        endDate: new Date("2024-07-10T10:00:00.000Z"),
        frequency: "WEEKLY",
        threshold: 10
      };
      const operatorEmail = "bob.doe@example.com";
      const deviceName = "Device-Monitorize";

      const createdTask: MonitorizeConsumptionTask = {
        ...newTask,
        startDate: new Date(newTask.startDate!),
        endDate: new Date(newTask.endDate!),
        id: uuidv4(),
        deviceId: "1",
        operatorId: "2",
        supervisorId: null,
        publicId: uuidv4(),
        frequency: newTask.frequency!,
        threshold: newTask.threshold!
      };

      const monitorizeConsumptionTaskMock =
        prismaMock.monitorizeConsumptionTask as jest.Mocked<PrismaClient["monitorizeConsumptionTask"]>;

      monitorizeConsumptionTaskMock.create.mockResolvedValue(createdTask);

      const result = await monitorizeConsumptionTaskRepository.create(newTask, operatorEmail, deviceName);

      expect(result).toEqual(createdTask);
    })
  });
  describe("getTaskByPublicId", () => {
    it("should fetch a task by public ID", async () => {
      (prismaMock.monitorizeConsumptionTask.findUnique as jest.MockedFunction<
        typeof prismaMock.monitorizeConsumptionTask.findUnique
      >).mockResolvedValueOnce(tasksToCreate[0]);

      const task = await monitorizeConsumptionTaskRepository.getTaskByPublicId(publicId);

      expect(task).toEqual(tasksToCreate[0]);
    });

    it("should return null if task not found", async () => {
      (prismaMock.monitorizeConsumptionTask.findUnique as jest.MockedFunction<
        typeof prismaMock.monitorizeConsumptionTask.findUnique
      >).mockResolvedValueOnce(null);

      const task = await monitorizeConsumptionTaskRepository.getTaskByPublicId("non-existent-task");

      expect(task).toBeNull();
    });
  });

  describe("update", () => {
    it("should update a monitorize consumption task successfully", async () => {
      const updatedTaskData: Partial<MonitorizeConsumptionTask> = {
        publicId,
        startDate: new Date("2024-07-20T10:00:00.000Z"),
        endDate: new Date("2024-07-30T10:00:00.000Z"),
        frequency: "MONTHLY",
        threshold: 10
      };

      const updatedTask: MonitorizeConsumptionTask = {
        ...tasksToCreate[0],
        ...updatedTaskData,
        startDate: new Date(updatedTaskData.startDate!),
        endDate: new Date(updatedTaskData.endDate!),
        threshold: updatedTaskData.threshold!
      };

      (prismaMock.monitorizeConsumptionTask.update as jest.MockedFunction<
        typeof prismaMock.monitorizeConsumptionTask.update
      >).mockResolvedValueOnce(updatedTask);

      const result = await monitorizeConsumptionTaskRepository.update(
        updatedTaskData.publicId!,
        updatedTaskData
      );

      expect(result).toEqual(updatedTask);
    });

    it("should return null if task not found", async () => {
      const nonExistentPublicId = "non-existent-publicId";

      (prismaMock.monitorizeConsumptionTask.update as jest.MockedFunction<
        typeof prismaMock.monitorizeConsumptionTask.update
      >).mockRejectedValueOnce({
        code: "P2025",
        message: "An operation failed because it depends on one or more records that were required but not found. {cause}",
      });

      const updatedTask = await monitorizeConsumptionTaskRepository.update(
        nonExistentPublicId,
        {
          publicId: nonExistentPublicId,
          startDate: new Date("2024-07-20T10:00:00.000Z"),
          endDate: new Date("2024-07-30T10:00:00.000Z"),
          frequency: "MONTHLY",
          threshold: 10
        }
      );

      expect(updatedTask).toBeNull();
    });
  });
});