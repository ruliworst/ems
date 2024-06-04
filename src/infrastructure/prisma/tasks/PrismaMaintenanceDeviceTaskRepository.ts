import { inject, injectable } from "tsyringe";
import "@/config/container";
import { MaintenanceDeviceTaskRepository } from "@/src/domain/persistence/tasks/MaintenanceDeviceTaskRepository";
import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
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

  update(updateTaskDTO: UpdateTaskDTO): Promise<MaintenanceDeviceTask | null> {
    throw new Error("Method not implemented.");
  }

  async getTaskByPublicId(publicId: string): Promise<MaintenanceDeviceTask | null> {
    return super.getTaskByPublicId(publicId, this.prisma.maintenanceDeviceTask);
  }

  async getAll(): Promise<MaintenanceDeviceTask[]> {
    return super.getAll(this.prisma.maintenanceDeviceTask);
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
}
