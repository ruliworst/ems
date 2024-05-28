import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { MonitorizeConsumptionTaskRepository } from "@/ports/tasks/MonitorizeConsumptionTaskRepository";
import MonitorizeConsumptionTaskService from "@/application/services/tasks/MonitorizeConsumptionTaskService";
import { CreateTaskDTO, TaskType } from "@/dtos/tasks/task.dto";
import { Frequency, MonitorizeConsumptionTask } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { MonitorizeConsumptionTaskEntity } from "@/domain/model/MonitorizeConsumptionTask";

describe("MonitorizeConsumptionTaskService", () => {
  let tasksRepository: jest.Mocked<MonitorizeConsumptionTaskRepository>;
  let service: MonitorizeConsumptionTaskService;

  const firstTaskId = uuidv4();
  const secondTaskId = uuidv4();

  const mockTasks: MonitorizeConsumptionTask[] = [
    {
      id: firstTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.DAILY,
      deviceId: "1",
      threshold: 100,
      operatorId: "2",
      supervisorId: null
    },
    {
      id: secondTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.MONTHLY,
      deviceId: "1",
      threshold: 100,
      operatorId: "2",
      supervisorId: null
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
      supervisorId: null
    }),
    new MonitorizeConsumptionTaskEntity({
      id: secondTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.MONTHLY,
      threshold: 100,
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
    threshold: 1,
    frequency: Frequency.DAILY,
    deviceId: "1",
    operatorId: "2",
    type: TaskType.MONITORIZE_CONSUMPTION,
    supervisorId: null
  };

  const id = uuidv4();
  const createdTask: MonitorizeConsumptionTask = {
    ...createTaskDTO,
    id: id,
    startDate: new Date(createTaskDTO.startDate),
    endDate: new Date(createTaskDTO.endDate!),
    threshold: createTaskDTO.threshold!
  };

  beforeEach(() => {
    tasksRepository = {
      getAll: jest.fn().mockResolvedValue(mockTasks),
      create: jest.fn().mockResolvedValue(createdTask),
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
});
