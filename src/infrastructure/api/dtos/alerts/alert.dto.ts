import { Priority } from "@prisma/client"

export enum AlertType {
  MAINTENANCE,
  UNUSUAL_CONSUMPTION
}

export type AlertViewDTO = {
  message: string
  resolved: boolean
  priority: Priority
  publicId: string
  type: AlertType
  lastMaintenance: string | null
}

export type CreateAlertDTO = {
  message: string
  priority: Priority
  type: AlertType
  threshold?: number | null
  operatorId?: string
  supervisorId?: string
  deviceId: string
}