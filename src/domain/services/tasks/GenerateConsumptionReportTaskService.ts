import { injectable, inject } from "tsyringe";
import "@/config/container";
import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { GenerateConsumptionReportTask } from "@prisma/client";
import { GenerateConsumptionReportTaskEntity } from "@/src/infrastructure/entities/tasks/GenerateConsumptionReportTaskEntity";
import type { GenerateConsumptionReportTaskRepository } from "../../persistence/tasks/GenerateConsumptionReportTaskRepository";

@injectable()
class GenerateConsumptionReportTaskService {
  constructor(
    @inject("GenerateConsumptionReportTaskRepository") private tasksRepository: GenerateConsumptionReportTaskRepository
  ) { }

  async getAll(): Promise<GenerateConsumptionReportTaskEntity[]> {
    const tasks: GenerateConsumptionReportTask[] = await this.tasksRepository.getAll();

    return tasks.map<GenerateConsumptionReportTaskEntity>(task => new GenerateConsumptionReportTaskEntity(task));
  };

  async create(createTaskDTO: CreateTaskDTO): Promise<GenerateConsumptionReportTaskEntity> {
    try {
      const task: GenerateConsumptionReportTask = await this.tasksRepository.create(createTaskDTO);
      return new GenerateConsumptionReportTaskEntity(task);
    } catch (error) {
      console.error("Error creating a task:", error);
      throw error;
    }
  };

  async delete(publicId: string): Promise<GenerateConsumptionReportTaskEntity | null> {
    try {
      const task: GenerateConsumptionReportTask | null = await this.tasksRepository.delete(publicId);
      if (!task) {
        throw new Error("The task could not be deleted.");
      }
      return new GenerateConsumptionReportTaskEntity({ ...task });
    } catch (error) {
      console.error("Error deleting a task:", error);
      return null;
    }
  };

  async update(updateTaskDTO: UpdateTaskDTO): Promise<GenerateConsumptionReportTaskEntity> {
    const task: GenerateConsumptionReportTask | null = await this.tasksRepository.update(updateTaskDTO);
    if (!task) throw new Error("The task could not be updated.");
    return new GenerateConsumptionReportTaskEntity(task);
  };

  async getTaskByPublicId(publicId: string): Promise<GenerateConsumptionReportTaskEntity | null> {
    const task = await this.tasksRepository.getTaskByPublicId(publicId);
    if (!task) return null;
    return new GenerateConsumptionReportTaskEntity(task);
  }
}

export default GenerateConsumptionReportTaskService;
