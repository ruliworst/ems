import "reflect-metadata";
import { container } from "tsyringe";
import { DeviceRepository } from "../ports/DeviceRepository";
import PrismaDeviceRepository from "@/adapters/repositories/PrismaDeviceRepository";
import DeviceService from "@/application/services/DeviceService";
import { DeviceApiService } from "@/adapters/services/DeviceApiService";

// Register repositories.
container.registerSingleton<DeviceRepository>("DeviceRepository", PrismaDeviceRepository);

// Register services.
container.registerSingleton(DeviceService);
