import { injectable, inject } from "tsyringe";
import "@/config/container";
import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { MonitorizeConsumptionTask } from "@prisma/client";
import type { TaskRepository } from "../../persistence/tasks/TaskRepository";
import { TaskService } from "./TaskService";
import { MonitorizeConsumptionTaskEntity } from "@/src/infrastructure/entities/tasks/MonitorizeConsumptionTaskEntity";
import Agenda, { Job } from "agenda";
import { EnergyConsumptionRecordService } from "../energy-consumption-records/EnergyConsumptionRecordService";
import { CreateEnergyConsumptionRecordDTO } from "@/src/infrastructure/api/dtos/energy-consumption-records/energy-consumption-record.dto";
import * as crypto from "crypto";

@injectable()
class MonitorizeConsumptionTaskService extends TaskService<MonitorizeConsumptionTask, MonitorizeConsumptionTaskEntity> {
  constructor(
    @inject("MonitorizeConsumptionTaskRepository") taskRepository: TaskRepository<MonitorizeConsumptionTask>,
    @inject("Agenda") protected agenda: Agenda,
    @inject(EnergyConsumptionRecordService) private recordService: EnergyConsumptionRecordService
  ) {
    super(taskRepository, agenda);
  }

  mapToEntity(task: MonitorizeConsumptionTask): MonitorizeConsumptionTaskEntity {
    return new MonitorizeConsumptionTaskEntity({ ...task });
  }

  checkAttributes(createTaskDTO: CreateTaskDTO): void {
    if (createTaskDTO.threshold === undefined || createTaskDTO.threshold === null) {
      throw new Error("Some values are not valid.");
    }
  }

  getTaskToCreate(createTaskDTO: CreateTaskDTO): Partial<MonitorizeConsumptionTask> {
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

  async executeAgendaJob(job: Job): Promise<void> {
    const task = job.attrs.data as MonitorizeConsumptionTaskEntity
    const { endDate } = task;

    if (endDate && new Date() >= new Date(endDate)) {
      console.log(`Task ${job.attrs.name} has reached its end date. Cancelling job...`);
      await job.remove();
      return;
    }

    this.execute(task);
  }

  async execute(task: MonitorizeConsumptionTaskEntity): Promise<void> {
    const createEnergyConsumptionRecordDTO: CreateEnergyConsumptionRecordDTO = {
      recordDate: new Date().toISOString(),
      // TODO: Remove random values.
      quantity: crypto.randomInt(1, 101),
      price: (crypto.randomInt(1, 150) + 1) / 100,
      deviceId: task.deviceId
    }


    await this.recordService
      .create(createEnergyConsumptionRecordDTO)
      .then(record => console.log(`[${new Date().toISOString()}]: An energy consumption record was created as a result of MonitorizeConsumptionTask execution.`));
  }
}

export default MonitorizeConsumptionTaskService;
