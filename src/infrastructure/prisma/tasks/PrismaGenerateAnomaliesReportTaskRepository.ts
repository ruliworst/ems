import { inject, injectable } from "tsyringe";
import "@/config/container";
import { GenerateAnomaliesReportTaskRepository } from "@/src/domain/persistence/tasks/GenerateAnomaliesReportTaskRepository";
import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { GenerateAnomaliesReportTask } from "@prisma/client";
import PrismaTaskRepository from "./PrismaTaskRepository";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";

@injectable()
export default class PrismaGenerateAnomaliesReportTaskRepository extends PrismaTaskRepository<GenerateAnomaliesReportTask> implements GenerateAnomaliesReportTaskRepository {
  constructor(
    @inject("DeviceRepository") deviceRepository: DeviceRepository
  ) {
    super(deviceRepository);
  }

  async update(updateTaskDTO: UpdateTaskDTO): Promise<GenerateAnomaliesReportTask | null> {
    const updatedTask: Partial<GenerateAnomaliesReportTask> = {
      startDate: updateTaskDTO.startDate ? new Date(updateTaskDTO.startDate) : undefined,
      endDate: updateTaskDTO.endDate ? new Date(updateTaskDTO.endDate) : undefined,
      frequency: updateTaskDTO.frequency ?? undefined,
      startReportDate: updateTaskDTO.startReportDate ? new Date(updateTaskDTO.startReportDate) : undefined,
      endReportDate: updateTaskDTO.endReportDate ? new Date(updateTaskDTO.endReportDate) : undefined,
      title: updateTaskDTO.title ?? undefined,
      threshold: updateTaskDTO.threshold ?? undefined,
    };

    return super.updateTask(updateTaskDTO.publicId, this.prisma.generateAnomaliesReportTask, updatedTask);
  }

  async getTaskByPublicId(publicId: string): Promise<GenerateAnomaliesReportTask | null> {
    return super.getTaskByPublicId(publicId, this.prisma.generateAnomaliesReportTask);
  }

  async getAll(): Promise<GenerateAnomaliesReportTask[]> {
    return super.getAll(this.prisma.generateAnomaliesReportTask);
  }

  async delete(publicId: string): Promise<GenerateAnomaliesReportTask | null> {
    return super.delete(publicId, this.prisma.generateAnomaliesReportTask);
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

      const { operator, supervisor } = await this.getOperatorAndSupervisor(operatorEmail!);
      const device = await this.getDevice(deviceName);

      return await this.prisma.generateAnomaliesReportTask.create({
        data: {
          startDate,
          endDate,
          startReportDate: startReportDate!,
          endReportDate: endReportDate!,
          title: title!,
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
}
