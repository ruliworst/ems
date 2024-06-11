import { injectable, inject } from "tsyringe";
import "@/config/container";
import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { MaintenanceDeviceTask, Priority } from "@prisma/client";
import type { TaskRepository } from "../../persistence/tasks/TaskRepository";
import { TaskService } from "./TaskService";
import { MaintenanceDeviceTaskEntity } from "@/src/infrastructure/entities/tasks/MaintenanceDeviceTaskEntity";
import Agenda, { Job } from "agenda";
import { AlertType, CreateAlertDTO } from "@/src/infrastructure/api/dtos/alerts/alert.dto";
import { BaseAlertService } from "../alerts/BaseAlertService";

@injectable()
class MaintenanceDeviceTaskService extends TaskService<MaintenanceDeviceTask, MaintenanceDeviceTaskEntity> {
  constructor(
    @inject("MaintenanceDeviceTaskRepository") taskRepository: TaskRepository<MaintenanceDeviceTask>,
    @inject("Agenda") protected agenda: Agenda,
    @inject(BaseAlertService) protected alertService: BaseAlertService,
  ) {
    super(taskRepository, agenda);
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

  protected getAgendaJobName(): string {
    return "MaintenanceDeviceJob";
  }

  protected async executeAgendaJob(job: Job): Promise<void> {
    const task = job.attrs.data as MaintenanceDeviceTaskEntity
    const { endDate } = task;

    if (endDate && new Date() >= new Date(endDate)) {
      console.log(`Task ${job.attrs.name} has reached its end date. Cancelling job...`);
      await job.remove();
      return;
    }

    this.execute(task);
  }

  async execute(task: MaintenanceDeviceTaskEntity): Promise<void> {
    const createAlertDTO: CreateAlertDTO = {
      message: `Maintenance is required.`,
      priority: Priority.HIGH,
      type: AlertType.MAINTENANCE,
      operatorId: task.operatorId ?? undefined,
      supervisorId: task.supervisorId ?? undefined,
      deviceId: task.deviceId
    };

    await this.alertService
      .create(createAlertDTO)
      .then(alert => console.log(`[${new Date().toISOString()}]: A maintenance alert was created as a result of MaintenanceTask execution.`));
  }
}

export default MaintenanceDeviceTaskService;