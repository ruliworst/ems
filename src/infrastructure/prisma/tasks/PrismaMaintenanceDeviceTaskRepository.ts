import { inject, injectable } from "tsyringe";
import "@/config/container";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";

import { MaintenanceDeviceTaskRepository } from "@/src/domain/persistence/tasks/MaintenanceDeviceTaskRepository";
import { CreateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { PrismaClient, MaintenanceDeviceTask, Operator, Supervisor } from "@prisma/client";

@injectable()
export default class PrismaMaintenanceDeviceTaskRepository implements MaintenanceDeviceTaskRepository {
  private prisma: PrismaClient;

  constructor(
    @inject("DeviceRepository") private deviceRepository: DeviceRepository
  ) {
    this.prisma = new PrismaClient();
  }

  async getTaskByPublicId(publicId: string): Promise<MaintenanceDeviceTask | null> {
    try {
      await this.connect();
      const task = await this.prisma.maintenanceDeviceTask.findUnique({
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

      const operator: Operator | null = await this.prisma.operator.findUnique({ where: { email: operatorEmail! } });
      const supervisor: Supervisor | null = await this.prisma.supervisor.findUnique({ where: { email: operatorEmail! } });
      if (!operator && !supervisor) {
        throw new Error(`Due to the operator or supervisor with email: ${operatorEmail} was not found, the task can not be created.`);
      }

      const device = await this.deviceRepository.getByName(deviceName);
      if (!device) {
        throw new Error(`Due to the device with name: ${deviceName} was not found, the task can not be created.`);
      }

      return await this.prisma.maintenanceDeviceTask.create({
        data: {
          startDate,
          endDate,
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