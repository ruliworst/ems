import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import MonitorizeConsumptionTaskService from "@/src/domain/services/tasks/MonitorizeConsumptionTaskService";
import { CreateTaskDTO, TaskType } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { Frequency, MonitorizeConsumptionTask } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { MonitorizeConsumptionTaskRepository } from "@/src/domain/persistence/tasks/MonitorizeConsumptionTaskRepository";
import { MonitorizeConsumptionTaskEntity } from "@/src/infrastructure/entities/tasks/MonitorizeConsumptionTaskEntity";

describe("MonitorizeConsumptionTaskService", () => {
  let tasksRepository: jest.Mocked<MonitorizeConsumptionTaskRepository>;
  let service: MonitorizeConsumptionTaskService;

  const firstTaskId = uuidv4();
  const secondTaskId = uuidv4();
  const firstTaskPublicId = uuidv4();
  const secondTaskPublicId = uuidv4();

  const mockTasks: MonitorizeConsumptionTask[] = [
    {
      id: firstTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.DAILY,
      deviceId: "1",
      threshold: 100,
      operatorId: "2",
      supervisorId: null,
      publicId: firstTaskPublicId
    },
    {
      id: secondTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.MONTHLY,
      deviceId: "1",
      threshold: 100,
      operatorId: "2",
      supervisorId: null,
      publicId: secondTaskPublicId
    }
  ];

  const mockTaskEntities: MonitorizeConsumptionTaskEntity[] = [
    new MonitorizeConsumptionTaskEntity({
      id: firstTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.DAILY,
      threshold: 100,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: firstTaskPublicId
    }),
    new MonitorizeConsumptionTaskEntity({
      id: secondTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.MONTHLY,
      threshold: 100,
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
    threshold: 1,
    frequency: Frequency.DAILY,
    deviceName: "Device-Monitorize",
    operatorEmail: "bob.doe@example.com",
    type: TaskType.MONITORIZE_CONSUMPTION
  };

  const id = uuidv4();
  const publicId = uuidv4();
  const createdTask: MonitorizeConsumptionTask = {
    ...createTaskDTO,
    id: id,
    startDate: new Date(createTaskDTO.startDate),
    endDate: new Date(createTaskDTO.endDate!),
    threshold: createTaskDTO.threshold!,
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
    };

    container.registerInstance("MonitorizeConsumptionTaskRepository", tasksRepository);
    service = container.resolve(MonitorizeConsumptionTaskService);
  });

  it("should fetch all tasks", async () => {
    const result = await service.getAll();
    expect(result).toEqual(mockTaskEntities);
    expect(tasksRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it("should create a new task", async () => {
    const result = await service.create(createTaskDTO);
    const expectedTaskEntity = new MonitorizeConsumptionTaskEntity({ ...createdTask, id });

    expect(result).toEqual(expectedTaskEntity);
  });

  it("should fetch a task by public ID", async () => {
    const taskEntity = new MonitorizeConsumptionTaskEntity(mockTasks[0]);
    const result = await service.getTaskByPublicId(firstTaskPublicId);

    expect(result).toEqual(taskEntity);
  });
});
