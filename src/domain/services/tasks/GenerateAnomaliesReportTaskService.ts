import { injectable, inject } from "tsyringe";
import "@/config/container";
import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { GenerateAnomaliesReportTask } from "@prisma/client";
import { GenerateAnomaliesReportTaskEntity } from "@/src/infrastructure/entities/tasks/GenerateAnomaliesReportTaskEntity";
import type { TaskRepository } from "../../persistence/tasks/TaskRepository";
import { TaskService } from "./TaskService";
import Agenda, { Job } from "agenda";

@injectable()
class GenerateAnomaliesReportTaskService extends TaskService<GenerateAnomaliesReportTask, GenerateAnomaliesReportTaskEntity> {
  constructor(
    @inject("GenerateAnomaliesReportTaskRepository") taskRepository: TaskRepository<GenerateAnomaliesReportTask>,
    @inject("Agenda") protected agenda: Agenda
  ) {
    super(taskRepository, agenda);
  }

  protected mapToEntity(task: GenerateAnomaliesReportTask): GenerateAnomaliesReportTaskEntity {
    return new GenerateAnomaliesReportTaskEntity({ ...task });
  }

  protected checkAttributes(createTaskDTO: CreateTaskDTO): void {
    if (createTaskDTO.startReportDate === undefined ||
      createTaskDTO.endReportDate === undefined ||
      createTaskDTO.title === undefined ||
      createTaskDTO.threshold === undefined ||
      createTaskDTO.operatorEmail === undefined ||
      createTaskDTO.deviceName === undefined) {
      throw new Error("Some values are not valid.");
    }
  }

  protected getTaskToCreate(createTaskDTO: CreateTaskDTO): Partial<GenerateAnomaliesReportTask> {
    return {
      startDate: new Date(createTaskDTO.startDate),
      endDate: createTaskDTO.endDate ? new Date(createTaskDTO.endDate) : null,
      startReportDate: new Date(createTaskDTO.startReportDate!),
      endReportDate: new Date(createTaskDTO.endReportDate!),
      title: createTaskDTO.title!,
      threshold: createTaskDTO.threshold!,
      frequency: createTaskDTO.frequency,
    };
  }

  protected getTaskToUpdate(updateTaskDTO: UpdateTaskDTO): Partial<GenerateAnomaliesReportTask> {
    return {
      startDate: updateTaskDTO.startDate ? new Date(updateTaskDTO.startDate) : undefined,
      endDate: updateTaskDTO.endDate ? new Date(updateTaskDTO.endDate) : undefined,
      frequency: updateTaskDTO.frequency ?? undefined,
      startReportDate: updateTaskDTO.startReportDate ? new Date(updateTaskDTO.startReportDate) : undefined,
      endReportDate: updateTaskDTO.endReportDate ? new Date(updateTaskDTO.endReportDate) : undefined,
      title: updateTaskDTO.title ?? undefined,
      threshold: updateTaskDTO.threshold ?? undefined,
    };
  }

  protected getAgendaJobName(): string {
    return "GenerateAnomaliesReportJob";
  }

  protected async executeAgendaJob(job: Job): Promise<void> {
    const taskAttributes = job.attrs.data as GenerateAnomaliesReportTaskEntity;
    this.execute(taskAttributes);
  }

  async execute(task: GenerateAnomaliesReportTaskEntity): Promise<void> {
    console.log(`Ejecutando tarea de generación de reporte de anomalías para el dispositivo ${task.deviceId}`);
  }
}

export default GenerateAnomaliesReportTaskService;
