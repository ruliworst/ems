import "reflect-metadata";
import { container } from "tsyringe";
import { AnomaliesReport, ConsumptionReport, GenerateAnomaliesReportTask, GenerateConsumptionReportTask, MaintenanceAlert, MaintenanceDeviceTask, MonitorizeConsumptionTask, Operator, PrismaClient, Supervisor, UnusualConsumptionAlert } from "@prisma/client";
import { AlertRepository } from "@/src/domain/persistence/alerts/AlertRepository";
import { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";
import { EnergyConsumptionRecordRepository } from "@/src/domain/persistence/energy-consumption-records/EnergyConsumptionRecordRepository";
import { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";
import { ReportRepository } from "@/src/domain/persistence/reports/ReportRepository";
import { TaskRepository } from "@/src/domain/persistence/tasks/TaskRepository";
import { BaseAlertService } from "@/src/domain/services/alerts/BaseAlertService";
import { MaintenanceAlertService } from "@/src/domain/services/alerts/MaintenanceAlertService";
import { UnusualConsumptionAlertService } from "@/src/domain/services/alerts/UnusualConsumptionAlertService";
import DeviceService from "@/src/domain/services/devices/DeviceService";
import { EnergyConsumptionRecordService } from "@/src/domain/services/energy-consumption-records/EnergyConsumptionRecordService";
import { BaseOperatorService } from "@/src/domain/services/operators/BaseOperatorService";
import OperatorService from "@/src/domain/services/operators/OperatorService";
import { AnomaliesReportService } from "@/src/domain/services/reports/AnomaliesReportService";
import { BaseReportService } from "@/src/domain/services/reports/BaseReportService";
import { ConsumptionReportService } from "@/src/domain/services/reports/ConsumptionReportService";
import BaseTaskService from "@/src/domain/services/tasks/BaseTaskService";
import GenerateAnomaliesReportTaskService from "@/src/domain/services/tasks/GenerateAnomaliesReportTaskService";
import GenerateConsumptionReportTaskService from "@/src/domain/services/tasks/GenerateConsumptionReportTaskService";
import MaintenanceDeviceTaskService from "@/src/domain/services/tasks/MaintenanceDeviceTaskService";
import MonitorizeConsumptionTaskService from "@/src/domain/services/tasks/MonitorizeConsumptionTaskService";
import PrismaMaintenanceAlertRepository from "@/src/infrastructure/prisma/alerts/PrismaMaintenanceAlertRepository";
import PrismaUnusualConsumptionAlertRepository from "@/src/infrastructure/prisma/alerts/PrismaUnusualConsumptionAlertRepository";
import PrismaDeviceRepository from "@/src/infrastructure/prisma/devices/PrismaDeviceRepository";
import PrismaEnergyConsumptionRecordRepository from "@/src/infrastructure/prisma/energy-consumption-records/PrismaEnergyConsumptionRecordRepository";
import PrismaOperatorOperatorRepository from "@/src/infrastructure/prisma/operators/PrismaOperatorOperatorRepository";
import PrismaSupervisorOperatorRepository from "@/src/infrastructure/prisma/operators/PrismaSupervisorOperatorRepository";
import PrismaAnomaliesReportRepository from "@/src/infrastructure/prisma/reports/PrismaAnomaliesReportRepository";
import PrismaConsumptionReportRepository from "@/src/infrastructure/prisma/reports/PrismaConsumptionReportRepository";
import PrismaGenerateAnomaliesReportTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaGenerateAnomaliesReportTaskRepository";
import PrismaGenerateConsumptionReportTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaGenerateConsumptionReportTaskRepository";
import PrismaMaintenanceDeviceTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaMaintenanceDeviceTaskRepository";
import PrismaMonitorizeConsumptionTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaMonitorizeConsumptionTaskRepository";


const prisma = new PrismaClient();
container.registerInstance(PrismaClient, prisma);

// Register repositories.
container.registerSingleton<DeviceRepository>(
  "DeviceRepository",
  PrismaDeviceRepository
);
container.registerSingleton<EnergyConsumptionRecordRepository>(
  "EnergyConsumptionRecordRepository",
  PrismaEnergyConsumptionRecordRepository
);
container.registerSingleton<TaskRepository<GenerateAnomaliesReportTask>>(
  "GenerateAnomaliesReportTaskRepository",
  PrismaGenerateAnomaliesReportTaskRepository
);
container.registerSingleton<TaskRepository<GenerateConsumptionReportTask>>(
  "GenerateConsumptionReportTaskRepository",
  PrismaGenerateConsumptionReportTaskRepository
);
container.registerSingleton<TaskRepository<MonitorizeConsumptionTask>>(
  "MonitorizeConsumptionTaskRepository",
  PrismaMonitorizeConsumptionTaskRepository
);
container.registerSingleton<TaskRepository<MaintenanceDeviceTask>>(
  "MaintenanceDeviceTaskRepository",
  PrismaMaintenanceDeviceTaskRepository
);
container.registerSingleton<AlertRepository<MaintenanceAlert>>(
  "MaintenanceAlertRepository",
  PrismaMaintenanceAlertRepository
);
container.registerSingleton<AlertRepository<UnusualConsumptionAlert>>(
  "UnusualConsumptionAlertRepository",
  PrismaUnusualConsumptionAlertRepository
);
container.registerSingleton<ReportRepository<AnomaliesReport>>(
  "AnomaliesReportRepository",
  PrismaAnomaliesReportRepository
);
container.registerSingleton<ReportRepository<ConsumptionReport>>(
  "ConsumptionReportRepository",
  PrismaConsumptionReportRepository
);
container.registerSingleton<OperatorRepository<Operator>>(
  "OperatorRepository",
  PrismaOperatorOperatorRepository
);
container.registerSingleton<OperatorRepository<Supervisor>>(
  "SupervisorRepository",
  PrismaSupervisorOperatorRepository
);

// Register services.
container.registerSingleton(DeviceService);
container.registerSingleton(GenerateAnomaliesReportTaskService);
container.registerSingleton(GenerateConsumptionReportTaskService);
container.registerSingleton(MaintenanceDeviceTaskService);
container.registerSingleton(MonitorizeConsumptionTaskService);
container.registerSingleton(MaintenanceAlertService);
container.registerSingleton(UnusualConsumptionAlertService);
container.registerSingleton(AnomaliesReportService);
container.registerSingleton(ConsumptionReportService);
container.registerSingleton(OperatorService);
container.registerSingleton(EnergyConsumptionRecordService);
container.registerSingleton(BaseTaskService);
container.registerSingleton(BaseAlertService);
container.registerSingleton(BaseReportService);
container.registerSingleton(BaseOperatorService);
