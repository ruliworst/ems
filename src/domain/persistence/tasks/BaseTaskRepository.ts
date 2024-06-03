import { CreateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";

export interface BaseTaskRepository<T> {
  getAll(): Promise<T[]>;
  create(createTaskDTO: CreateTaskDTO): Promise<T>;
  getTaskByPublicId(publicId: string): Promise<T | null>;
}
