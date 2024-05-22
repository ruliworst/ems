import { injectable, inject } from "tsyringe";
import type { MonitorizeConsumptionTaskRepository } from "@/ports/tasks/MonitorizeConsumptionTaskRepository";
import { MonitorizeConsumptionTaskDTO } from "@/dtos/tasks/task.dto";

@injectable()
class MonitorizeConsumptionTaskService {
  constructor(
    @inject("MonitorizeConsumptionTaskRepository") private tasksRepository: MonitorizeConsumptionTaskRepository
  ) { }

  async getAll(): Promise<MonitorizeConsumptionTaskDTO[]> {
    const tasks = await this.tasksRepository.getAll();

    return tasks.map<MonitorizeConsumptionTaskDTO>(task => ({
      startDate: task.startDate.toDateString(),
      endDate: task.endDate?.toDateString(),
      threshold: task.threshold,
      frequency: task.frequency,
      deviceId: task.deviceId!,
      operatorId: task.operatorId || task.supervisorId || ""
    }));
  }
}

export default MonitorizeConsumptionTaskService;
