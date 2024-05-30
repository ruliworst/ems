import { TaskType, TaskViewDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
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
    supervisorId
  }: MonitorizeConsumptionTaskAttributes) {
    super({ id, startDate, endDate, frequency, deviceId, operatorId, supervisorId });
    this.threshold = threshold;
  }

  getTaskView(): TaskViewDTO {
    return super.getTaskView(TaskType.MONITORIZE_CONSUMPTION);
  }
}
