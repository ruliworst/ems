import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import GenerateAnomaliesReportTaskService from "@/src/domain/services/tasks/GenerateAnomaliesReportTaskService";
import { Frequency, GenerateAnomaliesReportTask } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO, TaskType } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { GenerateAnomaliesReportTaskRepository } from "@/src/domain/persistence/tasks/GenerateAnomaliesReportTaskRepository";
import { GenerateAnomaliesReportTaskEntity } from "@/src/infrastructure/entities/tasks/GenerateAnomaliesReportTaskEntity";

describe("GenerateAnomaliesReportTaskService", () => {
  let tasksRepository: jest.Mocked<GenerateAnomaliesReportTaskRepository>;
  let service: GenerateAnomaliesReportTaskService;

  const firstTaskId = uuidv4();
  const secondTaskId = uuidv4();
  const firstTaskPublicId = uuidv4();
  const secondTaskPublicId = uuidv4();

  const mockTasks: GenerateAnomaliesReportTask[] = [
    {
      id: firstTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Report 1",
      threshold: 5,
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: firstTaskPublicId,
    },
    {
      id: secondTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Report 2",
      threshold: 10,
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: secondTaskPublicId,
    }
  ];

  const mockTaskEntities: GenerateAnomaliesReportTaskEntity[] = [
    new GenerateAnomaliesReportTaskEntity({
      id: firstTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Report 1",
      threshold: 5,
      frequency: Frequency.DAILY,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: firstTaskPublicId
    }),
    new GenerateAnomaliesReportTaskEntity({
      id: secondTaskId,
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Report 2",
      threshold: 10,
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
    startReportDate: "2024-05-01T10:00:00.000Z",
    endReportDate: "2024-05-10T10:00:00.000Z",
    title: "Report 1",
    threshold: 5,
    frequency: Frequency.DAILY,
    deviceName: "Device-Monitorize",
    operatorEmail: "bob.doe@example.com",
    type: TaskType.GENERATE_ANOMALIES_REPORT,
  };

  const id = uuidv4();
  const publicId = uuidv4();
  const createdTask: GenerateAnomaliesReportTask = {
    ...createTaskDTO,
    id: id,
    startDate: new Date(createTaskDTO.startDate),
    endDate: new Date(createTaskDTO.endDate!),
    startReportDate: new Date(createTaskDTO.startReportDate!),
    endReportDate: new Date(createTaskDTO.endReportDate!),
    title: createTaskDTO.title!,
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
      update: jest.fn()
    } as jest.Mocked<GenerateAnomaliesReportTaskRepository>;

    container.registerInstance("GenerateAnomaliesReportTaskRepository", tasksRepository);
    service = container.resolve(GenerateAnomaliesReportTaskService);
  });

  it("should fetch all tasks", async () => {
    const result = await service.getAll();
    expect(result).toEqual(mockTaskEntities);
    expect(tasksRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it("should create a new task", async () => {
    const result = await service.create(createTaskDTO);
    const expectedTaskEntity = new GenerateAnomaliesReportTaskEntity({ ...createdTask, id });

    expect(result).toEqual(expectedTaskEntity);
  });

  it("should fetch a task by public ID", async () => {
    const taskEntity = new GenerateAnomaliesReportTaskEntity(mockTasks[0]);
    const result = await service.getTaskByPublicId(firstTaskPublicId);

    expect(result).toEqual(taskEntity);
  });
});
