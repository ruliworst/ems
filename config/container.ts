import "reflect-metadata";
import { container } from "tsyringe";
import { DeviceRepository } from "../ports/devices/DeviceRepository";
import PrismaDeviceRepository from "@/adapters/repositories/devices/PrismaDeviceRepository";
import DeviceService from "@/application/services/DeviceService";

// Register repositories.
container.registerSingleton<DeviceRepository>("DeviceRepository", PrismaDeviceRepository);

// Register services.
container.registerSingleton(DeviceService);
