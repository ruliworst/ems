import { CompareConsumptionBetweenDevicesDTO } from "../../dtos/analysis/analysis.dto";
import { EnergyConsumptionRecordDTO } from "../../dtos/energy-consumption-records/energy-consumption-record.dto";

export class AnalysisApiService {
  static async getRecordByDeviceName(deviceName: string): Promise<EnergyConsumptionRecordDTO> {
    const response = await fetch(`/api/devices/${deviceName}/monitorize`);
    if (!response.ok) {
      throw new Error('Failed to fetch energy consumption record');
    }
    return response.json();
  };

  static async compareConsumptionBetweenDevices(dto: CompareConsumptionBetweenDevicesDTO) {
    const response = await fetch(`/api/analysis/compare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch comparison data');
    }
    return response.json();
  }
}