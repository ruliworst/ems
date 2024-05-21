import { Device, Prisma } from "@prisma/client";

export interface DeviceRepository {
  getAll(): Promise<Device[]>;
  getByName(name: string): Promise<Device | null>;
  create(device: Prisma.DeviceCreateInput): Promise<Device>;
}
