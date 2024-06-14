import { injectable, inject } from "tsyringe";
import { EnergyConsumptionRecordService } from "../energy-consumption-records/EnergyConsumptionRecordService";
import { CompareConsumptionBetweenDevicesDTO, DevicesEnergyConsumptionRecordsDTO } from "@/src/infrastructure/api/dtos/analysis/analysis.dto";
import DeviceService from "../devices/DeviceService";
import { DeviceEntity } from "@/src/infrastructure/entities/devices/DeviceEntity";

@injectable()
export class AnalysisService {
  constructor(
    @inject(EnergyConsumptionRecordService) protected energyConsumptionRecordService: EnergyConsumptionRecordService,
    @inject(DeviceService) protected deviceService: DeviceService,
  ) { }

  async compareConsumptionBetweenDevices(dto: CompareConsumptionBetweenDevicesDTO): Promise<DevicesEnergyConsumptionRecordsDTO | null> {
    const firstDevice: DeviceEntity | null = await this.deviceService.getByName(dto.firstDeviceName);
    if (!firstDevice) return null;
    const secondDevice: DeviceEntity | null = await this.deviceService.getByName(dto.secondDeviceName);
    if (!secondDevice) return null;

    const firstDeviceEnergyConsumptionRecords = await this.energyConsumptionRecordService.getBetweenDates({
      deviceId: firstDevice.id,
      startDate: dto.startDate,
      endDate: dto.endDate
    });
    const secondDeviceEnergyConsumptionRecords = await this.energyConsumptionRecordService.getBetweenDates({
      deviceId: secondDevice.id,
      startDate: dto.startDate,
      endDate: dto.endDate
    });

    return {
      firstDeviceEnergyConsumptionRecords: firstDeviceEnergyConsumptionRecords.map(r => r.getDTO()),
      secondDeviceEnergyConsumptionRecords: secondDeviceEnergyConsumptionRecords.map(r => r.getDTO()),
    };
  };
};