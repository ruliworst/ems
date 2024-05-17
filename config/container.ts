import "reflect-metadata";
import { container } from "tsyringe";
import { DeviceRepository } from "../ports/DeviceRepository";
import PrismaDeviceRepository from "@/infrastructure/repositories/PrismaDeviceRepository";
import DeviceService from "@/application/services/DeviceService";

// Register repositories.
container.registerSingleton<DeviceRepository>("DeviceRepository", PrismaDeviceRepository);

// Register services.
container.registerSingleton(DeviceService);