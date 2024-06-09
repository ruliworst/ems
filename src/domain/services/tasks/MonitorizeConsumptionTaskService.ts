import { injectable, inject } from "tsyringe";
import "@/config/container";
import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { MonitorizeConsumptionTask } from "@prisma/client";
import type { TaskRepository } from "../../persistence/tasks/TaskRepository";
import { TaskService } from "./TaskService";
import { MonitorizeConsumptionTaskEntity } from "@/src/infrastructure/entities/tasks/MonitorizeConsumptionTaskEntity";
import Agenda, { Job } from "agenda";

@injectable()
class MonitorizeConsumptionTaskService extends TaskService<MonitorizeConsumptionTask, MonitorizeConsumptionTaskEntity> {
  constructor(
    @inject("MonitorizeConsumptionTaskRepository") taskRepository: TaskRepository<MonitorizeConsumptionTask>,
    @inject("Agenda") protected agenda: Agenda
  ) {
    super(taskRepository, agenda);
  }

  protected mapToEntity(task: MonitorizeConsumptionTask): MonitorizeConsumptionTaskEntity {
    return new MonitorizeConsumptionTaskEntity({ ...task });
  }

  protected checkAttributes(createTaskDTO: CreateTaskDTO): void {
    if (createTaskDTO.threshold === undefined || createTaskDTO.threshold === null) {
      throw new Error("Some values are not valid.");
    }
  }

  protected getTaskToCreate(createTaskDTO: CreateTaskDTO): Partial<MonitorizeConsumptionTask> {
    return {
      startDate: new Date(createTaskDTO.startDate),
      endDate: createTaskDTO.endDate ? new Date(createTaskDTO.endDate) : null,
      frequency: createTaskDTO.frequency,
      threshold: createTaskDTO.threshold!,
    };
  }

  protected getTaskToUpdate(updateTaskDTO: UpdateTaskDTO): Partial<MonitorizeConsumptionTask> {
    return {
      startDate: updateTaskDTO.startDate ? new Date(updateTaskDTO.startDate) : undefined,
      endDate: updateTaskDTO.endDate ? new Date(updateTaskDTO.endDate) : undefined,
      frequency: updateTaskDTO.frequency ?? undefined,
    };
  }

  protected getAgendaJobName(): string {
    return "MonitorizeConsumptionJob";
  }

  protected async executeAgendaJob(job: Job): Promise<void> {
    const taskAttributes = job.attrs.data as MonitorizeConsumptionTaskEntity;
    this.execute(taskAttributes);
  }

  async execute(task: MonitorizeConsumptionTaskEntity): Promise<void> {
    console.log(`Ejecutando tarea de monitorización para el dispositivo ${task.deviceId}`);
  }
}

export default MonitorizeConsumptionTaskService;
