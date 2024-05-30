import { injectable, inject } from "tsyringe";
import "@/config/container";
import { MaintenanceDeviceTask } from "@prisma/client";
import { CreateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { MaintenanceDeviceTaskEntity } from "@/src/infrastructure/entities/tasks/MaintenanceDeviceTaskEntity";
import type { MaintenanceDeviceTaskRepository } from "../../persistence/tasks/MaintenanceDeviceTaskRepository";

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
