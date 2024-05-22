import { injectable, inject } from "tsyringe";
import "@/config/container";
import type { GenerateAnomaliesReportTaskRepository } from "@/ports/tasks/GenerateAnomaliesReportTaskRepository";
import { GenerateAnomaliesReportTaskDTO, TaskDTO, TaskType } from "@/dtos/tasks/task.dto";

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
      threshold: task.threshold,
      frequency: task.frequency,
      deviceId: task.deviceId!,
      operatorId: task.operatorId || task.supervisorId || ""
    }));
  };

  toTaskDTO(task: GenerateAnomaliesReportTaskDTO): TaskDTO {
    return {
      startDate: task.startDate,
      endDate: task.endDate,
      frequency: task.frequency,
      type: TaskType.GENERATE_ANOMALIES_REPORT
    };
  };
}

export default GenerateAnomaliesReportTaskService;
