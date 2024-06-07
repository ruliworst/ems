import { inject, injectable } from "tsyringe";
import "@/config/container";
import { MonitorizeConsumptionTask, PrismaClient } from "@prisma/client";
import PrismaTaskRepository from "./PrismaTaskRepository";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";

@injectable()
export default class PrismaMonitorizeConsumptionTaskRepository extends PrismaTaskRepository<MonitorizeConsumptionTask> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
    @inject("DeviceRepository") deviceRepository: DeviceRepository
  ) {
    super(prismaClient, deviceRepository, prismaClient.monitorizeConsumptionTask);
  }
}
