import "reflect-metadata";
import { container } from "tsyringe";
import "@/config/container";
import { MaintenanceDeviceTask, Frequency, Priority } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { TaskRepository } from "@/src/domain/persistence/tasks/TaskRepository";
import { BaseAlertService } from "@/src/domain/services/alerts/BaseAlertService";
import MaintenanceDeviceTaskService from "@/src/domain/services/tasks/MaintenanceDeviceTaskService";
import { AlertType } from "@/src/infrastructure/api/dtos/alerts/alert.dto";
import { CreateTaskDTO, TaskType } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { MaintenanceDeviceTaskEntity } from "@/src/infrastructure/entities/tasks/MaintenanceDeviceTaskEntity";
import Agenda, { Job } from "agenda";

describe("MaintenanceDeviceTaskService", () => {
  let service: MaintenanceDeviceTaskService;
  let taskRepositoryMock: DeepMockProxy<TaskRepository<MaintenanceDeviceTask>>;
  let agendaMock: DeepMockProxy<Agenda>;
  let alertServiceMock: DeepMockProxy<BaseAlertService>;

  beforeEach(() => {
    taskRepositoryMock = mockDeep<TaskRepository<MaintenanceDeviceTask>>();
    agendaMock = mockDeep<Agenda>();
    alertServiceMock = mockDeep<BaseAlertService>();

    container.registerInstance("MaintenanceDeviceTaskRepository", taskRepositoryMock);
    container.registerInstance("Agenda", agendaMock);
    container.registerInstance(BaseAlertService, alertServiceMock);

    service = container.resolve(MaintenanceDeviceTaskService);
  });

  afterEach(() => {
    container.clearInstances();
  });

  describe("mapToEntity", () => {
    it("should correctly map a MaintenanceDeviceTask to a MaintenanceDeviceTaskEntity", () => {
      const task: MaintenanceDeviceTask = {
        id: "1",
        startDate: new Date(),
        endDate: new Date(),
        frequency: Frequency.DAILY,
        deviceId: "device1",
        operatorId: "operator1",
        supervisorId: "supervisor1",
        publicId: "public1",
      };
      const entity = service.mapToEntity(task);
      expect(entity).toBeInstanceOf(MaintenanceDeviceTaskEntity);
      expect(entity).toMatchObject(task);
    });
  });

  describe("checkAttributes", () => {
    it("should not throw an error if all required attributes are present", () => {
      const createTaskDTO: CreateTaskDTO = {
        startDate: "2023-06-12T12:00:00Z",
        endDate: "2023-06-15T12:00:00Z",
        frequency: Frequency.DAILY,
        startReportDate: new Date().toISOString(),
        endReportDate: new Date().toISOString(),
        title: "Example Task",
        type: TaskType.MAINTENANCE_DEVICE,
        threshold: null,
        deviceName: "Device 1",
        operatorEmail: "test@example.com",
      };
      expect(() => service.checkAttributes(createTaskDTO)).not.toThrow();
    });
  });

  describe("executeAgendaJob", () => {
    it("should execute the task and not remove the job if the end date is in the future", async () => {
      const taskEntity = new MaintenanceDeviceTaskEntity({
        id: "1",
        startDate: new Date(),
        endDate: new Date("2025-01-01"),
        frequency: Frequency.DAILY,
        deviceId: "device1",
        operatorId: "operator1",
        supervisorId: "supervisor1",
        publicId: "public1",
      });
      const job: Job = {
        attrs: { data: taskEntity },
        remove: jest.fn(),
      } as unknown as Job;

      // Aquí es donde se arregla el mock:
      alertServiceMock.create.mockResolvedValueOnce(undefined);

      await service.executeAgendaJob(job);

      expect(alertServiceMock.create).toHaveBeenCalled();
      expect(job.remove).not.toHaveBeenCalled();
    });

    it("should remove the job if the end date has passed", async () => {
      const taskEntity = new MaintenanceDeviceTaskEntity({
        id: "1",
        startDate: new Date(),
        endDate: new Date("2023-01-01"),
        frequency: Frequency.DAILY,
        deviceId: "device1",
        operatorId: "operator1",
        supervisorId: "supervisor1",
        publicId: "public1",
      });
      const job: Job = {
        attrs: { data: taskEntity },
        remove: jest.fn(),
      } as unknown as Job;

      // Aquí es donde se arregla el mock:
      alertServiceMock.create.mockResolvedValueOnce(undefined);

      await service.executeAgendaJob(job);

      expect(job.remove).toHaveBeenCalled();
    });
  });

  describe("execute", () => {
    it("should create an alert with the correct data", async () => {
      const taskEntity = new MaintenanceDeviceTaskEntity({
        id: "task-id",
        startDate: new Date("2024-05-01T10:00:00.000Z"),
        endDate: new Date("2024-05-10T10:00:00.000Z"),
        frequency: Frequency.DAILY,
        deviceId: "device-id",
        operatorId: "operator-id",
        supervisorId: null,  // Simulamos que supervisorId es null
        publicId: "public-id",
      });

      alertServiceMock.create.mockResolvedValueOnce(undefined);

      await service.execute(taskEntity);

      expect(alertServiceMock.create).toHaveBeenCalledWith({
        message: "Maintenance is required.",
        priority: Priority.HIGH,
        type: AlertType.MAINTENANCE,
        operatorId: taskEntity.operatorId,
        supervisorId: undefined,
        deviceId: taskEntity.deviceId,
      });
    });
  });
});
