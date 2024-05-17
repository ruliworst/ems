import { injectable, inject } from "tsyringe";
import { Device, Prisma } from "@prisma/client";
import { DeviceDTO } from "@/dtos/device.dto";
import type { DeviceRepository } from "@/ports/DeviceRepository";

@injectable()
class DeviceService {
  constructor(
    @inject("DeviceRepository") private deviceRepository: DeviceRepository
  ) { }

  async getAll(): Promise<DeviceDTO[]> {
    const devices = await this.deviceRepository.getAll();

    return devices.map<DeviceDTO>(device => ({
      name: device.name,
      ratedPower: device.ratedPower,
      installationDate: device.installationDate.toDateString(),
      lastMaintenance: device.lastMaintenance?.toDateString(),
      observations: device.observations,
      status: device.status
    }));
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
      installationDate: device.installationDate.toISOString(),
      lastMaintenance: device.lastMaintenance?.toISOString(),
      observations: device.observations,
      status: device.status
    };
  }
}

export default DeviceService;
