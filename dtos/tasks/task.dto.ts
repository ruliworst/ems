type BaseTask = {
  startDate: string,
  endDate?: string | null
};

type GenerateReportTask = BaseTask & {
  startReportDate: string,
  endReportDate: string,
  title: string,
};

export type MonitorizeConsumptionTaskDTO = BaseTask & {
  threshold: Number,
};

export type GenerateAnomaliesReportTaskDTO = GenerateReportTask & {
  threshold: Number,
};

export type GenerateConsumptionReportTaskDTO = GenerateReportTask;

export type MaintenanceDeviceTaskDTO = BaseTask;