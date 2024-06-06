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
}