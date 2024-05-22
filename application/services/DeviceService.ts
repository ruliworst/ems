import { injectable, inject } from "tsyringe";
import { Device, Prisma } from "@prisma/client";
import { DeviceDTO } from "@/dtos/devices/device.dto";
import type { DeviceRepository } from "@/ports/devices/DeviceRepository";

@injectable()
class DeviceService {
  constructor(
    @inject("DeviceRepository") private deviceRepository: DeviceRepository
  ) { }

  async getAll(): Promise<DeviceDTO[]> {
    const devices = await this.deviceRepository.getAll();
    return this.toDeviceDtoMany(devices);
  }

  async getByName(name: string): Promise<DeviceDTO | null> {
    const device = await this.deviceRepository.getByName(name);
    if (!device) return null;
    return this.toDeviceDTO(device);
  }

  async delete(name: string): Promise<DeviceDTO | null> {
    try {
      const device: Device | null = await this.deviceRepository.delete(name);
      if (!device) {
        throw new Error("The device could not be deleted.");
      }
      return this.toDeviceDTO(device);
    } catch (error) {
      console.error("Error deleting a device:", error);
      return null;
    }
  }

  async create(deviceDTO: DeviceDTO): Promise<DeviceDTO> {
    const deviceToCreate = this.toDeviceCreateInput(deviceDTO);
    try {
      const device: Device = await this.deviceRepository.create(deviceToCreate);
      return this.toDeviceDTO(device);
    } catch (error) {
      console.error("Error creating a device:", error);
      throw error;
    }
  }

  toDeviceCreateInputMany(deviceDTOs: DeviceDTO[]): Prisma.DeviceCreateInput[] {
    return deviceDTOs.map(deviceDTO => this.toDeviceCreateInput(deviceDTO));
  }

  toDeviceCreateInput(deviceDTO: DeviceDTO): Prisma.DeviceCreateInput {
    return {
      name: deviceDTO.name,
      ratedPower: deviceDTO.ratedPower,
      installationDate: new Date(deviceDTO.installationDate),
      lastMaintenance: deviceDTO.lastMaintenance ? new Date(deviceDTO.lastMaintenance) : null,
      observations: deviceDTO.observations,
      status: deviceDTO.status,
    };
  }

  toDeviceDtoMany(devices: Device[]): DeviceDTO[] {
    return devices.map(device => this.toDeviceDTO(device));
  }

  toDeviceDTO(device: Device): DeviceDTO {
    return {
      name: device.name,
      ratedPower: device.ratedPower,
      installationDate: device.installationDate.toDateString(),
      lastMaintenance: device.lastMaintenance?.toDateString(),
      observations: device.observations,
      status: device.status
    };
  }
}

export default DeviceService;
