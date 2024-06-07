import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import BaseTaskService from "@/src/domain/services/tasks/BaseTaskService";
import { $Enums, Frequency, GenerateAnomaliesReportTask, GenerateConsumptionReportTask, MaintenanceDeviceTask, MonitorizeConsumptionTask } from "@prisma/client";
import { TaskType, CreateTaskDTO, TaskViewDTO, UpdateTaskDTO, TaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { v4 as uuidv4 } from 'uuid';
import PrismaGenerateAnomaliesReportTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaGenerateAnomaliesReportTaskRepository";
import PrismaMaintenanceDeviceTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaMaintenanceDeviceTaskRepository";
import PrismaMonitorizeConsumptionTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaMonitorizeConsumptionTaskRepository";
import PrismaGenerateConsumptionReportTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaGenerateConsumptionReportTaskRepository";
import { TaskRepository } from "@/src/domain/persistence/tasks/TaskRepository";
import { any } from "jest-mock-extended";

describe("BaseTaskService", () => {
  let baseTaskService: BaseTaskService;


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
      supervisorId: null,
      publicId: uuidv4()
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
      supervisorId: null,
      publicId: uuidv4()
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
      supervisorId: null,
      publicId: uuidv4()
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
      supervisorId: null,
      publicId: uuidv4()
    }
  ];

  const expectedTaskDTOs: TaskViewDTO[] = [
    {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.GENERATE_ANOMALIES_REPORT,
      publicId: mockAnomaliesReportTasks[0].publicId
    },
    {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.GENERATE_CONSUMPTION_REPORT,
      publicId: mockConsumptionReportTasks[0].publicId
    },
    {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.MAINTENANCE_DEVICE,
      publicId: mockMaintenanceDeviceTasks[0].publicId
    },
    {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.MONITORIZE_CONSUMPTION,
      publicId: mockMonitorizeConsumptionTasks[0].publicId
    }
  ];

  let anomaliesReportTaskRepository: jest.Mocked<PrismaGenerateAnomaliesReportTaskRepository>;
  let consumptionReportTaskRepository: jest.Mocked<PrismaGenerateConsumptionReportTaskRepository>;
  let maintenanceDeviceTaskRepository: jest.Mocked<PrismaMaintenanceDeviceTaskRepository>;
  let monitorizeConsumptionTaskRepository: jest.Mocked<PrismaMonitorizeConsumptionTaskRepository>;

  anomaliesReportTaskRepository = {
    getAll: jest.fn().mockResolvedValue(mockAnomaliesReportTasks),
    create: jest.fn().mockResolvedValue(mockAnomaliesReportTasks[0]),
  } as unknown as jest.Mocked<PrismaGenerateAnomaliesReportTaskRepository>;

  consumptionReportTaskRepository = {
    getAll: jest.fn().mockResolvedValue(mockConsumptionReportTasks),
    create: jest.fn().mockResolvedValue(mockConsumptionReportTasks[0]),
  } as unknown as jest.Mocked<PrismaGenerateConsumptionReportTaskRepository>;

  maintenanceDeviceTaskRepository = {
    getAll: jest.fn().mockResolvedValue(mockMaintenanceDeviceTasks),
    create: jest.fn().mockResolvedValue(mockMaintenanceDeviceTasks[0]),
  } as unknown as jest.Mocked<PrismaMaintenanceDeviceTaskRepository>;

  monitorizeConsumptionTaskRepository = {
    getAll: jest.fn().mockResolvedValue(mockMonitorizeConsumptionTasks),
    create: jest.fn().mockResolvedValue(mockMonitorizeConsumptionTasks[0]),
  } as unknown as jest.Mocked<PrismaMonitorizeConsumptionTaskRepository>;

  beforeEach(() => {
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

    const result = await baseTaskService.create(createTaskDTO);
    const expectedTaskView = {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.GENERATE_ANOMALIES_REPORT,
      publicId: expect.any(String)
    };

    expect(result).toEqual(expectedTaskView);
  });

  it("should create a Generate Consumption Report task", async () => {
    const createTaskDTO: CreateTaskDTO = {
      type: TaskType.GENERATE_CONSUMPTION_REPORT,
      startDate: "2024-05-01T10:00:00.000Z",
      endDate: "2024-05-10T10:00:00.000Z",
      startReportDate: "2024-05-01T10:00:00.000Z",
      endReportDate: "2024-05-10T10:00:00.000Z",
      title: "New Consumption Report",
      threshold: null,
      frequency: Frequency.DAILY,
      deviceName: "Device-Monitorize",
      operatorEmail: "bob.doe@example.com",
    };

    const baseTaskService = container.resolve(BaseTaskService);

    const result = await baseTaskService.create(createTaskDTO);
    const expectedTaskView = {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.GENERATE_CONSUMPTION_REPORT,
      publicId: expect.any(String)
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

    container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
    const baseTaskService = container.resolve(BaseTaskService);

    const result = await baseTaskService.create(createTaskDTO);
    const expectedTaskView = {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.MAINTENANCE_DEVICE,
      publicId: expect.any(String)
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

    const result = await baseTaskService.create(createTaskDTO);
    const expectedTaskView = {
      startDate: "Wed May 01 2024",
      endDate: "Fri May 10 2024",
      frequency: Frequency.DAILY,
      type: TaskType.MONITORIZE_CONSUMPTION,
      publicId: expect.any(String)
    };

    expect(result).toEqual(expectedTaskView);
  });

  it("should handle errors when creating a task", async () => {
    const createTaskDTO: CreateTaskDTO = {
      type: TaskType.GENERATE_ANOMALIES_REPORT,
      startDate: "2024-06-01T10:00:00.000Z",
      endDate: "2024-06-10T10:00:00.000Z",
      endReportDate: null,
      startReportDate: null,
      title: "New Anomalies Report",
      threshold: 15,
      frequency: Frequency.DAILY,
      deviceName: "Device-Monitorize",
      operatorEmail: "bob.doe@example.com",
    };

    anomaliesReportTaskRepository = {
      create: jest.fn().mockRejectedValue(new Error()),
    } as unknown as jest.Mocked<PrismaGenerateAnomaliesReportTaskRepository>;

    container.clearInstances();
    container.registerInstance("GenerateAnomaliesReportTaskRepository", anomaliesReportTaskRepository);
    container.registerInstance("GenerateConsumptionReportTaskRepository", consumptionReportTaskRepository);
    container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
    container.registerInstance("MonitorizeConsumptionTaskRepository", monitorizeConsumptionTaskRepository);

    const baseTaskService = container.resolve(BaseTaskService);

    await expect(baseTaskService.create(createTaskDTO)).rejects.toThrow();
  });

  describe("update", () => {
    it("should update a Generate Anomalies Report task successfully", async () => {
      const existingTask = mockAnomaliesReportTasks[0];

      const updatedTaskDTO: UpdateTaskDTO = {
        publicId: existingTask.publicId,
        startDate: "2024-07-01T10:00:00.000Z",
        endDate: "2024-07-10T10:00:00.000Z",
        startReportDate: "2024-07-01T10:00:00.000Z",
        endReportDate: "2024-07-10T10:00:00.000Z",
        title: "Updated Anomalies Report",
        threshold: 10,
        frequency: Frequency.WEEKLY,
        type: TaskType.GENERATE_ANOMALIES_REPORT,
      };

      const updatedTask: GenerateAnomaliesReportTask = {
        ...updatedTaskDTO,
        id: existingTask.id,
        deviceId: existingTask.deviceId,
        operatorId: existingTask.operatorId,
        supervisorId: existingTask.supervisorId,
        startDate: new Date(updatedTaskDTO.startDate!),
        endDate: new Date(updatedTaskDTO.endReportDate!),
        startReportDate: new Date(updatedTaskDTO.startReportDate!),
        endReportDate: new Date(updatedTaskDTO.endReportDate!),
        title: updatedTaskDTO.title!,
        threshold: updatedTaskDTO.threshold!,
      };

      const anomaliesReportTaskRepository = {
        update: jest.fn().mockResolvedValueOnce(updatedTask),
      };

      container.clearInstances();
      container.registerInstance("GenerateAnomaliesReportTaskRepository", anomaliesReportTaskRepository);
      container.registerInstance("GenerateConsumptionReportTaskRepository", consumptionReportTaskRepository);
      container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
      container.registerInstance("MonitorizeConsumptionTaskRepository", monitorizeConsumptionTaskRepository);
      const baseTaskService = container.resolve(BaseTaskService);

      const result: TaskDTO = await baseTaskService.update(updatedTaskDTO);

      const expectedTask: TaskDTO = {
        ...updatedTaskDTO,
        startDate: updatedTask.startDate.toDateString(),
        endDate: updatedTask.endDate!.toDateString(),
        startReportDate: updatedTask.startReportDate.toDateString(),
        endReportDate: updatedTask.endReportDate.toDateString(),
      };

      expect(result).toEqual(expectedTask);
    });

    it("should update a Generate Consumption Report task successfully", async () => {
      const existingTask = mockConsumptionReportTasks[0];

      const updatedTaskDTO: UpdateTaskDTO = {
        publicId: existingTask.publicId,
        startDate: "2024-08-05T12:00:00.000Z",
        endDate: "2024-08-25T12:00:00.000Z",
        frequency: Frequency.MONTHLY,
        startReportDate: "2024-08-05T12:00:00.000Z",
        endReportDate: "2024-08-25T12:00:00.000Z",
        title: "Updated Consumption Report",
        threshold: 10,
        type: TaskType.GENERATE_CONSUMPTION_REPORT,
      };

      const updatedTask: GenerateConsumptionReportTask = {
        ...updatedTaskDTO,
        id: existingTask.id,
        deviceId: existingTask.deviceId,
        operatorId: existingTask.operatorId,
        supervisorId: existingTask.supervisorId,
        startDate: new Date(updatedTaskDTO.startDate!),
        endDate: new Date(updatedTaskDTO.endDate!),
        startReportDate: new Date(updatedTaskDTO.startReportDate!),
        endReportDate: new Date(updatedTaskDTO.endReportDate!),
        title: updatedTaskDTO.title!
      };

      const consumptionReportTaskRepository = {
        update: jest.fn().mockResolvedValueOnce(updatedTask),
      };

      container.clearInstances();
      container.registerInstance("GenerateAnomaliesReportTaskRepository", anomaliesReportTaskRepository);
      container.registerInstance("GenerateConsumptionReportTaskRepository", consumptionReportTaskRepository);
      container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
      container.registerInstance("MonitorizeConsumptionTaskRepository", monitorizeConsumptionTaskRepository);

      const baseTaskService = container.resolve(BaseTaskService);

      const result: TaskDTO = await baseTaskService.update(updatedTaskDTO);

      const expectedTask: Partial<TaskDTO> = {
        publicId: updatedTaskDTO.publicId,
        startDate: updatedTask.startDate.toDateString(),
        endDate: updatedTask.endDate!.toDateString(),
        startReportDate: updatedTask.startReportDate.toDateString(),
        endReportDate: updatedTask.endReportDate.toDateString(),
        frequency: updatedTask.frequency,
        type: TaskType.GENERATE_CONSUMPTION_REPORT,
        title: updatedTask.title
      };

      expect(result).toEqual(expectedTask);
    });

    it("should update a Maintenance Device task successfully", async () => {
      const existingTask = mockMaintenanceDeviceTasks[0];

      const updatedTaskDTO: UpdateTaskDTO = {
        publicId: existingTask.publicId,
        startDate: "2024-09-10T08:00:00.000Z",
        endDate: "2024-09-25T08:00:00.000Z",
        frequency: Frequency.WEEKLY,
        type: TaskType.MAINTENANCE_DEVICE,
        startReportDate: null,
        endReportDate: null,
        title: null,
        threshold: null
      };

      const updatedTask: MaintenanceDeviceTask = {
        ...updatedTaskDTO,
        id: existingTask.id,
        deviceId: existingTask.deviceId,
        operatorId: existingTask.operatorId,
        supervisorId: existingTask.supervisorId,
        startDate: new Date(updatedTaskDTO.startDate!),
        endDate: new Date(updatedTaskDTO.endDate!),
      };

      const maintenanceDeviceTaskRepository = {
        update: jest.fn().mockResolvedValueOnce(updatedTask),
      };

      container.clearInstances();
      container.registerInstance("GenerateAnomaliesReportTaskRepository", anomaliesReportTaskRepository);
      container.registerInstance("GenerateConsumptionReportTaskRepository", consumptionReportTaskRepository);
      container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
      container.registerInstance("MonitorizeConsumptionTaskRepository", monitorizeConsumptionTaskRepository);

      const baseTaskService = container.resolve(BaseTaskService);

      const result: TaskDTO = await baseTaskService.update(updatedTaskDTO);

      const expectedTask: Partial<TaskDTO> = {
        publicId: updatedTaskDTO.publicId,
        startDate: updatedTask.startDate.toDateString(),
        endDate: updatedTask.endDate!.toDateString(),
        frequency: updatedTask.frequency,
        type: TaskType.MAINTENANCE_DEVICE,
      };

      expect(result).toEqual(expectedTask);
    });

    it("should update a Monitorize Consumption task successfully", async () => {
      const existingTask = mockMonitorizeConsumptionTasks[0];

      const updatedTaskDTO: UpdateTaskDTO = {
        publicId: existingTask.publicId,
        startDate: "2024-10-15T16:30:00.000Z",
        endDate: "2024-10-28T16:30:00.000Z",
        frequency: Frequency.DAILY,
        threshold: 8.2,
        type: TaskType.MONITORIZE_CONSUMPTION,
        startReportDate: null,
        endReportDate: null,
        title: null
      };

      const updatedTask: MonitorizeConsumptionTask = {
        ...updatedTaskDTO,
        id: existingTask.id,
        deviceId: existingTask.deviceId,
        operatorId: existingTask.operatorId,
        supervisorId: existingTask.supervisorId,
        startDate: new Date(updatedTaskDTO.startDate!),
        endDate: new Date(updatedTaskDTO.endDate!),
        threshold: updatedTaskDTO.threshold!
      };

      const monitorizeConsumptionTaskRepository = {
        update: jest.fn().mockResolvedValueOnce(updatedTask),
      };

      container.clearInstances();
      container.registerInstance("GenerateAnomaliesReportTaskRepository", anomaliesReportTaskRepository);
      container.registerInstance("GenerateConsumptionReportTaskRepository", consumptionReportTaskRepository);
      container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
      container.registerInstance("MonitorizeConsumptionTaskRepository", monitorizeConsumptionTaskRepository);

      const baseTaskService = container.resolve(BaseTaskService);

      const result: TaskDTO = await baseTaskService.update(updatedTaskDTO);

      const expectedTask: Partial<TaskDTO> = {
        publicId: updatedTaskDTO.publicId,
        startDate: updatedTask.startDate.toDateString(),
        endDate: updatedTask.endDate!.toDateString(),
        frequency: updatedTask.frequency,
        threshold: updatedTask.threshold,
        type: TaskType.MONITORIZE_CONSUMPTION,
      };

      expect(result).toEqual(expectedTask);
    });

    it("should handle update errors gracefully", async () => {
      const existingTask = mockAnomaliesReportTasks[0];

      const updateTaskDTO: UpdateTaskDTO = {
        publicId: existingTask.publicId,
        startDate: "2024-07-01T10:00:00.000Z",
        endDate: "2024-07-10T10:00:00.000Z",
        startReportDate: "2024-07-01T10:00:00.000Z",
        endReportDate: "2024-07-10T10:00:00.000Z",
        title: "Updated Anomalies Report",
        threshold: 10,
        frequency: Frequency.WEEKLY,
        type: TaskType.GENERATE_ANOMALIES_REPORT,
      };

      const error = new Error("Database error");

      const anomaliesReportTaskRepository = {
        update: jest.fn().mockRejectedValueOnce(error),
      };

      container.clearInstances();
      container.registerInstance("GenerateAnomaliesReportTaskRepository", anomaliesReportTaskRepository);
      container.registerInstance("GenerateConsumptionReportTaskRepository", consumptionReportTaskRepository);
      container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
      container.registerInstance("MonitorizeConsumptionTaskRepository", monitorizeConsumptionTaskRepository);

      const baseTaskService = container.resolve(BaseTaskService);

      await expect(baseTaskService.update(updateTaskDTO)).rejects.toThrow(error);
    });
  });

  describe("delete", () => {
    it("should delete a Generate Anomalies Report task successfully", async () => {
      const existingTask: GenerateAnomaliesReportTask = mockAnomaliesReportTasks[0];

      const existingTaskDTO: TaskDTO = {
        publicId: existingTask.publicId,
        frequency: existingTask.frequency,
        startDate: existingTask.startDate.toDateString(),
        endDate: existingTask.endDate?.toDateString(),
        startReportDate: existingTask.startReportDate.toDateString(),
        endReportDate: existingTask.endReportDate.toDateString(),
        threshold: existingTask.threshold,
        title: existingTask.title,
        type: TaskType.GENERATE_ANOMALIES_REPORT
      };

      const anomaliesReportTaskRepository = {
        delete: jest.fn().mockResolvedValue(existingTask),
      };

      container.clearInstances();
      container.registerInstance("GenerateAnomaliesReportTaskRepository", anomaliesReportTaskRepository);
      container.registerInstance("GenerateConsumptionReportTaskRepository", consumptionReportTaskRepository);
      container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
      container.registerInstance("MonitorizeConsumptionTaskRepository", monitorizeConsumptionTaskRepository);

      const baseTaskService = container.resolve(BaseTaskService);

      // Act
      const result = await baseTaskService.delete(existingTask.publicId);

      // Assert
      expect(result).toEqual(existingTaskDTO);
    });

    it("should delete a Generate Consumption Report task successfully", async () => {
      const existingTask: GenerateConsumptionReportTask = mockConsumptionReportTasks[0];

      const existingTaskDTO: TaskDTO = {
        publicId: existingTask.publicId,
        frequency: existingTask.frequency,
        startDate: existingTask.startDate.toDateString(),
        endDate: existingTask.endDate?.toDateString(),
        startReportDate: existingTask.startReportDate.toDateString(),
        endReportDate: existingTask.endReportDate.toDateString(),
        title: existingTask.title,
        type: TaskType.GENERATE_CONSUMPTION_REPORT
      };

      const consumptionReportTaskRepository = {
        delete: jest.fn().mockResolvedValue(existingTask),
      };

      container.clearInstances();
      container.registerInstance("GenerateAnomaliesReportTaskRepository", anomaliesReportTaskRepository);
      container.registerInstance("GenerateConsumptionReportTaskRepository", consumptionReportTaskRepository);
      container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
      container.registerInstance("MonitorizeConsumptionTaskRepository", monitorizeConsumptionTaskRepository);

      const baseTaskService = container.resolve(BaseTaskService);

      const result = await baseTaskService.delete(existingTask.publicId);

      expect(result).toEqual(existingTaskDTO);
    });

    it("should delete a Maintenance Device task successfully", async () => {
      const existingTask: MaintenanceDeviceTask = mockMaintenanceDeviceTasks[0];

      const existingTaskDTO: TaskDTO = {
        publicId: existingTask.publicId,
        frequency: existingTask.frequency,
        startDate: existingTask.startDate.toDateString(),
        endDate: existingTask.endDate?.toDateString(),
        type: TaskType.MAINTENANCE_DEVICE
      };

      const maintenanceDeviceTaskRepository = {
        delete: jest.fn().mockResolvedValue(existingTask),
      };

      container.clearInstances();
      container.registerInstance("GenerateAnomaliesReportTaskRepository", anomaliesReportTaskRepository);
      container.registerInstance("GenerateConsumptionReportTaskRepository", consumptionReportTaskRepository);
      container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
      container.registerInstance("MonitorizeConsumptionTaskRepository", monitorizeConsumptionTaskRepository);

      const baseTaskService = container.resolve(BaseTaskService);

      const result: TaskDTO | null = await baseTaskService.delete(existingTask.publicId);

      expect(result).toEqual(existingTaskDTO);
    });

    it("should delete a Monitorize Consumption task successfully", async () => {
      const existingTask: MonitorizeConsumptionTask = mockMonitorizeConsumptionTasks[0];

      const existingTaskDTO: TaskDTO = {
        publicId: existingTask.publicId,
        frequency: existingTask.frequency,
        startDate: existingTask.startDate.toDateString(),
        endDate: existingTask.endDate?.toDateString(),
        threshold: 5,
        type: TaskType.MONITORIZE_CONSUMPTION
      };

      const monitorizeConsumptionTaskRepository = {
        delete: jest.fn().mockResolvedValue(existingTask),
      };

      container.clearInstances();
      container.registerInstance("GenerateAnomaliesReportTaskRepository", anomaliesReportTaskRepository);
      container.registerInstance("GenerateConsumptionReportTaskRepository", consumptionReportTaskRepository);
      container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
      container.registerInstance("MonitorizeConsumptionTaskRepository", monitorizeConsumptionTaskRepository);

      const baseTaskService = container.resolve(BaseTaskService);

      const result = await baseTaskService.delete(existingTask.publicId);

      expect(result).toEqual(existingTaskDTO);
    });

    it("should return null if no task is found with the given publicId", async () => {
      const nonExistentPublicId = "non-existent-publicId";

      const generateAnomaliesReportTaskRepository = {
        delete: jest.fn().mockResolvedValue(null),
      };
      const generateConsumptionReportTaskRepository = {
        delete: jest.fn().mockResolvedValue(null),
      };
      const maintenanceDeviceTaskRepository = {
        delete: jest.fn().mockResolvedValue(null),
      };
      const monitorizeConsumptionTaskRepository = {
        delete: jest.fn().mockResolvedValue(null),
      };

      container.clearInstances();
      container.registerInstance("GenerateAnomaliesReportTaskRepository", generateAnomaliesReportTaskRepository);
      container.registerInstance("GenerateConsumptionReportTaskRepository", generateConsumptionReportTaskRepository);
      container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
      container.registerInstance("MonitorizeConsumptionTaskRepository", monitorizeConsumptionTaskRepository);

      const baseTaskService = container.resolve(BaseTaskService);

      const result = await baseTaskService.delete(nonExistentPublicId);

      expect(result).toBeNull();
    });
  });

});
