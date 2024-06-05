import { CreateTaskDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { TaskRepository } from "../../persistence/tasks/TaskRepository";

export abstract class TaskService<T, E> {
  constructor(
    protected taskRepository: TaskRepository<T>,
  ) { }

  protected abstract mapToEntity(task: T): E;
  protected abstract checkAttributes(createTaskDTO: CreateTaskDTO): void;
  protected abstract getTaskToCreate(createTaskDTO: CreateTaskDTO): Partial<T>;
  protected abstract getTaskToUpdate(updateTaskDTO: UpdateTaskDTO): Partial<T>;

  async getAll(): Promise<E[]> {
    const tasks: T[] = await this.taskRepository.getAll();
    return tasks.map(this.mapToEntity);
  };

  async create(createTaskDTO: CreateTaskDTO): Promise<E> {
    this.checkAttributes(createTaskDTO);
    try {
      const createdTask: T = await this.taskRepository.create(
        this.getTaskToCreate(createTaskDTO),
        createTaskDTO.operatorEmail!,
        createTaskDTO.deviceName);
      return this.mapToEntity(createdTask);
    } catch (error) {
      console.error("Error creating a task:", error);
      throw error;
    }
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