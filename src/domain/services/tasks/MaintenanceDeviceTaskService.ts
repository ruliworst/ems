import { injectable, inject } from "tsyringe";
import "@/config/container";
import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { MaintenanceDeviceTask } from "@prisma/client";
import type { TaskRepository } from "../../persistence/tasks/TaskRepository";
import { TaskService } from "./TaskService";
import { MaintenanceDeviceTaskEntity } from "@/src/infrastructure/entities/tasks/MaintenanceDeviceTaskEntity";

@injectable()
class MaintenanceDeviceTaskService extends TaskService<MaintenanceDeviceTask, MaintenanceDeviceTaskEntity> {
  constructor(
    @inject("MaintenanceDeviceTaskRepository") taskRepository: TaskRepository<MaintenanceDeviceTask>
  ) {
    super(taskRepository);
  }

  protected mapToEntity(task: MaintenanceDeviceTask): MaintenanceDeviceTaskEntity {
    return new MaintenanceDeviceTaskEntity({ ...task });
  }

  protected checkAttributes(createTaskDTO: CreateTaskDTO): void {
    if (createTaskDTO.startReportDate === undefined ||
      createTaskDTO.endReportDate === undefined ||
      createTaskDTO.title === undefined) {
      throw new Error("Some values are not valid.");
    }
  }

  protected getTaskToCreate(createTaskDTO: CreateTaskDTO): Partial<MaintenanceDeviceTask> {
    return {
      startDate: new Date(createTaskDTO.startDate),
      endDate: createTaskDTO.endDate ? new Date(createTaskDTO.endDate) : null,
      frequency: createTaskDTO.frequency,
    };
  }

  protected getTaskToUpdate(updateTaskDTO: UpdateTaskDTO): Partial<MaintenanceDeviceTask> {
    return {
      startDate: updateTaskDTO.startDate ? new Date(updateTaskDTO.startDate) : undefined,
      endDate: updateTaskDTO.endDate ? new Date(updateTaskDTO.endDate) : undefined,
      frequency: updateTaskDTO.frequency ?? undefined,
    };
  }
}

export default MaintenanceDeviceTaskService;
