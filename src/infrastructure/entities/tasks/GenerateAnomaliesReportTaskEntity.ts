import { GenerateReportTask, GenerateReportTaskAttributes } from "./GenerateReportTask";
import { TaskDTO, TaskType, TaskViewDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";

interface GenerateAnomaliesReportTaskAttributes extends GenerateReportTaskAttributes {
  threshold: number;
}

export class GenerateAnomaliesReportTaskEntity extends GenerateReportTask {
  threshold: number;

  constructor({
    id,
    startDate,
    endDate,
    frequency,
    startReportDate,
    endReportDate,
    title,
    threshold,
    deviceId,
    operatorId,
    supervisorId,
    publicId
  }: GenerateAnomaliesReportTaskAttributes) {
    super({ id, startDate, endDate, frequency, startReportDate, endReportDate, title, deviceId, operatorId, supervisorId, publicId });
    this.threshold = threshold;
  }

  getTaskDTO(): TaskDTO {
    return {
      ...super.getTaskDTO(),
      threshold: this.threshold,
      type: TaskType.GENERATE_ANOMALIES_REPORT
    }
  }

  getTaskView(): TaskViewDTO {
    return super.getTaskView(TaskType.GENERATE_ANOMALIES_REPORT);
  }
}
