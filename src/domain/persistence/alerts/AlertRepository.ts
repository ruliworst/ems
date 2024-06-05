export interface AlertRepository<T> {
  getAllByDeviceName(deviceName: string): Promise<T[] | null>;
  resolve(publicId: string): Promise<T | null>;
};