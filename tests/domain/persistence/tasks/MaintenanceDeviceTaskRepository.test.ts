import { mockDeep, mockReset } from 'jest-mock-extended';

import "reflect-metadata";
import "@/config/container";
import { MaintenanceDeviceTask, PrismaClient, PrismaPromise } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";
import PrismaMaintenanceDeviceTaskRepository from '@/src/infrastructure/prisma/tasks/PrismaMaintenanceDeviceTaskRepository';


jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockDeep<PrismaClient>()),
}));

jest.mock("@/src/domain/persistence/devices/DeviceRepository");

describe("MaintenanceDeviceTaskRepository", () => {
  let maintenanceDeviceTaskRepository: PrismaMaintenanceDeviceTaskRepository;
  let prismaMock: jest.Mocked<PrismaClient>;
  let deviceRepository: jest.Mocked<DeviceRepository>;

  const publicId = uuidv4();

  const tasksToCreate: MaintenanceDeviceTask[] = [
    {
      id: uuidv4(),
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
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
    maintenanceDeviceTaskRepository = new PrismaMaintenanceDeviceTaskRepository(prismaMock, deviceRepository);
  });

  afterEach(() => {
    mockReset(prismaMock);
  });

  describe("getAll", () => {
    it("should fetch all maintenance device tasks", async () => {
      const maintenanceDeviceTaskMock =
        prismaMock.maintenanceDeviceTask as jest.Mocked<PrismaClient["maintenanceDeviceTask"]>;

      maintenanceDeviceTaskMock.findMany.mockImplementation(
        () => Promise.resolve(tasksToCreate) as PrismaPromise<MaintenanceDeviceTask[]>
      );

      const tasks = await maintenanceDeviceTaskRepository.getAll();

      expect(tasks).toEqual(tasksToCreate);
    });
  });

  describe("create", () => {
    it("should create a maintenance device task successfully", async () => {
      const newTask: Partial<MaintenanceDeviceTask> = {
        startDate: new Date("2024-07-01T10:00:00.000Z"),
        endDate: new Date("2024-07-10T10:00:00.000Z"),
        frequency: "WEEKLY",
      };
      const operatorEmail = "bob.doe@example.com";
      const deviceName = "Device-Monitorize";

      const createdTask: MaintenanceDeviceTask = {
        ...newTask,
        startDate: new Date(newTask.startDate!),
        endDate: new Date(newTask.endDate!),
        id: uuidv4(),
        deviceId: "1",
        operatorId: "2",
        supervisorId: null,
        publicId: uuidv4(),
        frequency: newTask.frequency!,
      };

      const maintenanceDeviceTaskMock =
        prismaMock.maintenanceDeviceTask as jest.Mocked<PrismaClient["maintenanceDeviceTask"]>;

      maintenanceDeviceTaskMock.create.mockResolvedValue(createdTask);

      const result = await maintenanceDeviceTaskRepository.create(newTask, operatorEmail, deviceName);

      expect(result).toEqual(createdTask);
    })
  });
  describe("getTaskByPublicId", () => {
    it("should fetch a task by public ID", async () => {
      (prismaMock.maintenanceDeviceTask.findUnique as jest.MockedFunction<
        typeof prismaMock.maintenanceDeviceTask.findUnique
      >).mockResolvedValueOnce(tasksToCreate[0]);

      const task = await maintenanceDeviceTaskRepository.getTaskByPublicId(publicId);

      expect(task).toEqual(tasksToCreate[0]);
    });

    it("should return null if task not found", async () => {
      (prismaMock.maintenanceDeviceTask.findUnique as jest.MockedFunction<
        typeof prismaMock.maintenanceDeviceTask.findUnique
      >).mockResolvedValueOnce(null);

      const task = await maintenanceDeviceTaskRepository.getTaskByPublicId("non-existent-task");

      expect(task).toBeNull();
    });
  });

  describe("update", () => {
    it("should update a maintenance device task successfully", async () => {
      const updatedTaskData: Partial<MaintenanceDeviceTask> = {
        publicId,
        startDate: new Date("2024-07-20T10:00:00.000Z"),
        endDate: new Date("2024-07-30T10:00:00.000Z"),
        frequency: "MONTHLY",
      };

      const updatedTask: MaintenanceDeviceTask = {
        ...tasksToCreate[0],
        ...updatedTaskData,
        startDate: new Date(updatedTaskData.startDate!),
        endDate: new Date(updatedTaskData.endDate!),
      };

      (prismaMock.maintenanceDeviceTask.update as jest.MockedFunction<
        typeof prismaMock.maintenanceDeviceTask.update
      >).mockResolvedValueOnce(updatedTask);

      const result = await maintenanceDeviceTaskRepository.update(
        updatedTaskData.publicId!,
        updatedTaskData
      );

      expect(result).toEqual(updatedTask);
    });

    it("should return null if task not found", async () => {
      const nonExistentPublicId = "non-existent-publicId";

      (prismaMock.maintenanceDeviceTask.update as jest.MockedFunction<
        typeof prismaMock.maintenanceDeviceTask.update
      >).mockRejectedValueOnce({
        code: "P2025",
        message: "An operation failed because it depends on one or more records that were required but not found. {cause}",
      });

      const updatedTask = await maintenanceDeviceTaskRepository.update(
        nonExistentPublicId,
        {
          publicId: nonExistentPublicId,
          startDate: new Date("2024-07-20T10:00:00.000Z"),
          endDate: new Date("2024-07-30T10:00:00.000Z"),
          frequency: "MONTHLY",
        }
      );

      expect(updatedTask).toBeNull();
    });
  });
});