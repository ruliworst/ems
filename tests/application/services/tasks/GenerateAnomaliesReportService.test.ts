import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { GenerateAnomaliesReportTaskRepository } from "@/ports/tasks/GenerateAnomaliesReportTaskRepository";
import GenerateAnomaliesReportTaskService from "@/application/services/tasks/GenerateAnomaliesReportTaskService";

describe("GenerateAnomaliesReportTaskService", () => {
  let tasksRepository: jest.Mocked<GenerateAnomaliesReportTaskRepository>;
  let service: GenerateAnomaliesReportTaskService;

  const mockTasks = [
    {
      id: "1",
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
      title: "Report 1",
      threshold: 5
    },
    {
      id: "2",
      startDate: new Date("2024-06-01T10:00:00.000Z"),
      endDate: new Date("2024-06-10T10:00:00.000Z"),
      startReportDate: new Date("2024-06-01T10:00:00.000Z"),
      endReportDate: new Date("2024-06-10T10:00:00.000Z"),
      title: "Report 2",
      threshold: 10
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

    expect(result).toEqual([
      {
        startDate: "Wed May 01 2024",
        endDate: "Fri May 10 2024",
        startReportDate: "Wed May 01 2024",
        endReportDate: "Fri May 10 2024",
        title: "Report 1",
        threshold: 5
      },
      {
        startDate: "Sat Jun 01 2024",
        endDate: "Mon Jun 10 2024",
        startReportDate: "Sat Jun 01 2024",
        endReportDate: "Mon Jun 10 2024",
        title: "Report 2",
        threshold: 10
      }
    ]);

    expect(tasksRepository.getAll).toHaveBeenCalledTimes(1);
  });
});
