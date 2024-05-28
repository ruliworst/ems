import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { GenerateAnomaliesReportTaskRepository } from "@/ports/tasks/GenerateAnomaliesReportTaskRepository";
import GenerateAnomaliesReportTaskService from "@/application/services/tasks/GenerateAnomaliesReportTaskService";
import { Frequency, GenerateAnomaliesReportTask } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { GenerateAnomaliesReportTaskEntity } from "@/domain/model/GenerateAnomaliesReportTask";
import { CreateTaskDTO, TaskType } from "@/dtos/tasks/task.dto";

describe("GenerateAnomaliesReportTaskService", () => {
  let tasksRepository: jest.Mocked<GenerateAnomaliesReportTaskRepository>;
  let service: GenerateAnomaliesReportTaskService;

  const firstTaskId = uuidv4();
  const secondTaskId = uuidv4();

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
      supervisorId: null
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
      supervisorId: null
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
      supervisorId: null
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
      supervisorId: null
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
    deviceId: "1",
    operatorId: "2",
    type: TaskType.GENERATE_ANOMALIES_REPORT,
    supervisorId: null
  };

  const id = uuidv4();
  const createdTask: GenerateAnomaliesReportTask = {
    ...createTaskDTO,
    id: id,
    startDate: new Date(createTaskDTO.startDate),
    endDate: new Date(createTaskDTO.endDate!),
    startReportDate: new Date(createTaskDTO.startReportDate!),
    endReportDate: new Date(createTaskDTO.endReportDate!),
    title: createTaskDTO.title!,
    threshold: createTaskDTO.threshold!
  };

  beforeEach(() => {
    tasksRepository = {
      getAll: jest.fn().mockResolvedValue(mockTasks),
      create: jest.fn().mockResolvedValue(createdTask),
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
});
