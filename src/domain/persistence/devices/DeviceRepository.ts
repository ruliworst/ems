import { CreateDeviceDTO, UpdateDeviceDTO } from "@/src/infrastructure/api/dtos/devices/device.dto";
import { Device } from "@prisma/client";

export interface DeviceRepository {
  getAll(): Promise<Device[]>;
  getByName(name: string): Promise<Device | null>;
  create(device: CreateDeviceDTO): Promise<Device>;
  delete(name: string): Promise<Device | null>;
  update(originalName: string, updateData: UpdateDeviceDTO): Promise<Device | null>;
}
