import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import MaintenanceDeviceTaskService from "@/src/domain/services/tasks/MaintenanceDeviceTaskService";
import { CreateTaskDTO, TaskType } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { Frequency, MaintenanceDeviceTask } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { MaintenanceDeviceTaskRepository } from "@/src/domain/persistence/tasks/MaintenanceDeviceTaskRepository";
import { MaintenanceDeviceTaskEntity } from "@/src/infrastructure/entities/tasks/MaintenanceDeviceTaskEntity";

describe("MaintenanceDeviceTaskService", () => {
  let tasksRepository: jest.Mocked<MaintenanceDeviceTaskRepository>;
  let service: MaintenanceDeviceTaskService;

  const firstTaskId = uuidv4();
  const secondTaskId = uuidv4();
  const firstTaskPublicId = uuidv4();
  const secondTaskPublicId = uuidv4();

  const mockTasks: MaintenanceDeviceTask[] = [
    {
      id: firstTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: firstTaskPublicId
    },
    {
      id: secondTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: secondTaskPublicId
    }
  ];

  const mockTaskEntities: MaintenanceDeviceTaskEntity[] = [
    new MaintenanceDeviceTaskEntity({
      id: firstTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: firstTaskPublicId
    }),
    new MaintenanceDeviceTaskEntity({
      id: secondTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: secondTaskPublicId
    })
  ];

  const createTaskDTO: CreateTaskDTO = {
    startDate: "2024-05-01T10:00:00.000Z",
    endDate: "2024-05-10T10:00:00.000Z",
    startReportDate: null,
    endReportDate: null,
    title: null,
    threshold: null,
    frequency: Frequency.DAILY,
    deviceName: "Device-Monitorize",
    operatorEmail: "bob.doe@example.com",
    type: TaskType.MAINTENANCE_DEVICE
  };

  const id = uuidv4();
  const publicId = uuidv4();
  const createdTask: MaintenanceDeviceTask = {
    ...createTaskDTO,
    id: id,
    startDate: new Date(createTaskDTO.startDate),
    endDate: new Date(createTaskDTO.endDate!),
    deviceId: "1",
    operatorId: "2",
    supervisorId: null,
    publicId
  };

  beforeEach(() => {
    tasksRepository = {
      getAll: jest.fn().mockResolvedValue(mockTasks),
      create: jest.fn().mockResolvedValue(createdTask),
      getTaskByPublicId: jest.fn().mockResolvedValue(mockTaskEntities[0]),
      update: jest.fn(),
      delete: jest.fn()
    };

    container.registerInstance("MaintenanceDeviceTaskRepository", tasksRepository);
    service = container.resolve(MaintenanceDeviceTaskService);
  });

  it("should fetch all tasks", async () => {
    const result = await service.getAll();
    expect(result).toEqual(mockTaskEntities);
    expect(tasksRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it("should create a new task", async () => {
    const result = await service.create(createTaskDTO);
    const expectedTaskEntity = new MaintenanceDeviceTaskEntity({ ...createdTask, id });

    expect(result).toEqual(expectedTaskEntity);
  });

  it("should fetch a task by public ID", async () => {
    const taskEntity = new MaintenanceDeviceTaskEntity(mockTasks[0]);
    const result = await service.getTaskByPublicId(firstTaskPublicId);

    expect(result).toEqual(taskEntity);
  });
});
