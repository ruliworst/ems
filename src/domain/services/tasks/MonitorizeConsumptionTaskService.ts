import { injectable, inject } from "tsyringe";
import "@/config/container";
import { MonitorizeConsumptionTask } from "@prisma/client";
import { CreateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { MonitorizeConsumptionTaskEntity } from "@/src/infrastructure/entities/tasks/MonitorizeConsumptionTaskEntity";
import type { MonitorizeConsumptionTaskRepository } from "../../persistence/tasks/MonitorizeConsumptionTaskRepository";

@injectable()
class MonitorizeConsumptionTaskService {
  constructor(
    @inject("MonitorizeConsumptionTaskRepository") private tasksRepository: MonitorizeConsumptionTaskRepository
  ) { }

  async getAll(): Promise<MonitorizeConsumptionTaskEntity[]> {
    const tasks: MonitorizeConsumptionTask[] = await this.tasksRepository.getAll();

    return tasks.map<MonitorizeConsumptionTaskEntity>(task => new MonitorizeConsumptionTaskEntity({
      id: task.id,
      startDate: task.startDate,
      endDate: task.endDate,
      threshold: task.threshold,
      frequency: task.frequency,
      deviceId: task.deviceId,
      operatorId: task.operatorId || null,
      supervisorId: task.supervisorId || null
    }));
  };

  async create(createTaskDTO: CreateTaskDTO): Promise<MonitorizeConsumptionTaskEntity> {
    try {
      const task: MonitorizeConsumptionTask = await this.tasksRepository.create(createTaskDTO);
      return new MonitorizeConsumptionTaskEntity(task);
    } catch (error) {
      console.error("Error creating a task:", error);
      throw error;
    }
  };
}

export default MonitorizeConsumptionTaskService;
