import { Frequency } from "@prisma/client";

export enum TaskType {
  GENERATE_CONSUMPTION_REPORT,
  GENERATE_ANOMALIES_REPORT,
  MONITORIZE_CONSUMPTION,
  MAINTENANCE_DEVICE
}

export type TaskViewDTO = {
  startDate: string
  endDate?: string | null
  frequency: Frequency
  type: TaskType
}

export type CreateTaskDTO = {
  startDate: string
  endDate: string | null
  frequency: Frequency
  type: TaskType
  threshold: number | null
  startReportDate: string | null
  endReportDate: string | null
  title: string | null
  deviceId: string
  operatorId: string | null
  supervisorId: string | null
}