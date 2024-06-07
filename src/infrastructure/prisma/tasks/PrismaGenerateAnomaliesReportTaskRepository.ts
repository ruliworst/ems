import { inject, injectable } from "tsyringe";
import "@/config/container";
import { GenerateAnomaliesReportTask, PrismaClient } from "@prisma/client";
import PrismaTaskRepository from "./PrismaTaskRepository";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";

@injectable()
export default class PrismaGenerateAnomaliesReportTaskRepository extends PrismaTaskRepository<GenerateAnomaliesReportTask> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
    @inject("DeviceRepository") deviceRepository: DeviceRepository
  ) {
    super(prismaClient, deviceRepository, prismaClient.generateAnomaliesReportTask);
  }
}
