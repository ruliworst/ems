import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import type { TaskRepository } from "../../persistence/tasks/TaskRepository";
import Agenda, { Job, JobAttributesData } from "agenda";
import { inject } from "tsyringe";

export abstract class TaskService<T, E extends JobAttributesData> {
  constructor(
    protected taskRepository: TaskRepository<T>,
    @inject("Agenda") protected agenda: Agenda
  ) {
    this.defineAgendaJob();
  }

  protected abstract mapToEntity(task: T): E;
  protected abstract checkAttributes(createTaskDTO: CreateTaskDTO): void;
  protected abstract getTaskToCreate(createTaskDTO: CreateTaskDTO): Partial<T>;
  protected abstract getTaskToUpdate(updateTaskDTO: UpdateTaskDTO): Partial<T>;
  protected abstract getAgendaJobName(): string;
  protected abstract executeAgendaJob(job: Job): void;

  async getAll(): Promise<E[]> {
    const tasks: T[] = await this.taskRepository.getAll();
    return tasks.map(this.mapToEntity);
  };

  protected defineAgendaJob(): void {
    this.agenda.define(this.getAgendaJobName(), async (job: Job): Promise<void> => {
      await this.executeAgendaJob(job);
    });
  }

  async scheduleAgendaJob(entity: E): Promise<void> {
    const { startDate, endDate } = entity;
    const jobAttributesData: JobAttributesData = { ...entity };
    const jobName: string = this.getAgendaJobName();
    console.log(`Scheduling a task with name: ${jobName} with frequency ${entity.frequency}...`);

    const job = this.agenda.create(jobName, jobAttributesData);
    job.schedule(new Date(startDate)).repeatEvery(entity.intervalInMilliseconds, { skipImmediate: true });

    job.attrs.startDate = new Date(startDate);
    job.attrs.endDate = new Date(endDate);

    await job.save()
      .then(() => console.log(`Task scheduled: ${startDate}`))
      .catch(error => console.error("Error when trying to schedule the task:", error));
  }

  async create(createTaskDTO: CreateTaskDTO): Promise<E> {
    this.checkAttributes(createTaskDTO);
    return await this.taskRepository
      .create(
        this.getTaskToCreate(createTaskDTO),
        createTaskDTO.operatorEmail!,
        createTaskDTO.deviceName)
      .then(async task => {
        const entity = this.mapToEntity(task);
        await this.scheduleAgendaJob(entity);

        return entity;
      })
      .catch(error => {
        console.error(error);
        throw error;
      });
  };

  async delete(publicId: string): Promise<E | null> {
    try {
      const task: T | null = await this.taskRepository.delete(publicId);
      if (!task) {
        throw new Error("The task could not be deleted.");
      }
      return this.mapToEntity(task);
    } catch (error) {
      console.error("Error deleting a task:", error);
      return null;
    }
  };

  async update(updateTaskDTO: UpdateTaskDTO): Promise<E> {
    const task: T | null = await this.taskRepository.update(updateTaskDTO.publicId, this.getTaskToUpdate(updateTaskDTO));
    if (!task) throw new Error("The task could not be updated.");
    return this.mapToEntity(task);
  };

  async getTaskByPublicId(publicId: string): Promise<E | null> {
    const task = await this.taskRepository.getTaskByPublicId(publicId);
    if (!task) return null;
    return this.mapToEntity(task);
  }
}