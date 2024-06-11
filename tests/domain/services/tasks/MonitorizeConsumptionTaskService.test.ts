import "reflect-metadata";
import { container } from "tsyringe";
import "@/config/container";
import { MonitorizeConsumptionTask, Frequency } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { TaskRepository } from "@/src/domain/persistence/tasks/TaskRepository";
import { EnergyConsumptionRecordService } from "@/src/domain/services/energy-consumption-records/EnergyConsumptionRecordService";
import MonitorizeConsumptionTaskService from "@/src/domain/services/tasks/MonitorizeConsumptionTaskService";
import { CreateTaskDTO, TaskType } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { MonitorizeConsumptionTaskEntity } from "@/src/infrastructure/entities/tasks/MonitorizeConsumptionTaskEntity";
import Agenda, { Job } from "agenda";
import { EnergyConsumptionRecordEntity } from "@/src/infrastructure/entities/energy-consumption-records/EnergyConsumptionRecordEntity";

describe("MonitorizeConsumptionTaskService", () => {
  let service: MonitorizeConsumptionTaskService;
  let taskRepositoryMock: DeepMockProxy<TaskRepository<MonitorizeConsumptionTask>>;
  let agendaMock: DeepMockProxy<Agenda>;
  let recordServiceMock: DeepMockProxy<EnergyConsumptionRecordService>;

  beforeEach(() => {
    taskRepositoryMock = mockDeep<TaskRepository<MonitorizeConsumptionTask>>();
    agendaMock = mockDeep<Agenda>();
    recordServiceMock = mockDeep<EnergyConsumptionRecordService>();

    container.registerInstance("MonitorizeConsumptionTaskRepository", taskRepositoryMock);
    container.registerInstance("Agenda", agendaMock);
    container.registerInstance(EnergyConsumptionRecordService, recordServiceMock);

    service = container.resolve(MonitorizeConsumptionTaskService);
  });

  afterEach(() => {
    container.clearInstances();
  });

  describe("mapToEntity", () => {
    it("should correctly map a MonitorizeConsumptionTask to a MonitorizeConsumptionTaskEntity", () => {
      const task: MonitorizeConsumptionTask = {
        id: "1",
        startDate: new Date(),
        endDate: new Date(),
        frequency: Frequency.DAILY,
        deviceId: "device1",
        operatorId: "operator1",
        supervisorId: "supervisor1",
        publicId: "public1",
        threshold: 50,
      };
      const entity = service.mapToEntity(task);
      expect(entity).toBeInstanceOf(MonitorizeConsumptionTaskEntity);
      expect(entity).toMatchObject(task);
    });
  });

  describe("checkAttributes", () => {
    it("should not throw an error if threshold is present", () => {
      const createTaskDTO: CreateTaskDTO = {
        startDate: "2023-06-12T12:00:00Z",
        endDate: "2023-06-15T12:00:00Z",
        frequency: Frequency.DAILY,
        startReportDate: new Date().toISOString(),
        endReportDate: new Date().toISOString(),
        title: "Example Task",
        type: TaskType.MONITORIZE_CONSUMPTION,
        threshold: 50,
        deviceName: "Device 1",
        operatorEmail: "test@example.com",
      };
      expect(() => service.checkAttributes(createTaskDTO)).not.toThrow();
    });

    it("should throw an error if threshold is missing or null", () => {
      const invalidDTOs: CreateTaskDTO[] = [
        {
          startDate: "2023-06-12T12:00:00Z",
          endDate: "2023-06-15T12:00:00Z",
          frequency: Frequency.DAILY,
          startReportDate: new Date().toISOString(),
          endReportDate: new Date().toISOString(),
          title: "Example Task",
          type: TaskType.MONITORIZE_CONSUMPTION,
          deviceName: "Device 1",
          operatorEmail: "test@example.com",
          threshold: null
        },
        {
          startDate: "2023-06-12T12:00:00Z",
          endDate: "2023-06-15T12:00:00Z",
          frequency: Frequency.DAILY,
          startReportDate: new Date().toISOString(),
          endReportDate: new Date().toISOString(),
          title: "Example Task",
          type: TaskType.MONITORIZE_CONSUMPTION,
          threshold: null,
          deviceName: "Device 1",
          operatorEmail: "test@example.com",
        },
      ];

      invalidDTOs.forEach(dto => {
        expect(() => service.checkAttributes(dto)).toThrowError("Some values are not valid.");
      });
    });
  });

  describe("executeAgendaJob", () => {
    it("should execute the task and not remove the job if the end date is in the future", async () => {
      const taskEntity = new MonitorizeConsumptionTaskEntity({
        id: "1",
        startDate: new Date(),
        endDate: new Date("2025-01-01"),
        frequency: Frequency.DAILY,
        deviceId: "device1",
        operatorId: "operator1",
        supervisorId: "supervisor1",
        publicId: "public1",
        threshold: 50,
      });
      const job: Job = {
        attrs: { data: taskEntity },
        remove: jest.fn(),
      } as unknown as Job;

      const mockRecord: EnergyConsumptionRecordEntity = new EnergyConsumptionRecordEntity({
        id: "recordId",
        recordDate: new Date(),
        quantity: 10,
        price: 0.5,
        deviceId: taskEntity.deviceId,
        consumptionReportId: null,
        anomaliesReportId: null
      });
      recordServiceMock.create.mockResolvedValueOnce(mockRecord);

      await service.executeAgendaJob(job);

      expect(recordServiceMock.create).toHaveBeenCalled();
      expect(job.remove).not.toHaveBeenCalled();
    });

    it("should remove the job if the end date has passed", async () => {
      const taskEntity = new MonitorizeConsumptionTaskEntity({
        id: "1",
        startDate: new Date(),
        endDate: new Date("2023-01-01"),
        frequency: Frequency.DAILY,
        deviceId: "device1",
        operatorId: "operator1",
        supervisorId: "supervisor1",
        publicId: "public1",
        threshold: 50,
      });
      const job: Job = {
        attrs: { data: taskEntity },
        remove: jest.fn(),
      } as unknown as Job;

      const mockRecord: EnergyConsumptionRecordEntity = new EnergyConsumptionRecordEntity({
        id: "recordId",
        recordDate: new Date(),
        quantity: 10,
        price: 0.5,
        deviceId: taskEntity.deviceId,
        consumptionReportId: null,
        anomaliesReportId: null
      });
      recordServiceMock.create.mockResolvedValueOnce(mockRecord);

      await service.executeAgendaJob(job);

      expect(job.remove).toHaveBeenCalled();
    });
  });

  describe("execute", () => {
    it("should create an energy consumption record", async () => {
      const taskEntity = new MonitorizeConsumptionTaskEntity({
        id: "1",
        startDate: new Date(),
        endDate: new Date(),
        frequency: Frequency.DAILY,
        deviceId: "device1",
        operatorId: "operator1",
        supervisorId: "supervisor1",
        publicId: "public1",
        threshold: 50,
      });

      const mockRecord: EnergyConsumptionRecordEntity = new EnergyConsumptionRecordEntity({
        id: "recordId",
        recordDate: new Date(),
        quantity: 10,
        price: 0.5,
        deviceId: taskEntity.deviceId,
        consumptionReportId: null,
        anomaliesReportId: null
      });
      recordServiceMock.create.mockResolvedValueOnce(mockRecord);

      await service.execute(taskEntity);

      expect(recordServiceMock.create).toHaveBeenCalled();
    });
  });
});
