import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { GenerateConsumptionReportTaskRepository } from "@/ports/tasks/GenerateConsumptionReportTaskRepository";
import GenerateConsumptionReportTaskService from "@/application/services/tasks/GenerateConsumptionReportTaskService";
import { GenerateConsumptionReportTaskDTO } from "@/dtos/tasks/task.dto";
import { Frequency, GenerateConsumptionReportTask } from "@prisma/client";

describe("GenerateConsumptionReportTaskService", () => {
  let tasksRepository: jest.Mocked<GenerateConsumptionReportTaskRepository>;
  let service: GenerateConsumptionReportTaskService;

  const mockTasks: GenerateConsumptionReportTask[] = [
    {
      id: "1",
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Report 1",
      frequency: Frequency.DAILY,
      deviceId: "1234",
      operatorId: "1234",
      supervisorId: null
    },
    {
      id: "2",
      startDate: new Date("2024-06-01T10:00:00.000Z"),
      endDate: new Date("2024-06-10T10:00:00.000Z"),
      startReportDate: new Date("2024-06-01T10:00:00.000Z"),
      endReportDate: new Date("2024-06-10T10:00:00.000Z"),
      title: "Report 2",
      frequency: Frequency.DAILY,
      deviceId: "1234",
      operatorId: "1234",
      supervisorId: null
    }
  ];

  const mockTaskDTOs: GenerateConsumptionReportTaskDTO[] = [
    {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      startReportDate: "Wed May 01 2024",
      endReportDate: "Fri May 10 2024",
      title: "Report 1",
      frequency: Frequency.DAILY,
      deviceId: "1234",
      operatorId: "1234",
    },
    {
      startDate: "Sat Jun 01 2024",
      endDate: "Mon Jun 10 2024",
      startReportDate: "Sat Jun 01 2024",
      endReportDate: "Mon Jun 10 2024",
      title: "Report 2",
      frequency: Frequency.DAILY,
      deviceId: "1234",
      operatorId: "1234",
    }
  ];

  beforeEach(() => {
    tasksRepository = {
      getAll: jest.fn().mockResolvedValue(mockTasks),
    };

    container.registerInstance("GenerateConsumptionReportTaskRepository", tasksRepository);
    service = container.resolve(GenerateConsumptionReportTaskService);
  });

  it("should fetch all tasks", async () => {
    const result = await service.getAll();
    expect(result).toEqual(mockTaskDTOs);
    expect(tasksRepository.getAll).toHaveBeenCalledTimes(1);
  });
});
