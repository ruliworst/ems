import { CreateAlertDTO } from "@/src/infrastructure/api/dtos/alerts/alert.dto";

export interface AlertRepository<T> {
  getAllByDeviceName(deviceName: string): Promise<T[] | null>;
  resolve(publicId: string): Promise<T | null>;
  delete(publicId: string): Promise<T | null>;
  create(createAlertDTO: CreateAlertDTO): Promise<T>;
};