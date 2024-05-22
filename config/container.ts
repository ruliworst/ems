import "reflect-metadata";
import { container } from "tsyringe";
import { DeviceRepository } from "../ports/devices/DeviceRepository";
import PrismaDeviceRepository from "@/adapters/repositories/devices/PrismaDeviceRepository";
import DeviceService from "@/application/services/devices/DeviceService";
import { GenerateAnomaliesReportTaskRepository } from "@/ports/tasks/GenerateAnomaliesReportTaskRepository";
import PrismaGenerateAnomaliesReportTaskRepository from "@/adapters/repositories/tasks/PrismaGenerateAnomaliesReportTaskRepository";
import PrismaGenerateConsumptionReportTaskRepository from "@/adapters/repositories/tasks/PrismaGenerateConsumptionReportTaskRepository";
import PrismaMonitorizeConsumptionTaskRepository from "@/adapters/repositories/tasks/PrismaMonitorizeConsumptionTaskRepository";
import PrismaMaintenanceDeviceTaskRepository from "@/adapters/repositories/tasks/PrismaMaintenanceDeviceTaskRepository";
import GenerateAnomaliesReportTaskService from "@/application/services/tasks/GenerateAnomaliesReportTaskService";
import GenerateConsumptionReportTaskService from "@/application/services/tasks/GenerateConsumptionReportTaskService";
import MaintenanceDeviceTaskService from "@/application/services/tasks/MaintenanceDeviceTaskService";
import MonitorizeConsumptionTaskService from "@/application/services/tasks/MonitorizeConsumptionTaskService";

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