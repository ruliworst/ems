import { TaskType, TaskViewDTO } from "@/dtos/tasks/task.dto";
import { Frequency } from "@prisma/client";

export interface TaskAttributes {
  id: string;
  startDate: Date;
  endDate: Date | null;
  frequency: Frequency;
  deviceId: string;
  operatorId: string | null;
  supervisorId: string | null;
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

  constructor({ id, startDate, endDate, frequency, deviceId, operatorId, supervisorId }: TaskAttributes) {
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
  }

  getTaskView(type: TaskType): TaskViewDTO {
    return {
      startDate: this.startDate.toDateString(),
      endDate: this.endDate?.toDateString(),
      frequency: this.frequency,
      type: type
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