import { GenerateReportTask, GenerateReportTaskAttributes } from "./GenerateReportTask";
import { TaskType, TaskViewDTO } from "@/dtos/tasks/task.dto";

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
    supervisorId
  }: GenerateAnomaliesReportTaskAttributes) {
    super({ id, startDate, endDate, frequency, startReportDate, endReportDate, title, deviceId, operatorId, supervisorId });
    this.threshold = threshold;
  }

  getTaskView(): TaskViewDTO {
    return super.getTaskView(TaskType.GENERATE_ANOMALIES_REPORT);
  }
}
