import { TaskDTO } from "../../api/dtos/tasks/task.dto";
import { Task, TaskAttributes } from "./Task";

export interface GenerateReportTaskAttributes extends TaskAttributes {
  startReportDate: Date;
  endReportDate: Date;
  title: string;
}

export abstract class GenerateReportTask extends Task {
  startReportDate: Date;
  endReportDate: Date;
  title: string;

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
    super({ id, startDate, endDate, frequency, deviceId, operatorId, supervisorId, publicId });
    this.startReportDate = startReportDate;
    this.endReportDate = endReportDate;
    this.title = title;
  }

  getTaskDTO(): TaskDTO {
    return {
      ...super.getTaskDTO(),
      startReportDate: this.startReportDate.toDateString(),
      endReportDate: this.endReportDate.toDateString(),
      title: this.title,
    }
  }
}
