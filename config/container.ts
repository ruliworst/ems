import "reflect-metadata";
import { container } from "tsyringe";
import { DeviceRepository } from "../src/domain/persistence/devices/DeviceRepository";
import DeviceService from "@/src/domain/services/devices/DeviceService";
import OperatorService from "@/src/domain/services/operators/OperatorService";
import PrismaMonitorizeConsumptionTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaMonitorizeConsumptionTaskRepository";
import PrismaMaintenanceDeviceTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaMaintenanceDeviceTaskRepository";
import GenerateAnomaliesReportTaskService from "@/src/domain/services/tasks/GenerateAnomaliesReportTaskService";
import GenerateConsumptionReportTaskService from "@/src/domain/services/tasks/GenerateConsumptionReportTaskService";
import MaintenanceDeviceTaskService from "@/src/domain/services/tasks/MaintenanceDeviceTaskService";
import MonitorizeConsumptionTaskService from "@/src/domain/services/tasks/MonitorizeConsumptionTaskService";
import BaseTaskService from "@/src/domain/services/tasks/BaseTaskService";
import PrismaDeviceRepository from "@/src/infrastructure/prisma/devices/PrismaDeviceRepository";
import PrismaGenerateAnomaliesReportTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaGenerateAnomaliesReportTaskRepository";
import PrismaGenerateConsumptionReportTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaGenerateConsumptionReportTaskRepository";
import PrismaOperatorRepository from "@/src/infrastructure/prisma/operators/PrismaOperatorRepository";
import { MaintenanceAlertService } from "@/src/domain/services/alerts/MaintenanceAlertService";
import { GenerateAnomaliesReportTask, GenerateConsumptionReportTask, MaintenanceAlert, MaintenanceDeviceTask, MonitorizeConsumptionTask, PrismaClient, UnusualConsumptionAlert } from "@prisma/client";
import { UnusualConsumptionAlertService } from "@/src/domain/services/alerts/UnusualConsumptionAlertService";
import { BaseAlertService } from "@/src/domain/services/alerts/BaseAlertService";
import { AlertRepository } from "@/src/domain/persistence/alerts/AlertRepository";
import { TaskRepository } from "@/src/domain/persistence/tasks/TaskRepository";
import PrismaMaintenanceAlertRepository from "@/src/infrastructure/prisma/alerts/PrismaMaintenanceAlertRepository";
import PrismaUnusualConsumptionAlertRepository from "@/src/infrastructure/prisma/alerts/PrismaUnusualConsumptionAlertRepository";

const prisma = new PrismaClient();
container.register<PrismaClient>(PrismaClient, { useValue: prisma });

// Register repositories.
container.registerSingleton<DeviceRepository>("DeviceRepository", PrismaDeviceRepository);

// Tasks.
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

// Operators.
container.registerSingleton<PrismaOperatorRepository>(
  "OperatorRepository", PrismaOperatorRepository);

// Register services.
container.registerSingleton(DeviceService);
container.registerSingleton(GenerateAnomaliesReportTaskService);
container.registerSingleton(GenerateConsumptionReportTaskService);
container.registerSingleton(MaintenanceDeviceTaskService);
container.registerSingleton(MonitorizeConsumptionTaskService);
container.registerSingleton(BaseTaskService);
container.registerSingleton(OperatorService);
container.registerSingleton(MaintenanceAlertService);
container.registerSingleton(UnusualConsumptionAlertService);
container.registerSingleton(BaseAlertService);