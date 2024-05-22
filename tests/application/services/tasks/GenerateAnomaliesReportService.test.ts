import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { GenerateAnomaliesReportTaskRepository } from "@/ports/tasks/GenerateAnomaliesReportTaskRepository";
import GenerateAnomaliesReportTaskService from "@/application/services/tasks/GenerateAnomaliesReportTaskService";
import { Frequency, GenerateAnomaliesReportTask } from "@prisma/client";
import { GenerateAnomaliesReportTaskDTO } from "@/dtos/tasks/task.dto";

describe("GenerateAnomaliesReportTaskService", () => {
  let tasksRepository: jest.Mocked<GenerateAnomaliesReportTaskRepository>;
  let service: GenerateAnomaliesReportTaskService;

  const mockTasks: GenerateAnomaliesReportTask[] = [
    {
      id: "1",
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Report 1",
      threshold: 5,
      frequency: Frequency.DAILY,
      deviceId: "1234",
      operatorId: "1234",
      supervisorId: null
    },
    {
      id: "2",
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Report 2",
      threshold: 10,
      frequency: Frequency.DAILY,
      deviceId: "1234",
      operatorId: "1234",
      supervisorId: null
    }
  ];

  const mockTaskDTOs: GenerateAnomaliesReportTaskDTO[] = [
    {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      startReportDate: "Wed May 01 2024",
      endReportDate: "Fri May 10 2024",
      title: "Report 1",
      threshold: 5,
      frequency: Frequency.DAILY,
      deviceId: "1234",
      operatorId: "1234",
    },
    {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      startReportDate: "Wed May 01 2024",
      endReportDate: "Fri May 10 2024",
      title: "Report 2",
      threshold: 10,
      frequency: Frequency.DAILY,
      deviceId: "1234",
      operatorId: "1234",
    }
  ];

  beforeEach(() => {
    tasksRepository = {
      getAll: jest.fn().mockResolvedValue(mockTasks),
    };

    container.registerInstance("GenerateAnomaliesReportTaskRepository", tasksRepository);
    service = container.resolve(GenerateAnomaliesReportTaskService);
  });

  it("should fetch all tasks", async () => {
    const result = await service.getAll();
    expect(result).toEqual(mockTaskDTOs);
    expect(tasksRepository.getAll).toHaveBeenCalledTimes(1);
  });
});
