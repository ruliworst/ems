import { inject, injectable } from "tsyringe";
import "@/config/container";
import { MonitorizeConsumptionTaskRepository } from "@/src/domain/persistence/tasks/MonitorizeConsumptionTaskRepository";
import { CreateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { MonitorizeConsumptionTask } from "@prisma/client";
import PrismaTaskRepository from "./PrismaTaskRepository";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";

@injectable()
export default class PrismaMonitorizeConsumptionTaskRepository extends PrismaTaskRepository<MonitorizeConsumptionTask> implements MonitorizeConsumptionTaskRepository {
  constructor(
    @inject("DeviceRepository") deviceRepository: DeviceRepository
  ) {
    super(deviceRepository);
  }

  async getTaskByPublicId(publicId: string): Promise<MonitorizeConsumptionTask | null> {
    try {
      await this.connect();
      const task = await this.prisma.monitorizeConsumptionTask.findUnique({
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

  async create(createTaskDTO: CreateTaskDTO): Promise<MonitorizeConsumptionTask> {
    if (createTaskDTO.threshold === undefined || createTaskDTO.threshold === null) {
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

      const { operator, supervisor } = await this.getOperatorAndSupervisor(operatorEmail!);
      const device = await this.getDevice(deviceName);

      return await this.prisma.monitorizeConsumptionTask.create({
        data: {
          startDate,
          endDate,
          threshold: threshold!,
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

  async getAll(): Promise<MonitorizeConsumptionTask[]> {
    try {
      await this.connect();
      return this.prisma.monitorizeConsumptionTask.findMany();
    } finally {
      this.disconnect();
    }
  }
}
