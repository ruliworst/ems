import { injectable, inject } from "tsyringe";
import "@/config/container";
import { CreateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
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

    return tasks.map<GenerateConsumptionReportTaskEntity>(task => new GenerateConsumptionReportTaskEntity({
      id: task.id,
      startDate: task.startDate,
      endDate: task.endDate,
      startReportDate: task.startReportDate,
      endReportDate: task.endReportDate,
      title: task.title,
      frequency: task.frequency,
      deviceId: task.deviceId,
      operatorId: task.operatorId || null,
      supervisorId: task.supervisorId || null
    }));
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
}

export default GenerateConsumptionReportTaskService;
