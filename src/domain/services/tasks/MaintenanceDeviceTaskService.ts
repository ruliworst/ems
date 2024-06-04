import { injectable, inject } from "tsyringe";
import "@/config/container";
import { MaintenanceDeviceTask } from "@prisma/client";
import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { MaintenanceDeviceTaskEntity } from "@/src/infrastructure/entities/tasks/MaintenanceDeviceTaskEntity";
import type { MaintenanceDeviceTaskRepository } from "../../persistence/tasks/MaintenanceDeviceTaskRepository";

@injectable()
class MaintenanceDeviceTaskService {
  constructor(
    @inject("MaintenanceDeviceTaskRepository") private tasksRepository: MaintenanceDeviceTaskRepository
  ) { }

  async getAll(): Promise<MaintenanceDeviceTaskEntity[]> {
    const tasks: MaintenanceDeviceTask[] = await this.tasksRepository.getAll();

    return tasks.map<MaintenanceDeviceTaskEntity>(task => new MaintenanceDeviceTaskEntity(task));
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

  async update(updateTaskDTO: UpdateTaskDTO): Promise<MaintenanceDeviceTaskEntity> {
    const task: MaintenanceDeviceTask | null = await this.tasksRepository.update(updateTaskDTO);
    if (!task) throw new Error("The task could not be updated.");
    return new MaintenanceDeviceTaskEntity(task);
  };

  async getTaskByPublicId(publicId: string): Promise<MaintenanceDeviceTaskEntity | null> {
    const task = await this.tasksRepository.getTaskByPublicId(publicId);
    if (!task) return null;
    return new MaintenanceDeviceTaskEntity(task);
  }
}

export default MaintenanceDeviceTaskService;
