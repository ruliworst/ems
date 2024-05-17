import { Device } from "@prisma/client";

export interface DeviceRepository {
  getAll(): Promise<Device[]>;
}
