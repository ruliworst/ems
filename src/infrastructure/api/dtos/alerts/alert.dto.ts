import { Priority } from "@prisma/client"

export type AlertViewDTO = {
  message: string
  resolved: boolean
  priority: Priority
}