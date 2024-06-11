import { EnergyConsumptionRecordDTO } from "../../dtos/energy-consumption-records/energy-consumption-record.dto";

export class AnalysisApiService {
  static async getRecordByDeviceName(deviceName: string): Promise<EnergyConsumptionRecordDTO> {
    const response = await fetch(`/api/devices/${deviceName}/monitorize`);
    if (!response.ok) {
      throw new Error('Failed to fetch energy consumption record');
    }
    return response.json();
  }
}