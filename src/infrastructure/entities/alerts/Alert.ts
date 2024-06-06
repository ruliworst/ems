import { Priority } from "@prisma/client";
import { AlertType, AlertViewDTO } from "@/src/infrastructure/api/dtos/alerts/alert.dto";

export interface AlertAttributes {
  id: string;
  message: string;
  resolved: boolean;
  priority: Priority;
  deviceId: string;
  operatorId: string | null;
  supervisorId: string | null;
  publicId: string;
}

export abstract class Alert {
  id: string;
  message: string;
  resolved: boolean;
  priority: Priority;
  deviceId: string;
  operatorId: string | null;
  supervisorId: string | null;
  publicId: string;

  constructor({ id, message, resolved = false, priority, deviceId, operatorId, supervisorId, publicId }: AlertAttributes) {
    if ((operatorId === undefined || null) && (supervisorId === undefined || null)) {
      throw new Error("The alert must be associated to an Operator or a Supervisor.");
    }

    this.id = id;
    this.message = message;
    this.resolved = resolved;
    this.priority = priority;
    this.deviceId = deviceId;
    this.operatorId = operatorId;
    this.supervisorId = supervisorId;
    this.publicId = publicId;
  }

  getView(type: AlertType): AlertViewDTO {
    return {
      message: this.message,
      resolved: this.resolved,
      priority: this.priority,
      publicId: this.publicId,
      type
    };
  };
}