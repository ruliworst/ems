import { injectable, inject } from "tsyringe";
import { EnergyConsumptionRecord } from "@prisma/client";
import { CreateEnergyConsumptionRecordDTO, GetEnergyConsumptionRecordBetweenDatesDTO } from "@/src/infrastructure/api/dtos/energy-consumption-records/energy-consumption-record.dto";
import type { EnergyConsumptionRecordRepository } from "../../persistence/energy-consumption-records/EnergyConsumptionRecordRepository";
import { EnergyConsumptionRecordEntity } from "@/src/infrastructure/entities/energy-consumption-records/EnergyConsumptionRecordEntity";
import DeviceService from "../devices/DeviceService";
import { DeviceEntity } from "@/src/infrastructure/entities/devices/DeviceEntity";
import * as crypto from "crypto";

@injectable()
export class EnergyConsumptionRecordService {
  constructor(
    @inject("EnergyConsumptionRecordRepository") private repository: EnergyConsumptionRecordRepository,
    @inject(DeviceService) private deviceService: DeviceService
  ) { }

  async getRecordByDeviceName(deviceName: string): Promise<EnergyConsumptionRecordEntity> {
    const device: DeviceEntity | null = await this.deviceService.getByName(deviceName);

    if (!device) throw new Error(`It was not possible to get a record from device with name: ${deviceName}`)

    const createEnergyConsumptionRecordDTO: CreateEnergyConsumptionRecordDTO = {
      recordDate: new Date().toISOString(),
      // TODO: Remove random values.
      quantity: crypto.randomInt(1, 101),
      price: (crypto.randomInt(1, 150) + 1) / 100,
      deviceId: device.id
    };

    return await this.create(createEnergyConsumptionRecordDTO);
  }

  async create(energyConsumptionRecordDTO: CreateEnergyConsumptionRecordDTO): Promise<EnergyConsumptionRecordEntity> {
    try {
      const createdRecord: EnergyConsumptionRecord = await this.repository.create(energyConsumptionRecordDTO);
      return this.mapToEntity(createdRecord);
    } catch (error) {
      console.error("Error creating an energy consumption record:", error);
      throw error;
    }
  };

  async getBetweenDates(dto: GetEnergyConsumptionRecordBetweenDatesDTO) {
    const { deviceId, startDate, endDate } = dto;
    try {
      const records: EnergyConsumptionRecord[] = await this.repository.getBetweenDates(deviceId, new Date(startDate), new Date(endDate));
      return records.map(this.mapToEntity);
    } catch (error) {
      console.error("Error getting energy consumption records:", error);
      throw error;
    }
  }

  protected mapToEntity(record: EnergyConsumptionRecord): EnergyConsumptionRecordEntity {
    return new EnergyConsumptionRecordEntity({ ...record });
  };
}