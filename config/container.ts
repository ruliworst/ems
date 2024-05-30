import "reflect-metadata";
import { container } from "tsyringe";
import { DeviceRepository } from "../src/domain/persistence/devices/DeviceRepository";
import DeviceService from "@/src/domain/services/devices/DeviceService";
import PrismaMonitorizeConsumptionTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaMonitorizeConsumptionTaskRepository";
import PrismaMaintenanceDeviceTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaMaintenanceDeviceTaskRepository";
import GenerateAnomaliesReportTaskService from "@/src/domain/services/tasks/GenerateAnomaliesReportTaskService";
import GenerateConsumptionReportTaskService from "@/src/domain/services/tasks/GenerateConsumptionReportTaskService";
import MaintenanceDeviceTaskService from "@/src/domain/services/tasks/MaintenanceDeviceTaskService";
import MonitorizeConsumptionTaskService from "@/src/domain/services/tasks/MonitorizeConsumptionTaskService";
import BaseTaskService from "@/src/domain/services/tasks/BaseTaskService";
import { GenerateAnomaliesReportTaskRepository } from "@/src/domain/persistence/tasks/GenerateAnomaliesReportTaskRepository";
import PrismaDeviceRepository from "@/src/infrastructure/prisma/devices/PrismaDeviceRepository";
import PrismaGenerateAnomaliesReportTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaGenerateAnomaliesReportTaskRepository";
import PrismaGenerateConsumptionReportTaskRepository from "@/src/infrastructure/prisma/tasks/PrismaGenerateConsumptionReportTaskRepository";

// Register repositories.
container.registerSingleton<DeviceRepository>("DeviceRepository", PrismaDeviceRepository);
container.registerSingleton<GenerateAnomaliesReportTaskRepository>(
  "GenerateAnomaliesReportTaskRepository", PrismaGenerateAnomaliesReportTaskRepository);
container.registerSingleton<PrismaGenerateConsumptionReportTaskRepository>(
  "GenerateConsumptionReportTaskRepository", PrismaGenerateConsumptionReportTaskRepository);
container.registerSingleton<PrismaMonitorizeConsumptionTaskRepository>(
  "MonitorizeConsumptionTaskRepository", PrismaMonitorizeConsumptionTaskRepository);
container.registerSingleton<PrismaMaintenanceDeviceTaskRepository>(
  "MaintenanceDeviceTaskRepository", PrismaMaintenanceDeviceTaskRepository);

// Register services.
container.registerSingleton(DeviceService);
container.registerSingleton(GenerateAnomaliesReportTaskService);
container.registerSingleton(GenerateConsumptionReportTaskService);
container.registerSingleton(MaintenanceDeviceTaskService);
container.registerSingleton(MonitorizeConsumptionTaskService);
container.registerSingleton(BaseTaskService);