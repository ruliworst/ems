import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { MonitorizeConsumptionTaskRepository } from "@/ports/tasks/MonitorizeConsumptionTaskRepository";
import MonitorizeConsumptionTaskService from "@/application/services/tasks/MonitorizeConsumptionTaskService";
import { MonitorizeConsumptionTaskDTO } from "@/dtos/tasks/task.dto";
import { Frequency, MonitorizeConsumptionTask } from "@prisma/client";

describe("MonitorizeConsumptionTaskService", () => {
  let tasksRepository: jest.Mocked<MonitorizeConsumptionTaskRepository>;
  let service: MonitorizeConsumptionTaskService;

  const mockTasks: MonitorizeConsumptionTask[] = [
    {
      id: "1",
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      frequency: Frequency.DAILY,
      deviceId: "1234",
      threshold: 100,
      operatorId: "1234",
      supervisorId: null
    },
    {
      id: "2",
      startDate: new Date("2024-06-01T10:00:00.000Z"),
      endDate: new Date("2024-06-10T10:00:00.000Z"),
      frequency: Frequency.DAILY,
      deviceId: "1234",
      threshold: 100,
      operatorId: "1234",
      supervisorId: null
    }
  ];

  const mockTaskDTOs: MonitorizeConsumptionTaskDTO[] = [
    {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      deviceId: "1234",
      threshold: 100,
      operatorId: "1234",
    },
    {
      startDate: "Sat Jun 01 2024",
      endDate: "Mon Jun 10 2024",
      frequency: Frequency.DAILY,
      deviceId: "1234",
      threshold: 100,
      operatorId: "1234",
    }
  ];

  beforeEach(() => {
    tasksRepository = {
      getAll: jest.fn().mockResolvedValue(mockTasks),
    };

    container.registerInstance("MonitorizeConsumptionTaskRepository", tasksRepository);
    service = container.resolve(MonitorizeConsumptionTaskService);
  });

  it("should fetch all tasks", async () => {
    const result = await service.getAll();
    expect(result).toEqual(mockTaskDTOs);
    expect(tasksRepository.getAll).toHaveBeenCalledTimes(1);
  });
});
