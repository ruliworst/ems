import { TaskApiService } from "@/adapters/services/tasks/TaskApiService";
import { TaskType, TaskViewDTO } from "@/dtos/tasks/task.dto";
import { Frequency } from "@prisma/client";

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
        frequency: Frequency.MONTHLY
      },
      {
        startDate: '2024-06-01T10:00:00.000Z',
        endDate: '2024-06-10T10:00:00.000Z',
        type: TaskType.GENERATE_ANOMALIES_REPORT,
        frequency: Frequency.DAILY
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
});
