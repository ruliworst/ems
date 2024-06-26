import { injectable, inject } from "tsyringe";
import "@/config/container";
import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { GenerateConsumptionReportTask } from "@prisma/client";
import type { TaskRepository } from "../../persistence/tasks/TaskRepository";
import { TaskService } from "./TaskService";
import { GenerateConsumptionReportTaskEntity } from "@/src/infrastructure/entities/tasks/GenerateConsumptionReportTaskEntity";
import Agenda, { Job } from "agenda";

@injectable()
class GenerateConsumptionReportTaskService extends TaskService<GenerateConsumptionReportTask, GenerateConsumptionReportTaskEntity> {
  constructor(
    @inject("GenerateConsumptionReportTaskRepository") taskRepository: TaskRepository<GenerateConsumptionReportTask>,
    @inject("Agenda") protected agenda: Agenda
  ) {
    super(taskRepository, agenda);
  }

  protected mapToEntity(task: GenerateConsumptionReportTask): GenerateConsumptionReportTaskEntity {
    return new GenerateConsumptionReportTaskEntity({ ...task });
  }

  protected checkAttributes(createTaskDTO: CreateTaskDTO): void {
    if (createTaskDTO.startReportDate === undefined ||
      createTaskDTO.endReportDate === undefined ||
      createTaskDTO.title === undefined) {
      throw new Error("Some values are not valid.");
    }
  }

  protected getTaskToCreate(createTaskDTO: CreateTaskDTO): Partial<GenerateConsumptionReportTask> {
    return {
      startDate: new Date(createTaskDTO.startDate),
      endDate: createTaskDTO.endDate ? new Date(createTaskDTO.endDate) : null,
      startReportDate: new Date(createTaskDTO.startReportDate!),
      endReportDate: new Date(createTaskDTO.endReportDate!),
      title: createTaskDTO.title!,
      frequency: createTaskDTO.frequency,
    };
  }

  protected getTaskToUpdate(updateTaskDTO: UpdateTaskDTO): Partial<GenerateConsumptionReportTask> {
    return {
      startDate: updateTaskDTO.startDate ? new Date(updateTaskDTO.startDate) : undefined,
      endDate: updateTaskDTO.endDate ? new Date(updateTaskDTO.endDate) : undefined,
      frequency: updateTaskDTO.frequency ?? undefined,
      startReportDate: updateTaskDTO.startReportDate ? new Date(updateTaskDTO.startReportDate) : undefined,
      endReportDate: updateTaskDTO.endReportDate ? new Date(updateTaskDTO.endReportDate) : undefined,
      title: updateTaskDTO.title ?? undefined,
    };
  }

  protected getAgendaJobName(): string {
    return "GenerateConsumptionReportJob";
  }

  protected async executeAgendaJob(job: Job): Promise<void> {
    const taskAttributes = job.attrs.data as GenerateConsumptionReportTaskEntity;
    this.execute(taskAttributes);
  }

  async execute(task: GenerateConsumptionReportTaskEntity): Promise<void> {
    console.log(`Ejecutando tarea de generación de reporte de consumo para el dispositivo ${task.deviceId}`);
  }
}

export default GenerateConsumptionReportTaskService;
