import { injectable, inject } from "tsyringe";
import { Device } from "@prisma/client";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";
import { DeviceEntity } from "@/src/infrastructure/entities/devices/DeviceEntity";
import { CreateDeviceDTO, UpdateDeviceDTO } from "@/src/infrastructure/api/dtos/devices/device.dto";

@injectable()
class DeviceService {
  constructor(
    @inject("DeviceRepository") private deviceRepository: DeviceRepository
  ) { }

  async getAll(): Promise<DeviceEntity[]> {
    const devices = await this.deviceRepository.getAll();
    return devices.map<DeviceEntity>(device => new DeviceEntity({
      ...device
    }));
  }

  async getByName(name: string): Promise<DeviceEntity | null> {
    const device = await this.deviceRepository.getByName(name);
    if (!device) return null;
    return new DeviceEntity({ ...device });
  }

  async delete(name: string): Promise<DeviceEntity | null> {
    try {
      const device: Device | null = await this.deviceRepository.delete(name);
      if (!device) {
        throw new Error("The device could not be deleted.");
      }
      return new DeviceEntity({ ...device });
    } catch (error) {
      console.error("Error deleting a device:", error);
      return null;
    }
  }

  async create(createDeviceDTO: CreateDeviceDTO): Promise<DeviceEntity> {
    try {
      const device: Device = await this.deviceRepository.create({ ...createDeviceDTO });
      return new DeviceEntity({ ...device });
    } catch (error) {
      console.error("Error creating a device:", error);
      throw error;
    }
  }

  async update(updateDeviceDTO: UpdateDeviceDTO): Promise<DeviceEntity | null> {
    try {
      const updatedDevice: Device | null = await this.deviceRepository.update(updateDeviceDTO.originalName, {
        originalName: updateDeviceDTO.originalName,
        name: updateDeviceDTO.name,
        ratedPower: updateDeviceDTO.ratedPower,
        installationDate: updateDeviceDTO.installationDate,
        observations: updateDeviceDTO.observations,
      });
      if (!updatedDevice) {
        throw new Error("The device could not be updated.");
      }
      return new DeviceEntity({ ...updatedDevice });
    } catch (error) {
      console.error("Error updating a device:", error);
      throw error;
    }
  }
}

export default DeviceService;
