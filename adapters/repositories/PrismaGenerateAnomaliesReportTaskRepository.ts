import { GenerateAnomaliesReportTaskRepository } from "@/ports/tasks/GenerateAnomaliesReportTaskRepository";
import { PrismaClient, GenerateAnomaliesReportTask } from "@prisma/client";
import { injectable } from "tsyringe";

@injectable()
export default class PrismaGenerateAnomaliesReportTaskRepository implements GenerateAnomaliesReportTaskRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll(): Promise<GenerateAnomaliesReportTask[]> {
    try {
      await this.connect();
      return this.prisma.generateAnomaliesReportTask.findMany();
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