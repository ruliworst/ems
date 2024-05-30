import { MonitorizeConsumptionTaskRepository } from "@/src/domain/persistence/tasks/MonitorizeConsumptionTaskRepository";
import { CreateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { PrismaClient, MonitorizeConsumptionTask } from "@prisma/client";
import { injectable } from "tsyringe";

@injectable()
export default class PrismaMonitorizeConsumptionTaskRepository implements MonitorizeConsumptionTaskRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createTaskDTO: CreateTaskDTO): Promise<MonitorizeConsumptionTask> {
    if (createTaskDTO.threshold === undefined || null) {
      throw new Error("Some values are not valid.");
    }

    const {
      startDate,
      endDate,
      threshold,
      frequency,
      deviceName,
      operatorEmail,
    } = createTaskDTO;

    try {
      await this.connect();
      return await this.prisma.monitorizeConsumptionTask.create({
        data: {
          startDate,
          endDate,
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