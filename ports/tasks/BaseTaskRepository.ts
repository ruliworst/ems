export interface BaseTaskRepository<T> {
  getAll(): Promise<T[]>;
}
