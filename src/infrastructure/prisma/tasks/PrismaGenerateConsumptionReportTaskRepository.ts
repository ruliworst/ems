import { inject, injectable } from "tsyringe";
import "@/config/container";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";
import { GenerateConsumptionReportTaskRepository } from "@/src/domain/persistence/tasks/GenerateConsumptionReportTaskRepository";
import { CreateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { GenerateConsumptionReportTask, Operator, PrismaClient, Supervisor } from "@prisma/client";

@injectable()
export default class PrismaGenerateConsumptionReportTaskRepository implements GenerateConsumptionReportTaskRepository {
  private prisma: PrismaClient;

  constructor(
    @inject("DeviceRepository") private deviceRepository: DeviceRepository
  ) {
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
      deviceName,
      operatorEmail,
    } = createTaskDTO;

    try {
      await this.connect();

      const operator: Operator | null = await this.prisma.operator.findUnique({ where: { email: operatorEmail! } });
      const supervisor: Supervisor | null = await this.prisma.supervisor.findUnique({ where: { email: operatorEmail! } });
      if (!operator && !supervisor) {
        throw new Error(`Due to the operator or supervisor with email: ${operatorEmail} was not found, the task can not be created.`);
      }

      const device = await this.deviceRepository.getByName(deviceName);
      if (!device) {
        throw new Error(`Due to the device with name: ${deviceName} was not found, the task can not be created.`);
      }

      return await this.prisma.generateConsumptionReportTask.create({
        data: {
          startDate,
          endDate,
          startReportDate: startReportDate!,
          endReportDate: endReportDate!,
          title: title!,
          frequency,
          deviceId: device.id,
          operatorId: operator ? operator.id : null,
          supervisorId: supervisor ? supervisor.id : null,
        }
      });
    } finally {
      this.disconnect();
    }
  }

  async getTaskByPublicId(publicId: string): Promise<GenerateConsumptionReportTask | null> {
    try {
      await this.connect();
      const task = await this.prisma.generateConsumptionReportTask.findUnique({
        where: {
          publicId,
        },
      });
      return task;
    } catch (error) {
      return null;
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