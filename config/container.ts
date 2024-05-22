import "reflect-metadata";
import { container } from "tsyringe";
import { DeviceRepository } from "../ports/devices/DeviceRepository";
import PrismaDeviceRepository from "@/adapters/repositories/devices/PrismaDeviceRepository";
import DeviceService from "@/application/services/devices/DeviceService";
import { GenerateAnomaliesReportTaskRepository } from "@/ports/tasks/GenerateAnomaliesReportTaskRepository";
import PrismaGenerateAnomaliesReportTaskRepository from "@/adapters/repositories/tasks/PrismaGenerateAnomaliesReportTaskRepository";

// Register repositories.
container.registerSingleton<DeviceRepository>("DeviceRepository", PrismaDeviceRepository);
container.registerSingleton<GenerateAnomaliesReportTaskRepository>(
  "GenerateAnomaliesReportTaskRepository", PrismaGenerateAnomaliesReportTaskRepository);

// Register services.
container.registerSingleton(DeviceService);
