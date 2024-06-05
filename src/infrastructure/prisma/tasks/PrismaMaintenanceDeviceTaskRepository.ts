import "@/config/container";
import { inject, injectable } from "tsyringe";
import { MaintenanceDeviceTask, PrismaClient } from "@prisma/client";
import PrismaTaskRepository from "./PrismaTaskRepository";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";

@injectable()
export default class PrismaMaintenanceDeviceTaskRepository extends PrismaTaskRepository<MaintenanceDeviceTask> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
    @inject("DeviceRepository") deviceRepository: DeviceRepository
  ) {
    super(prismaClient, deviceRepository, prismaClient.maintenanceDeviceTask);
  }
}
