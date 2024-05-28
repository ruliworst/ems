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
    supervisorId
  }: GenerateReportTaskAttributes) {
    super({ id, startDate, endDate, frequency, deviceId, operatorId, supervisorId });
    this.startReportDate = startReportDate;
    this.endReportDate = endReportDate;
    this.title = title;
  }
}
