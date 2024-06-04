import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import BaseTaskService from "@/src/domain/services/tasks/BaseTaskService";
import { Frequency, GenerateAnomaliesReportTask, GenerateConsumptionReportTask, MaintenanceDeviceTask, MonitorizeConsumptionTask } from "@prisma/client";
import { TaskType, CreateTaskDTO, TaskViewDTO, UpdateTaskDTO, TaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { v4 as uuidv4 } from 'uuid';
import { GenerateAnomaliesReportTaskRepository } from "@/src/domain/persistence/tasks/GenerateAnomaliesReportTaskRepository";
import { GenerateConsumptionReportTaskRepository } from "@/src/domain/persistence/tasks/GenerateConsumptionReportTaskRepository";
import { MaintenanceDeviceTaskRepository } from "@/src/domain/persistence/tasks/MaintenanceDeviceTaskRepository";
import { MonitorizeConsumptionTaskRepository } from "@/src/domain/persistence/tasks/MonitorizeConsumptionTaskRepository";

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
      supervisorId: null,
      publicId: expect.any(String)
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
      type: TaskType.GENERATE_ANOMALIES_REPORT,
      publicId: expect.any(String)
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
      supervisorId: null,
      publicId: expect.any(String)
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

    const id = uuidv4();
    const createdTask: MaintenanceDeviceTask = {
      ...createTaskDTO,
      id: id,
      startDate: new Date(createTaskDTO.startDate),
      endDate: new Date(createTaskDTO.endDate!),
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: expect.any(String)
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

    const id = uuidv4();
    const createdTask: MonitorizeConsumptionTask = {
      ...createTaskDTO,
      id: id,
      startDate: new Date(createTaskDTO.startDate),
      endDate: new Date(createTaskDTO.endDate!),
      threshold: createTaskDTO.threshold!,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: expect.any(String)
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

      const generateAnomaliesReportTaskRepository = {
        update: jest.fn().mockResolvedValueOnce(updatedTask),
      };

      container.clearInstances();
      container.registerInstance("GenerateAnomaliesReportTaskRepository", generateAnomaliesReportTaskRepository);
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

      const generateConsumptionReportTaskRepository = {
        update: jest.fn().mockResolvedValueOnce(updatedTask),
      };

      container.clearInstances();
      container.registerInstance("GenerateConsumptionReportTaskRepository", generateConsumptionReportTaskRepository);
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
      expect(generateConsumptionReportTaskRepository.update).toHaveBeenCalledWith(updatedTaskDTO);
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
      container.registerInstance("MaintenanceDeviceTaskRepository", maintenanceDeviceTaskRepository);
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
      expect(maintenanceDeviceTaskRepository.update).toHaveBeenCalledWith(updatedTaskDTO);
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
      expect(monitorizeConsumptionTaskRepository.update).toHaveBeenCalledWith(updatedTaskDTO);
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

      const generateAnomaliesReportTaskRepository = {
        update: jest.fn().mockRejectedValueOnce(error),
      };

      container.clearInstances();
      container.registerInstance("GenerateAnomaliesReportTaskRepository", generateAnomaliesReportTaskRepository);
      const baseTaskService = container.resolve(BaseTaskService);

      await expect(baseTaskService.update(updateTaskDTO)).rejects.toThrow(error);
    });
  });


});
