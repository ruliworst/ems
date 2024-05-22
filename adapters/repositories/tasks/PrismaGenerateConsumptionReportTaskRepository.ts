import { GenerateConsumptionReportTaskRepository } from "@/ports/tasks/GenerateConsumptionReportTaskRepository";
import { GenerateConsumptionReportTask, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

@injectable()
export default class PrismaGenerateConsumptionReportTaskRepository implements GenerateConsumptionReportTaskRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll(): Promise<GenerateConsumptionReportTask[]> {
    try {
      await this.connect();
      return this.prisma.generateConsumptionReportTask.findMany();
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