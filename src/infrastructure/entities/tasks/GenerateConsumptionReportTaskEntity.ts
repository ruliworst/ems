import { GenerateReportTask } from "./GenerateReportTask";
import { TaskType, TaskViewDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { TaskAttributes } from "./Task";

interface GenerateReportTaskAttributes extends TaskAttributes {
  startReportDate: Date;
  endReportDate: Date;
  title: string;
}

export class GenerateConsumptionReportTaskEntity extends GenerateReportTask {
  constructor({
    id,
    startDate,
    endDate,
    frequency,
    startReportDate,
    endReportDate,
    title,
    deviceId,
    operatorId,
    supervisorId
  }: GenerateReportTaskAttributes) {
    super({ id, startDate, endDate, frequency, startReportDate, endReportDate, title, deviceId, operatorId, supervisorId });
  }

  getTaskView(): TaskViewDTO {
    return super.getTaskView(TaskType.GENERATE_CONSUMPTION_REPORT);
  }
}
