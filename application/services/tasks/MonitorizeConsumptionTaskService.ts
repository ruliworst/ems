import { injectable, inject } from "tsyringe";
import "@/config/container";
import type { MonitorizeConsumptionTaskRepository } from "@/ports/tasks/MonitorizeConsumptionTaskRepository";
import { MonitorizeConsumptionTaskDTO, TaskDTO, TaskType } from "@/dtos/tasks/task.dto";

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
  };

  toTaskDTO(task: MonitorizeConsumptionTaskDTO): TaskDTO {
    return {
      startDate: task.startDate,
      endDate: task.endDate,
      frequency: task.frequency,
      type: TaskType.MONITORIZE_CONSUMPTION
    };
  };
}

export default MonitorizeConsumptionTaskService;
