import { Device, Prisma } from "@prisma/client";

export interface DeviceRepository {
  getAll(): Promise<Device[]>;
  create(device: Prisma.DeviceCreateInput): Promise<Device>;
}
