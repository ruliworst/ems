import { injectable, inject } from "tsyringe";
import "@/config/container";
import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { GenerateAnomaliesReportTask } from "@prisma/client";
import { GenerateAnomaliesReportTaskEntity } from "@/src/infrastructure/entities/tasks/GenerateAnomaliesReportTaskEntity";
import type { GenerateAnomaliesReportTaskRepository } from "../../persistence/tasks/GenerateAnomaliesReportTaskRepository";

@injectable()
class GenerateAnomaliesReportTaskService {
  constructor(
    @inject("GenerateAnomaliesReportTaskRepository") private tasksRepository: GenerateAnomaliesReportTaskRepository
  ) { }

  async getAll(): Promise<GenerateAnomaliesReportTaskEntity[]> {
    const tasks: GenerateAnomaliesReportTask[] = await this.tasksRepository.getAll();
    return tasks.map<GenerateAnomaliesReportTaskEntity>(task => new GenerateAnomaliesReportTaskEntity(task));
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

  async update(updateTaskDTO: UpdateTaskDTO): Promise<GenerateAnomaliesReportTaskEntity> {
    const task: GenerateAnomaliesReportTask | null = await this.tasksRepository.update(updateTaskDTO);
    if (!task) throw new Error("The task could not be updated.");
    return new GenerateAnomaliesReportTaskEntity(task);
  };

  async getTaskByPublicId(publicId: string): Promise<GenerateAnomaliesReportTaskEntity | null> {
    const task = await this.tasksRepository.getTaskByPublicId(publicId);
    if (!task) return null;
    return new GenerateAnomaliesReportTaskEntity(task);
  }
}

export default GenerateAnomaliesReportTaskService;
