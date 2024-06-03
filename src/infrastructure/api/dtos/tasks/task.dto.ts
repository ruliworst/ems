import { Frequency } from "@prisma/client";

export enum TaskType {
  GENERATE_CONSUMPTION_REPORT,
  GENERATE_ANOMALIES_REPORT,
  MONITORIZE_CONSUMPTION,
  MAINTENANCE_DEVICE
}

export type TaskDTO = {
  publicId: string
  startDate: string
  endDate?: string
  frequency: Frequency
  startReportDate?: string | null
  endReportDate?: string | null
  title?: string | null
  threshold?: number | null
}

export type TaskViewDTO = {
  startDate: string
  endDate?: string | null
  frequency: Frequency
  type: TaskType
  publicId: string
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
  deviceName: string
  operatorEmail: string | null
}