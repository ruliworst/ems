import { MaintenanceDeviceTaskRepository } from "@/src/domain/persistence/tasks/MaintenanceDeviceTaskRepository";
import { CreateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { PrismaClient, MaintenanceDeviceTask } from "@prisma/client";
import { injectable } from "tsyringe";

@injectable()
export default class PrismaMaintenanceDeviceTaskRepository implements MaintenanceDeviceTaskRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createTaskDTO: CreateTaskDTO): Promise<MaintenanceDeviceTask> {
    const {
      startDate,
      endDate,
      frequency,
      deviceName,
      operatorEmail,
    } = createTaskDTO;

    try {
      await this.connect();

      // TODO: Include device and operator references.
      return await this.prisma.maintenanceDeviceTask.create({
        data: {
          startDate,
          endDate,
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

  async getAll(): Promise<MaintenanceDeviceTask[]> {
    try {
      await this.connect();
      return this.prisma.maintenanceDeviceTask.findMany();
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