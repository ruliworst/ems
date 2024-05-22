import { injectable, inject } from "tsyringe";
import type { GenerateConsumptionReportTaskRepository } from "@/ports/tasks/GenerateConsumptionReportTaskRepository";
import { GenerateConsumptionReportTaskDTO } from "@/dtos/tasks/task.dto";

@injectable()
class GenerateConsumptionReportTaskService {
  constructor(
    @inject("GenerateConsumptionReportTaskRepository") private tasksRepository: GenerateConsumptionReportTaskRepository
  ) { }

  async getAll(): Promise<GenerateConsumptionReportTaskDTO[]> {
    const tasks = await this.tasksRepository.getAll();

    return tasks.map<GenerateConsumptionReportTaskDTO>(task => ({
      startDate: task.startDate.toDateString(),
      endDate: task.endDate?.toDateString(),
      startReportDate: task.startReportDate.toDateString(),
      endReportDate: task.endReportDate.toDateString(),
      title: task.title,
      frequency: task.frequency,
      deviceId: task.deviceId!,
      operatorId: task.operatorId || task.supervisorId || ""
    }));
  }
}

export default GenerateConsumptionReportTaskService;
