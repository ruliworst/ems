import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import BaseTaskService from "@/application/services/tasks/BaseTaskService";
import { GenerateAnomaliesReportTaskRepository } from "@/ports/tasks/GenerateAnomaliesReportTaskRepository";
import { GenerateConsumptionReportTaskRepository } from "@/ports/tasks/GenerateConsumptionReportTaskRepository";
import { MaintenanceDeviceTaskRepository } from "@/ports/tasks/MaintenanceDeviceTaskRepository";
import { MonitorizeConsumptionTaskRepository } from "@/ports/tasks/MonitorizeConsumptionTaskRepository";
import { Frequency, GenerateAnomaliesReportTask, GenerateConsumptionReportTask, MaintenanceDeviceTask, MonitorizeConsumptionTask } from "@prisma/client";
import { TaskType, CreateTaskDTO, TaskViewDTO } from "@/dtos/tasks/task.dto";
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
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
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
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      startReportDate: new Date("2024-05-01T10:00:00.000Z"),
      endReportDate: new Date("2024-05-10T10:00:00.000Z"),
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
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      deviceId: "1",
      operatorId: "2",
      frequency: Frequency.DAILY,
      supervisorId: null
    }
  ];

  const mockMonitorizeConsumptionTasks: MonitorizeConsumptionTask[] = [
    {
      id: uuidv4(),
      startDate: new Date("2024-05-01T10:00:00.000Z"),
      endDate: new Date("2024-05-10T10:00:00.000Z"),
      threshold: 5,
      deviceId: "1",
      operatorId: "2",
      frequency: Frequency.DAILY,
      supervisorId: null
    }
  ];

  const expectedTaskDTOs: TaskViewDTO[] = [
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

  it("should create a Generate Anomalies Report task", async () => {
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
      supervisorId: null
    };

    const generateAnomaliesReportTaskRepository = {
      getAll: jest.fn().mockResolvedValue(mockAnomaliesReportTasks),
      create: jest.fn().mockResolvedValue(createdTask)
    };

    container.clearInstances();
    container.registerInstance("GenerateAnomaliesReportTaskRepository", generateAnomaliesReportTaskRepository);
    const baseTaskService = container.resolve(BaseTaskService);

    const result = await baseTaskService.create(createTaskDTO);
    const expectedTaskView = {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.GENERATE_ANOMALIES_REPORT
    };

    expect(result).toEqual(expectedTaskView);
  });

  it("should create a Generate Consumption Report task", async () => {
    const createTaskDTO: CreateTaskDTO = {
      type: TaskType.GENERATE_CONSUMPTION_REPORT,
      startDate: "2024-06-01T10:00:00.000Z",
      endDate: "2024-06-10T10:00:00.000Z",
      startReportDate: "2024-06-01T10:00:00.000Z",
      endReportDate: "2024-06-10T10:00:00.000Z",
      title: "New Consumption Report",
      threshold: null,
      frequency: Frequency.DAILY,
      deviceName: "Device-Monitorize",
      operatorEmail: "bob.doe@example.com",
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
      threshold: createTaskDTO.threshold!,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null
    };

    const anomaliesReportTaskRepository = {
      getAll: jest.fn().mockResolvedValue(mockAnomaliesReportTasks),
      create: jest.fn().mockResolvedValue(createdTask)
    };

    container.registerInstance("AnomaliesReportTaskRepository", anomaliesReportTaskRepository);
    const baseTaskService = container.resolve(BaseTaskService);

    const result = await baseTaskService.create(createTaskDTO);
    const expectedTaskView = {
      startDate: "Sat Jun 01 2024",
      endDate: "Mon Jun 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.GENERATE_CONSUMPTION_REPORT
    };

    expect(result).toEqual(expectedTaskView);
  });

  it("should create a Maintenance Device task", async () => {
    const createTaskDTO: CreateTaskDTO = {
      startDate: "2024-05-01T10:00:00.000Z",
      endDate: "2024-05-10T10:00:00.000Z",
      startReportDate: null,
      endReportDate: null,
      title: null,
      threshold: null,
      frequency: Frequency.DAILY,
      deviceName: "Device-Monitorize",
      operatorEmail: "bob.doe@example.com",
      type: TaskType.MAINTENANCE_DEVICE,
    };

    const id = uuidv4();
    const createdTask: MaintenanceDeviceTask = {
      ...createTaskDTO,
      id: id,
      startDate: new Date(createTaskDTO.startDate),
      endDate: new Date(createTaskDTO.endDate!),
      deviceId: "1",
      operatorId: "2",
      supervisorId: null
    };

    const maintenanceDeviceTaskRepository = {
      getAll: jest.fn().mockResolvedValue(mockMaintenanceDeviceTasks),
      create: jest.fn().mockResolvedValue(createdTask)
    };

    container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
    const baseTaskService = container.resolve(BaseTaskService);

    const result = await baseTaskService.create(createTaskDTO);
    const expectedTaskView = {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.MAINTENANCE_DEVICE
    };

    expect(result).toEqual(expectedTaskView);
  });

  it("should create a Monitorize Consumption task", async () => {
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
    const createdTask: MonitorizeConsumptionTask = {
      ...createTaskDTO,
      id: id,
      startDate: new Date(createTaskDTO.startDate),
      endDate: new Date(createTaskDTO.endDate!),
      threshold: createTaskDTO.threshold!,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null
    };

    const monitorizeConsumptionTaskRepository = {
      getAll: jest.fn().mockResolvedValue(mockMonitorizeConsumptionTasks),
      create: jest.fn().mockResolvedValue(createdTask)
    };

    container.registerInstance("MonitorizeConsumptionTaskRepository", monitorizeConsumptionTaskRepository);
    const baseTaskService = container.resolve(BaseTaskService);

    const result = await baseTaskService.create(createTaskDTO);
    const expectedTaskView = {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.MONITORIZE_CONSUMPTION
    };

    expect(result).toEqual(expectedTaskView);
  });

  it("should handle errors when creating a task", async () => {
    const createTaskDTO: CreateTaskDTO = {
      type: TaskType.GENERATE_ANOMALIES_REPORT,
      startDate: "2024-06-01T10:00:00.000Z",
      endDate: "2024-06-10T10:00:00.000Z",
      startReportDate: "2024-06-01T10:00:00.000Z",
      endReportDate: "2024-06-10T10:00:00.000Z",
      title: "New Anomalies Report",
      threshold: 15,
      frequency: Frequency.DAILY,
      deviceName: "Device-Monitorize",
      operatorEmail: "bob.doe@example.com",
    };

    const error = new Error("Error creating task");
    const generateAnomaliesReportTaskRepository = {
      getAll: jest.fn().mockResolvedValue(mockAnomaliesReportTasks),
      create: jest.fn().mockRejectedValue(error)
    };

    container.clearInstances();
    container.registerInstance("GenerateAnomaliesReportTaskRepository", generateAnomaliesReportTaskRepository);
    const baseTaskService = container.resolve(BaseTaskService);

    await expect(baseTaskService.create(createTaskDTO)).rejects.toThrow("Error creating task");
  });
});
