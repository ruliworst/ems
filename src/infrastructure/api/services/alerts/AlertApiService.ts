import { AlertViewDTO } from "../../dtos/alerts/alert.dto";

export class AlertApiService {
  static async fetchAllByDeviceName(deviceName: string): Promise<AlertViewDTO[]> {
    const response = await fetch(`/api/devices/${deviceName}/alerts`);
    if (!response.ok) {
      throw new Error('Failed to fetch alerts');
    }
    return response.json();
  }

  static async resolve(deviceName: string, publicId: string): Promise<AlertViewDTO> {
    const response = await fetch(`/api/devices/${deviceName}/alerts/${publicId}`, {
      method: "PATCH",
    });
    if (!response.ok) {
      throw new Error('Failed to resolve alert');
    }
    return response.json();
  }

  static async delete(deviceName: string, publicId: string): Promise<AlertViewDTO> {
    const response = await fetch(`/api/devices/${deviceName}/alerts/${publicId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error('Failed to delete alert');
    }
    return response.json();
  }
}
