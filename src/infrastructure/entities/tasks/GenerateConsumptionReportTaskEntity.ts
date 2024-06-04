import { GenerateReportTask } from "./GenerateReportTask";
import { TaskDTO, TaskType, TaskViewDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
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
    supervisorId,
    publicId
  }: GenerateReportTaskAttributes) {
    super({ id, startDate, endDate, frequency, startReportDate, endReportDate, title, deviceId, operatorId, supervisorId, publicId });
  }

  getTaskDTO(): TaskDTO {
    return {
      ...super.getTaskDTO(),
      type: TaskType.GENERATE_CONSUMPTION_REPORT
    }
  }

  getTaskView(): TaskViewDTO {
    return super.getTaskView(TaskType.GENERATE_CONSUMPTION_REPORT);
  }
}
