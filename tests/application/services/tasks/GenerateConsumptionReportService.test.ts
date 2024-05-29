import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { GenerateConsumptionReportTaskRepository } from "@/ports/tasks/GenerateConsumptionReportTaskRepository";
import GenerateConsumptionReportTaskService from "@/application/services/tasks/GenerateConsumptionReportTaskService";
import { CreateTaskDTO, TaskType } from "@/dtos/tasks/task.dto";
import { Frequency, GenerateConsumptionReportTask } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { GenerateConsumptionReportTaskEntity } from "@/domain/model/GenerateConsumptionReportTask";

describe("GenerateConsumptionReportTaskService", () => {
  let tasksRepository: jest.Mocked<GenerateConsumptionReportTaskRepository>;
  let service: GenerateConsumptionReportTaskService;

  const firstTaskId = uuidv4();
  const secondTaskId = uuidv4();

  const mockTasks: GenerateConsumptionReportTask[] = [
    {
      id: firstTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Report 1",
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null
    },
    {
      id: secondTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Report 2",
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null
    }
  ];

  const mockTaskEntities: GenerateConsumptionReportTaskEntity[] = [
    new GenerateConsumptionReportTaskEntity({
      id: firstTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Report 1",
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null
    }),
    new GenerateConsumptionReportTaskEntity({
      id: secondTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Report 2",
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null
    })
  ];

  const createTaskDTO: CreateTaskDTO = {
    startDate: "2024-05-01T10:00:00.000Z",
    endDate: "2024-05-10T10:00:00.000Z",
    startReportDate: "2024-05-01T10:00:00.000Z",
    endReportDate: "2024-05-10T10:00:00.000Z",
    title: "Report 1",
    threshold: null,
    frequency: Frequency.DAILY,
    deviceName: "Device-Monitorize",
    operatorEmail: "bob.doe@example.com",
    type: TaskType.GENERATE_CONSUMPTION_REPORT,
  };

  const id = uuidv4();
  const createdTask: GenerateConsumptionReportTask = {
    ...createTaskDTO,
    id: id,
    startDate: new Date(createTaskDTO.startDate),
    endDate: new Date(createTaskDTO.endDate!),
    startReportDate: new Date(createTaskDTO.startReportDate!),
    endReportDate: new Date(createTaskDTO.endReportDate!),
    title: createTaskDTO.title!,
    deviceId: "1",
    operatorId: "2",
    supervisorId: null
  };

  beforeEach(() => {
    tasksRepository = {
      getAll: jest.fn().mockResolvedValue(mockTasks),
      create: jest.fn().mockResolvedValue(createdTask),
    };

    container.registerInstance("GenerateConsumptionReportTaskRepository", tasksRepository);
    service = container.resolve(GenerateConsumptionReportTaskService);
  });

  it("should fetch all tasks", async () => {
    const result = await service.getAll();
    expect(result).toEqual(mockTaskEntities);
    expect(tasksRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it("should create a new task", async () => {
    const result = await service.create(createTaskDTO);
    const expectedTaskEntity = new GenerateConsumptionReportTaskEntity({ ...createdTask, id });

    expect(result).toEqual(expectedTaskEntity);
  });
});
