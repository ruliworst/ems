import { inject, injectable } from "tsyringe";
import "@/config/container";
import { GenerateAnomaliesReportTaskRepository } from "@/src/domain/persistence/tasks/GenerateAnomaliesReportTaskRepository";
import { CreateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
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

  async getTaskByPublicId(publicId: string): Promise<GenerateAnomaliesReportTask | null> {
    try {
      await this.connect();
      const task = await this.prisma.generateAnomaliesReportTask.findUnique({
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

  async getAll(): Promise<GenerateAnomaliesReportTask[]> {
    try {
      await this.connect();
      return this.prisma.generateAnomaliesReportTask.findMany();
    } finally {
      this.disconnect();
    }
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
