import { CreateTaskDTO } from "@/dtos/tasks/task.dto";
import { GenerateConsumptionReportTaskRepository } from "@/ports/tasks/GenerateConsumptionReportTaskRepository";
import { $Enums, GenerateConsumptionReportTask, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

@injectable()
export default class PrismaGenerateConsumptionReportTaskRepository implements GenerateConsumptionReportTaskRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createTaskDTO: CreateTaskDTO): Promise<GenerateConsumptionReportTask> {
    if (createTaskDTO.startReportDate === undefined ||
      createTaskDTO.endReportDate === undefined ||
      createTaskDTO.title === undefined) {
      throw new Error("Some values are not valid.");
    }

    const {
      startDate,
      endDate,
      startReportDate,
      endReportDate,
      title,
      frequency,
      deviceId,
      operatorId,
      supervisorId
    } = createTaskDTO;

    try {
      await this.connect();
      return await this.prisma.generateConsumptionReportTask.create({
        data: {
          startDate,
          endDate,
          startReportDate: startReportDate!,
          endReportDate: endReportDate!,
          title: title!,
          frequency,
          deviceId,
          operatorId,
          supervisorId
        }
      });
    } finally {
      this.disconnect();
    }
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