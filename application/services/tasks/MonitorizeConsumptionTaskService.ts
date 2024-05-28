import { injectable, inject } from "tsyringe";
import "@/config/container";
import type { MonitorizeConsumptionTaskRepository } from "@/ports/tasks/MonitorizeConsumptionTaskRepository";
import { MonitorizeConsumptionTask } from "@prisma/client";
import { MonitorizeConsumptionTaskEntity } from "@/domain/model/MonitorizeConsumptionTask";
import { CreateTaskDTO } from "@/dtos/tasks/task.dto";

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
