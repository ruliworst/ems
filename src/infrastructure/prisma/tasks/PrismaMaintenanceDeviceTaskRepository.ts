import { inject, injectable } from "tsyringe";
import "@/config/container";
import { MaintenanceDeviceTaskRepository } from "@/src/domain/persistence/tasks/MaintenanceDeviceTaskRepository";
import { CreateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { MaintenanceDeviceTask } from "@prisma/client";
import PrismaTaskRepository from "./PrismaTaskRepository";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";

@injectable()
export default class PrismaMaintenanceDeviceTaskRepository extends PrismaTaskRepository<MaintenanceDeviceTask> implements MaintenanceDeviceTaskRepository {
  constructor(
    @inject("DeviceRepository") deviceRepository: DeviceRepository
  ) {
    super(deviceRepository);
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

      const { operator, supervisor } = await this.getOperatorAndSupervisor(operatorEmail!);
      const device = await this.getDevice(deviceName);

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
}
