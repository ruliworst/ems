import { injectable, inject } from "tsyringe";
import "@/config/container";
import { CreateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { GenerateAnomaliesReportTask, Prisma } from "@prisma/client";
import { GenerateAnomaliesReportTaskEntity } from "@/src/infrastructure/entities/tasks/GenerateAnomaliesReportTaskEntity";
import type { GenerateAnomaliesReportTaskRepository } from "../../persistence/tasks/GenerateAnomaliesReportTaskRepository";

@injectable()
class GenerateAnomaliesReportTaskService {
  constructor(
    @inject("GenerateAnomaliesReportTaskRepository") private tasksRepository: GenerateAnomaliesReportTaskRepository
  ) { }

  // TODO: Include Device and Operator/Supervisor relationships.
  async getAll(): Promise<GenerateAnomaliesReportTaskEntity[]> {
    const tasks: GenerateAnomaliesReportTask[] = await this.tasksRepository.getAll();

    return tasks.map<GenerateAnomaliesReportTaskEntity>(task => new GenerateAnomaliesReportTaskEntity({
      id: task.id,
      startDate: task.startDate,
      endDate: task.endDate,
      startReportDate: task.startReportDate,
      endReportDate: task.endReportDate,
      title: task.title,
      threshold: task.threshold,
      frequency: task.frequency,
      deviceId: task.deviceId,
      operatorId: task.operatorId || null,
      supervisorId: task.supervisorId || null
    }));
  };

  async create(createTaskDTO: CreateTaskDTO): Promise<GenerateAnomaliesReportTaskEntity> {
    try {
      const task: GenerateAnomaliesReportTask = await this.tasksRepository.create(createTaskDTO);
      return new GenerateAnomaliesReportTaskEntity(task);
    } catch (error) {
      console.error("Error creating a task:", error);
      throw error;
    }
  };
}

export default GenerateAnomaliesReportTaskService;
