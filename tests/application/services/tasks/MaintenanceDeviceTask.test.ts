import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { MaintenanceDeviceTaskRepository } from "@/ports/tasks/MaintenanceDeviceTaskRepository";
import MaintenanceDeviceTaskService from "@/application/services/tasks/MaintenanceDeviceTaskService";
import { CreateTaskDTO, TaskType } from "@/dtos/tasks/task.dto";
import { Frequency, MaintenanceDeviceTask } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { MaintenanceDeviceTaskEntity } from "@/domain/model/MaintenanceDeviceTask";

describe("MaintenanceDeviceTaskService", () => {
  let tasksRepository: jest.Mocked<MaintenanceDeviceTaskRepository>;
  let service: MaintenanceDeviceTaskService;

  const firstTaskId = uuidv4();
  const secondTaskId = uuidv4();

  const mockTasks: MaintenanceDeviceTask[] = [
    {
      id: firstTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null
    },
    {
      id: secondTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null
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
      supervisorId: null
    }),
    new MaintenanceDeviceTaskEntity({
      id: secondTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null
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
    deviceId: "1",
    operatorId: "2",
    type: TaskType.MAINTENANCE_DEVICE,
    supervisorId: null
  };

  const id = uuidv4();
  const createdTask: MaintenanceDeviceTask = {
    ...createTaskDTO,
    id: id,
    startDate: new Date(createTaskDTO.startDate),
    endDate: new Date(createTaskDTO.endDate!),
  };

  beforeEach(() => {
    tasksRepository = {
      getAll: jest.fn().mockResolvedValue(mockTasks),
      create: jest.fn().mockResolvedValue(createdTask),
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
});
