import { injectable, inject } from "tsyringe";
import { EnergyConsumptionRecord } from "@prisma/client";
import { CreateEnergyConsumptionRecordDTO, GetEnergyConsumptionRecordBetweenDatesDTO } from "@/src/infrastructure/api/dtos/energy-consumption-records/energy-consumption-record.dto";
import type { EnergyConsumptionRecordRepository } from "../../persistence/energy-consumption-records/EnergyConsumptionRecordRepository";
import { EnergyConsumptionRecordEntity } from "@/src/infrastructure/entities/energy-consumption-records/EnergyConsumptionRecordEntity";

@injectable()
export class EnergyConsumptionRecordService {
  constructor(
    @inject("EnergyConsumptionRecordRepository") private repository: EnergyConsumptionRecordRepository
  ) { }

  async create(energyConsumptionRecordDTO: CreateEnergyConsumptionRecordDTO): Promise<EnergyConsumptionRecord> {
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