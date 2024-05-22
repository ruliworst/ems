import { injectable, inject } from "tsyringe";
import "@/config/container";
import type { MaintenanceDeviceTaskRepository } from "@/ports/tasks/MaintenanceDeviceTaskRepository";
import { MaintenanceDeviceTaskDTO, TaskDTO, TaskType } from "@/dtos/tasks/task.dto";

@injectable()
class MaintenanceDeviceTaskService {
  constructor(
    @inject("MaintenanceDeviceTaskRepository") private tasksRepository: MaintenanceDeviceTaskRepository
  ) { }

  async getAll(): Promise<MaintenanceDeviceTaskDTO[]> {
    const tasks = await this.tasksRepository.getAll();

    return tasks.map<MaintenanceDeviceTaskDTO>(task => ({
      startDate: task.startDate.toDateString(),
      endDate: task.endDate?.toDateString(),
      frequency: task.frequency,
      deviceId: task.deviceId!,
      operatorId: task.operatorId || task.supervisorId || ""
    }));
  };

  toTaskDTO(task: MaintenanceDeviceTaskDTO): TaskDTO {
    return {
      startDate: task.startDate,
      endDate: task.endDate,
      frequency: task.frequency,
      type: TaskType.MAINTENANCE_DEVICE
    };
  };
}

export default MaintenanceDeviceTaskService;
