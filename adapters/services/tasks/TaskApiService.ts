import { CreateTaskDTO, TaskViewDTO } from "@/dtos/tasks/task.dto";

export class TaskApiService {
  static async fetchAll(): Promise<TaskViewDTO[]> {
    const response = await fetch('/api/tasks');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  }

  static async create(task: CreateTaskDTO): Promise<TaskViewDTO> {
    const response = await fetch('/api/tasks', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return response.json();
  }
}
