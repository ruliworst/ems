import { injectable, inject } from "tsyringe";
import "@/config/container";
import type { MaintenanceDeviceTaskRepository } from "@/ports/tasks/MaintenanceDeviceTaskRepository";
import { MaintenanceDeviceTask } from "@prisma/client";
import { MaintenanceDeviceTaskEntity } from "@/domain/model/MaintenanceDeviceTask";
import { CreateTaskDTO } from "@/dtos/tasks/task.dto";

@injectable()
class MaintenanceDeviceTaskService {
  constructor(
    @inject("MaintenanceDeviceTaskRepository") private tasksRepository: MaintenanceDeviceTaskRepository
  ) { }

  async getAll(): Promise<MaintenanceDeviceTaskEntity[]> {
    const tasks: MaintenanceDeviceTask[] = await this.tasksRepository.getAll();

    return tasks.map<MaintenanceDeviceTaskEntity>(task => new MaintenanceDeviceTaskEntity({
      id: task.id,
      startDate: task.startDate,
      endDate: task.endDate,
      frequency: task.frequency,
      deviceId: task.deviceId,
      operatorId: task.operatorId || null,
      supervisorId: task.supervisorId || null
    }));
  };

  async create(createTaskDTO: CreateTaskDTO): Promise<MaintenanceDeviceTaskEntity> {
    try {
      const task: MaintenanceDeviceTask = await this.tasksRepository.create(createTaskDTO);
      return new MaintenanceDeviceTaskEntity(task);
    } catch (error) {
      console.error("Error creating a task:", error);
      throw error;
    }
  };
}

export default MaintenanceDeviceTaskService;
