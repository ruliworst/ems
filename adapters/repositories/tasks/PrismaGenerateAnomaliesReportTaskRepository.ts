import { CreateTaskDTO } from "@/dtos/tasks/task.dto";
import { GenerateAnomaliesReportTaskRepository } from "@/ports/tasks/GenerateAnomaliesReportTaskRepository";
import { PrismaClient, GenerateAnomaliesReportTask, $Enums } from "@prisma/client";
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

  async create(createTaskDTO: CreateTaskDTO): Promise<GenerateAnomaliesReportTask> {
    if (createTaskDTO.startReportDate === undefined ||
      createTaskDTO.endReportDate === undefined ||
      createTaskDTO.title === undefined ||
      createTaskDTO.threshold === undefined) {
      throw new Error("Some values are not valid.");
    }

    const {
      startDate,
      endDate,
      startReportDate,
      endReportDate,
      title,
      threshold,
      frequency,
      deviceName,
      operatorEmail,
    } = createTaskDTO;

    try {
      await this.connect();

      // TODO: Include device and operator references.
      return await this.prisma.generateAnomaliesReportTask.create({
        data: {
          startDate,
          endDate,
          startReportDate: startReportDate!,
          endReportDate: endReportDate!,
          title: title!,
          threshold: threshold!,
          frequency,
          deviceId: "1",
          operatorId: "2",
          supervisorId: null
        }
      });
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