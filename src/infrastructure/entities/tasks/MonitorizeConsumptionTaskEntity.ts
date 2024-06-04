import { TaskDTO, TaskType, TaskViewDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { Task, TaskAttributes } from "./Task";

interface MonitorizeConsumptionTaskAttributes extends TaskAttributes {
  threshold: number;
}

export class MonitorizeConsumptionTaskEntity extends Task {
  threshold: number;

  constructor({
    id,
    startDate,
    endDate,
    frequency,
    threshold,
    deviceId,
    operatorId,
    supervisorId,
    publicId
  }: MonitorizeConsumptionTaskAttributes) {
    super({ id, startDate, endDate, frequency, deviceId, operatorId, supervisorId, publicId });
    this.threshold = threshold;
  }

  getTaskDTO(): TaskDTO {
    return {
      ...super.getTaskDTO(),
      threshold: this.threshold,
      type: TaskType.MONITORIZE_CONSUMPTION
    }
  }

  getTaskView(): TaskViewDTO {
    return super.getTaskView(TaskType.MONITORIZE_CONSUMPTION);
  }
}
