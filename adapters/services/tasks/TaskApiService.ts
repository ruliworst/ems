import { TaskViewDTO } from "@/dtos/tasks/task.dto";

export class TaskApiService {
  static async fetchAll(): Promise<TaskViewDTO[]> {
    const response = await fetch('/api/tasks');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  }
}
