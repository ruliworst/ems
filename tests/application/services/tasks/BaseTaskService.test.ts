import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import BaseTaskService from "@/application/services/tasks/BaseTaskService";
import { GenerateAnomaliesReportTaskRepository } from "@/ports/tasks/GenerateAnomaliesReportTaskRepository";
import { GenerateConsumptionReportTaskRepository } from "@/ports/tasks/GenerateConsumptionReportTaskRepository";
import { MaintenanceDeviceTaskRepository } from "@/ports/tasks/MaintenanceDeviceTaskRepository";
import { MonitorizeConsumptionTaskRepository } from "@/ports/tasks/MonitorizeConsumptionTaskRepository";
import { Frequency, GenerateAnomaliesReportTask, GenerateConsumptionReportTask, MaintenanceDeviceTask, MonitorizeConsumptionTask } from "@prisma/client";
import { TaskDTO, TaskType } from "@/dtos/tasks/task.dto";
import { v4 as uuidv4 } from 'uuid';

jest.mock("@/ports/tasks/GenerateAnomaliesReportTaskRepository");
jest.mock("@/ports/tasks/GenerateConsumptionReportTaskRepository");
jest.mock("@/ports/tasks/MaintenanceDeviceTaskRepository");
jest.mock("@/ports/tasks/MonitorizeConsumptionTaskRepository");

describe("BaseTaskService", () => {
  let baseTaskService: BaseTaskService;
  let anomaliesReportTaskRepository: jest.Mocked<GenerateAnomaliesReportTaskRepository>;
  let consumptionReportTaskRepository: jest.Mocked<GenerateConsumptionReportTaskRepository>;
  let maintenanceDeviceTaskRepository: jest.Mocked<MaintenanceDeviceTaskRepository>;
  let monitorizeConsumptionTaskRepository: jest.Mocked<MonitorizeConsumptionTaskRepository>;

  const mockAnomaliesReportTasks: GenerateAnomaliesReportTask[] = [
    {
      id: uuidv4(),
      startDate: new Date("Wed May 01 2024"),
      endDate: new Date("Fri May 10 2024"),
      startReportDate: new Date("Wed May 01 2024"),
      endReportDate: new Date("Fri May 10 2024"),
      title: "Anomalies Report 1",
      threshold: 5,
      deviceId: "1",
      operatorId: "2",
      frequency: Frequency.DAILY,
      supervisorId: null
    }
  ];

  const mockConsumptionReportTasks: GenerateConsumptionReportTask[] = [
    {
      id: uuidv4(),
      startDate: new Date("Wed May 01 2024"),
      endDate: new Date("Fri May 10 2024"),
      startReportDate: new Date("Wed May 01 2024"),
      endReportDate: new Date("Fri May 10 2024"),
      title: "Consumption Report 1",
      deviceId: "1",
      operatorId: "2",
      frequency: Frequency.DAILY,
      supervisorId: null
    }
  ];

  const mockMaintenanceDeviceTasks: MaintenanceDeviceTask[] = [
    {
      id: uuidv4(),
      startDate: new Date("Wed May 01 2024"),
      endDate: new Date("Fri May 10 2024"),
      deviceId: "1",
      operatorId: "2",
      frequency: Frequency.DAILY,
      supervisorId: null
    }
  ];

  const mockMonitorizeConsumptionTasks: MonitorizeConsumptionTask[] = [
    {
      id: uuidv4(),
      startDate: new Date("Wed May 01 2024"),
      endDate: new Date("Fri May 10 2024"),
      threshold: 5,
      deviceId: "1",
      operatorId: "2",
      frequency: Frequency.DAILY,
      supervisorId: null
    }
  ];

  const expectedTaskDTOs: TaskDTO[] = [
    {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.GENERATE_ANOMALIES_REPORT
    },
    {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.GENERATE_CONSUMPTION_REPORT
    },
    {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.MAINTENANCE_DEVICE
    },
    {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.MONITORIZE_CONSUMPTION
    }
  ];

  beforeEach(() => {
    anomaliesReportTaskRepository = {
      getAll: jest.fn().mockResolvedValue(mockAnomaliesReportTasks),
    } as unknown as jest.Mocked<GenerateAnomaliesReportTaskRepository>;

    consumptionReportTaskRepository = {
      getAll: jest.fn().mockResolvedValue(mockConsumptionReportTasks),
    } as unknown as jest.Mocked<GenerateConsumptionReportTaskRepository>;

    maintenanceDeviceTaskRepository = {
      getAll: jest.fn().mockResolvedValue(mockMaintenanceDeviceTasks),
    } as unknown as jest.Mocked<MaintenanceDeviceTaskRepository>;

    monitorizeConsumptionTaskRepository = {
      getAll: jest.fn().mockResolvedValue(mockMonitorizeConsumptionTasks),
    } as unknown as jest.Mocked<MonitorizeConsumptionTaskRepository>;

    container.registerInstance("GenerateAnomaliesReportTaskRepository", anomaliesReportTaskRepository);
    container.registerInstance("GenerateConsumptionReportTaskRepository", consumptionReportTaskRepository);
    container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
    container.registerInstance("MonitorizeConsumptionTaskRepository", monitorizeConsumptionTaskRepository);

    baseTaskService = container.resolve(BaseTaskService);
  });

  it("should fetch all tasks", async () => {
    const result = await baseTaskService.getAll();
    expect(result).toEqual(expectedTaskDTOs);
  });
});
