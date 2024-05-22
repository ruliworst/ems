import { injectable, inject } from "tsyringe";
import type { MaintenanceDeviceTaskRepository } from "@/ports/tasks/MaintenanceDeviceTaskRepository";
import { MaintenanceDeviceTaskDTO } from "@/dtos/tasks/task.dto";

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
    }));
  }
}

export default MaintenanceDeviceTaskService;
