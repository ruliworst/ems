import { DeviceDTO } from "@/dtos/device.dto";

export class DeviceApiService {
  static async fetchAll(): Promise<DeviceDTO[]> {
    const response = await fetch('/api/devices');
    if (!response.ok) {
      throw new Error('Failed to fetch devices');
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
}
