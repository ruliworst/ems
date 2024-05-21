import { DeviceDTO } from "@/dtos/device.dto";

export class DeviceApiService {
  static async fetchAll(): Promise<DeviceDTO[]> {
    const response = await fetch('/api/devices');
    if (!response.ok) {
      throw new Error('Failed to fetch devices');
    }
    return response.json();
  }

  static async fetchByName(name: string): Promise<DeviceDTO> {
    const response = await fetch(`/api/devices/${name}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch device with name ${name}`);
    }
    return response.json();
  }

  static async create(device: DeviceDTO): Promise<DeviceDTO> {
    const response = await fetch('/api/devices', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(device),
    });
    if (!response.ok) {
      throw new Error('Failed to create device');
    }
    return response.json();
  }

  static async delete(name: string): Promise<DeviceDTO> {
    const response = await fetch(`/api/devices/${name}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete device with name ${name}`);
    }
    return response.json();
  }
}
