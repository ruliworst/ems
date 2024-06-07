import "@/config/container";
import { PrismaClient, UnusualConsumptionAlert } from "@prisma/client";
import PrismaAlertRepository from "./PrismaAlertRepository";
import { inject, injectable } from "tsyringe";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";

@injectable()
export default class PrismaUnusualConsumptionAlertRepository extends PrismaAlertRepository<UnusualConsumptionAlert> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
    @inject("DeviceRepository") protected deviceRepository: DeviceRepository,
  ) {
    super(prismaClient, deviceRepository, prismaClient.unusualConsumptionAlert);
  }
}