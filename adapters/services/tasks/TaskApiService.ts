import { TaskDTO } from "@/dtos/tasks/task.dto";

export class TaskApiService {
  static async fetchAll(): Promise<TaskDTO[]> {
    const response = await fetch('/api/tasks');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  }
}
