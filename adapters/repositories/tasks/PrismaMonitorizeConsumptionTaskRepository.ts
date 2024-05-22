import { MonitorizeConsumptionTaskRepository } from "@/ports/tasks/MonitorizeConsumptionTaskRepository";
import { PrismaClient, MonitorizeConsumptionTask } from "@prisma/client";
import { injectable } from "tsyringe";

@injectable()
export default class PrismaMonitorizeConsumptionTaskRepository implements MonitorizeConsumptionTaskRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll(): Promise<MonitorizeConsumptionTask[]> {
    try {
      await this.connect();
      return this.prisma.monitorizeConsumptionTask.findMany();
    } finally {
      this.disconnect();
    }
  }

  async connect(): Promise<void> {
    await this.prisma.$connect();
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}