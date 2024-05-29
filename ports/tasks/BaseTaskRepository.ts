import { CreateTaskDTO } from "@/dtos/tasks/task.dto";

export interface BaseTaskRepository<T> {
  getAll(): Promise<T[]>;
  create(createTaskDTO: CreateTaskDTO): Promise<T>;
}
