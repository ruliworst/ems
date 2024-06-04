import { TaskType, CreateTaskDTO, TaskViewDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { TaskApiService } from "@/src/infrastructure/api/services/tasks/TaskApiService";
import { Frequency } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

global.fetch = jest.fn();

describe('TaskApiService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all tasks successfully', async () => {
    // Arrange
    const mockTasks: TaskViewDTO[] = [
      {
        startDate: '2024-05-01T10:00:00.000Z',
        endDate: '2024-05-10T10:00:00.000Z',
        type: TaskType.MAINTENANCE_DEVICE,
        frequency: Frequency.MONTHLY,
        publicId: uuidv4()
      },
      {
        startDate: '2024-06-01T10:00:00.000Z',
        endDate: '2024-06-10T10:00:00.000Z',
        type: TaskType.GENERATE_ANOMALIES_REPORT,
        frequency: Frequency.DAILY,
        publicId: uuidv4()
      }
    ];

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTasks,
    });

    // Act
    const tasks = await TaskApiService.fetchAll();

    // Assert
    expect(tasks).toEqual(mockTasks);
    expect(fetch).toHaveBeenCalledWith('/api/tasks');
  });

  it('should throw an error when fetching tasks fails', async () => {
    // Arrange
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert
    await expect(TaskApiService.fetchAll()).rejects.toThrow('Failed to fetch tasks');
    expect(fetch).toHaveBeenCalledWith('/api/tasks');
  });

  it('should create a task successfully', async () => {
    // Arrange
    const mockTask: CreateTaskDTO = {
      startDate: '2024-07-01T10:00:00.000Z',
      endDate: '2024-07-10T10:00:00.000Z',
      type: TaskType.MAINTENANCE_DEVICE,
      frequency: Frequency.WEEKLY,
      threshold: null,
      startReportDate: null,
      endReportDate: null,
      title: null,
      deviceName: "Device-Monitorize",
      operatorEmail: "bob.doe@example.com"
    };

    const mockTaskView: TaskViewDTO = {
      startDate: '2024-07-01T10:00:00.000Z',
      endDate: '2024-07-10T10:00:00.000Z',
      type: TaskType.MAINTENANCE_DEVICE,
      frequency: Frequency.WEEKLY,
      publicId: uuidv4()
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTaskView,
    });

    // Act
    const createdTask = await TaskApiService.create(mockTask);

    // Assert
    expect(createdTask).toEqual(mockTaskView);
    expect(fetch).toHaveBeenCalledWith('/api/tasks', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockTask),
    });
  });

  it('should throw an error when task creation fails', async () => {
    // Arrange
    const mockTask: CreateTaskDTO = {
      startDate: '2024-07-01T10:00:00.000Z',
      endDate: '2024-07-10T10:00:00.000Z',
      type: TaskType.MAINTENANCE_DEVICE,
      frequency: Frequency.WEEKLY,
      threshold: null,
      startReportDate: null,
      endReportDate: null,
      title: null,
      deviceName: "Device-Monitorize",
      operatorEmail: "bob.doe@example.com"
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert
    await expect(TaskApiService.create(mockTask)).rejects.toThrow('Failed to create task');
    expect(fetch).toHaveBeenCalledWith('/api/tasks', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockTask),
    });
  });

  it("should delete a task successfully", async () => {
    // Arrange
    const publicIdToDelete = uuidv4();

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Task deleted successfully" }),
    });

    // Act
    const result = await TaskApiService.delete(publicIdToDelete);

    // Assert
    expect(result).toEqual({ message: "Task deleted successfully" });
    expect(fetch).toHaveBeenCalledWith(`/api/tasks/${publicIdToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("should throw an error when task deletion fails", async () => {
    // Arrange
    const publicIdToDelete = uuidv4();

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    // Act & Assert
    await expect(TaskApiService.delete(publicIdToDelete)).rejects.toThrow(
      `Failed to delete task with public identifier ${publicIdToDelete}`
    );
    expect(fetch).toHaveBeenCalledWith(`/api/tasks/${publicIdToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
});
