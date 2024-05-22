import { injectable, inject } from "tsyringe";
import type { GenerateAnomaliesReportTaskRepository } from "@/ports/tasks/GenerateAnomaliesReportTaskRepository";
import { GenerateAnomaliesReportTaskDTO } from "@/dtos/tasks/task.dto";

@injectable()
class GenerateAnomaliesReportTaskService {
  constructor(
    @inject("GenerateAnomaliesReportTaskRepository") private tasksRepository: GenerateAnomaliesReportTaskRepository
  ) { }

  async getAll(): Promise<GenerateAnomaliesReportTaskDTO[]> {
    const tasks = await this.tasksRepository.getAll();

    return tasks.map<GenerateAnomaliesReportTaskDTO>(task => ({
      startDate: task.startDate.toDateString(),
      endDate: task.endDate?.toDateString(),
      startReportDate: task.startReportDate.toDateString(),
      endReportDate: task.endReportDate.toDateString(),
      title: task.title,
      threshold: task.threshold
    }));
  }
}

export default GenerateAnomaliesReportTaskService;
