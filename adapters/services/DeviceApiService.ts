import { DeviceDTO } from "@/dtos/device.dto";

export class DeviceApiService {
  static async fetchAll(): Promise<DeviceDTO[]> {
    const response = await fetch('/api/devices');
    if (!response.ok) {
      throw new Error('Failed to fetch devices');
    }
    return response.json();
  }
}
