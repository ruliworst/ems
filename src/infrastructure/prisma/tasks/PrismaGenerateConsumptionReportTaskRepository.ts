import { inject, injectable } from "tsyringe";
import "@/config/container";
import { GenerateConsumptionReportTaskRepository } from "@/src/domain/persistence/tasks/GenerateConsumptionReportTaskRepository";
import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { GenerateConsumptionReportTask } from "@prisma/client";
import PrismaTaskRepository from "./PrismaTaskRepository";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";

@injectable()
export default class PrismaGenerateConsumptionReportTaskRepository extends PrismaTaskRepository<GenerateConsumptionReportTask> implements GenerateConsumptionReportTaskRepository {
  constructor(
    @inject("DeviceRepository") deviceRepository: DeviceRepository
  ) {
    super(deviceRepository);
  }

  async update(updateTaskDTO: UpdateTaskDTO): Promise<GenerateConsumptionReportTask | null> {
    const updatedTask: Partial<GenerateConsumptionReportTask> = {
      startDate: updateTaskDTO.startDate ? new Date(updateTaskDTO.startDate) : undefined,
      endDate: updateTaskDTO.endDate ? new Date(updateTaskDTO.endDate) : undefined,
      frequency: updateTaskDTO.frequency ?? undefined,
      startReportDate: updateTaskDTO.startReportDate ? new Date(updateTaskDTO.startReportDate) : undefined,
      endReportDate: updateTaskDTO.endReportDate ? new Date(updateTaskDTO.endReportDate) : undefined,
      title: updateTaskDTO.title ?? undefined,
    };

    return super.updateTask(updateTaskDTO.publicId, this.prisma.generateConsumptionReportTask, updatedTask);
  }

  async getTaskByPublicId(publicId: string): Promise<GenerateConsumptionReportTask | null> {
    return super.getTaskByPublicId(publicId, this.prisma.generateConsumptionReportTask);
  }

  async getAll(): Promise<GenerateConsumptionReportTask[]> {
    return super.getAll(this.prisma.generateConsumptionReportTask);
  }

  async delete(publicId: string): Promise<GenerateConsumptionReportTask | null> {
    return super.delete(publicId, this.prisma.generateConsumptionReportTask);
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

      const { operator, supervisor } = await this.getOperatorAndSupervisor(operatorEmail!);
      const device = await this.getDevice(deviceName);

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
}
