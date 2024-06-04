import { TaskDTO, TaskType, TaskViewDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { Frequency } from "@prisma/client";

export interface TaskAttributes {
  id: string;
  startDate: Date;
  endDate: Date | null;
  frequency: Frequency;
  deviceId: string;
  operatorId: string | null;
  supervisorId: string | null;
  publicId: string;
}

export abstract class Task {
  id: string;
  startDate: Date;
  endDate?: Date | null;
  frequency: Frequency;
  intervalInMilliseconds: number;
  deviceId: string;
  operatorId: string | null;
  supervisorId: string | null;
  publicId: string;

  constructor({ id, startDate, endDate, frequency, deviceId, operatorId, supervisorId, publicId }: TaskAttributes) {
    if ((operatorId === undefined || null) && (supervisorId === undefined || null)) {
      throw new Error("The task must be associated to an Operator or a Supervisor.");
    }

    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.frequency = frequency;
    this.intervalInMilliseconds = this.getIntervalInMilliseconds(frequency);
    this.deviceId = deviceId;
    this.operatorId = operatorId;
    this.supervisorId = supervisorId;
    this.publicId = publicId;
  }

  getTaskDTO(): TaskDTO {
    return {
      publicId: this.publicId,
      startDate: this.startDate.toDateString(),
      endDate: this.endDate?.toDateString(),
      frequency: this.frequency,
    };
  }


  getTaskView(type: TaskType): TaskViewDTO {
    return {
      startDate: this.startDate.toDateString(),
      endDate: this.endDate?.toDateString(),
      frequency: this.frequency,
      type: type,
      publicId: this.publicId
    };
  };

  private getIntervalInMilliseconds(frequency: Frequency): number {
    if (frequency === Frequency.DAILY) {
      return 24 * 60 * 60 * 1000;
    } else if (frequency === Frequency.WEEKLY) {
      return 7 * 24 * 60 * 60 * 1000;
    } else if (frequency === Frequency.MONTHLY) {
      return 30 * 24 * 60 * 60 * 1000;
    }

    throw new Error("The frequency is not valid.");
  }
}