import { Task, TaskAttributes } from "./Task";
import { TaskDTO, TaskType, TaskViewDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";

export class MaintenanceDeviceTaskEntity extends Task {
  constructor({
    id,
    startDate,
    endDate,
    frequency,
    deviceId,
    operatorId,
    supervisorId,
    publicId
  }: TaskAttributes) {
    super({ id, startDate, endDate, frequency, deviceId, operatorId, supervisorId, publicId });
  }

  getTaskDTO(): TaskDTO {
    return {
      ...super.getTaskDTO(),
      type: TaskType.MAINTENANCE_DEVICE
    }
  }

  getTaskView(): TaskViewDTO {
    return super.getTaskView(TaskType.MAINTENANCE_DEVICE);
  }
}
