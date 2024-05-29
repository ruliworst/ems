import { UpdateDeviceDTO } from "@/dtos/devices/device.dto";
import { Device, Prisma } from "@prisma/client";

export interface DeviceRepository {
  getAll(): Promise<Device[]>;
  getByName(name: string): Promise<Device | null>;
  create(device: Prisma.DeviceCreateInput): Promise<Device>;
  delete(name: string): Promise<Device | null>;
  update(originalName: string, updateData: UpdateDeviceDTO): Promise<Device | null>;
}
