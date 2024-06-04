import { CreateTaskDTO, TaskDTO, TaskViewDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";

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

  static async fetchByPublicId(publicId: string): Promise<TaskDTO> {
    const response = await fetch(`/api/tasks/${publicId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch task.`);
    }
    return response.json();
  }

  static async delete(publicId: string): Promise<TaskDTO> {
    const response = await fetch(`/api/tasks/${publicId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete task with public identifier ${publicId}`);
    }
    return response.json();
  }

  static async patch(updateTaskDTO: UpdateTaskDTO): Promise<TaskDTO> {
    const response = await fetch(`/api/tasks/${updateTaskDTO.publicId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateTaskDTO),
    });
    if (!response.ok) {
      throw new Error(`Failed to update task`);
    }
    return response.json();
  }
}
