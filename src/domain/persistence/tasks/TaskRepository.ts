export interface TaskRepository<T> {
  getAll(): Promise<T[]>;
  create(task: Partial<T>, operatorEmail: string, deviceName: string): Promise<T>;
  delete(publicId: string): Promise<T | null>;
  getTaskByPublicId(publicId: string): Promise<T | null>;
  update(publicId: string, updatedTask: Partial<T>): Promise<T | null>;
};