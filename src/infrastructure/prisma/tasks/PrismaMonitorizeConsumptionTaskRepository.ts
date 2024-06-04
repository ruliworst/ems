import { inject, injectable } from "tsyringe";
import "@/config/container";
import { MonitorizeConsumptionTaskRepository } from "@/src/domain/persistence/tasks/MonitorizeConsumptionTaskRepository";
import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
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

  async update(updateTaskDTO: UpdateTaskDTO): Promise<MonitorizeConsumptionTask | null> {
    const updatedTask: Partial<MonitorizeConsumptionTask> = {
      startDate: updateTaskDTO.startDate ? new Date(updateTaskDTO.startDate) : undefined,
      endDate: updateTaskDTO.endDate ? new Date(updateTaskDTO.endDate) : undefined,
      frequency: updateTaskDTO.frequency ?? undefined,
      threshold: updateTaskDTO.threshold ?? undefined,
    };

    return super.updateTask(updateTaskDTO.publicId, this.prisma.monitorizeConsumptionTask, updatedTask);
  }

  async getTaskByPublicId(publicId: string): Promise<MonitorizeConsumptionTask | null> {
    return super.getTaskByPublicId(publicId, this.prisma.monitorizeConsumptionTask);
  }

  async getAll(): Promise<MonitorizeConsumptionTask[]> {
    return super.getAll(this.prisma.monitorizeConsumptionTask);
  }

  async delete(publicId: string): Promise<MonitorizeConsumptionTask | null> {
    return super.delete(publicId, this.prisma.monitorizeConsumptionTask);
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
          threshold,
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
