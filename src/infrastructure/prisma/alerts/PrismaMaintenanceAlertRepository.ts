import "@/config/container";
import { MaintenanceAlert, PrismaClient } from "@prisma/client";
import PrismaAlertRepository from "./PrismaAlertRepository";
import { inject, injectable } from "tsyringe";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";

@injectable()
export default class PrismaMaintenanceAlertRepository extends PrismaAlertRepository<MaintenanceAlert> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
    @inject("DeviceRepository") protected deviceRepository: DeviceRepository,
  ) {
    super(prismaClient, deviceRepository, prismaClient.maintenanceAlert);
  }
}