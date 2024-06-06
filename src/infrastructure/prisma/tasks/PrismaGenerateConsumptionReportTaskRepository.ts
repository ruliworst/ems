import { inject, injectable } from "tsyringe";
import "@/config/container";
import { GenerateConsumptionReportTask, PrismaClient } from "@prisma/client";
import PrismaTaskRepository from "./PrismaTaskRepository";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";

@injectable()
export default class PrismaGenerateConsumptionReportTaskRepository extends PrismaTaskRepository<GenerateConsumptionReportTask> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
    @inject("DeviceRepository") deviceRepository: DeviceRepository
  ) {
    super(prismaClient, deviceRepository, prismaClient.generateConsumptionReportTask);
  }
}
