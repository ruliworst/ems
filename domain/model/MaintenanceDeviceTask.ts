import { Task, TaskAttributes } from "./Task";
import { TaskType, TaskViewDTO } from "@/dtos/tasks/task.dto";

export class MaintenanceDeviceTaskEntity extends Task {
  constructor({
    id,
    startDate,
    endDate,
    frequency,
    deviceId,
    operatorId,
    supervisorId
  }: TaskAttributes) {
    super({ id, startDate, endDate, frequency, deviceId, operatorId, supervisorId });
  }

  getTaskView(): TaskViewDTO {
    return super.getTaskView(TaskType.MAINTENANCE_DEVICE);
  }
}
