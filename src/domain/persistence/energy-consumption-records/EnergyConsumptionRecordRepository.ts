import { CreateEnergyConsumptionRecordDTO } from "@/src/infrastructure/api/dtos/energy-consumption-records/energy-consumption-record.dto";
import { EnergyConsumptionRecord } from "@prisma/client";

export interface EnergyConsumptionRecordRepository {
  getBetweenDates(deviceId: string, startDate: Date, endDate: Date): Promise<EnergyConsumptionRecord[]>;
  create(energyConsumptionRecord: CreateEnergyConsumptionRecordDTO): Promise<EnergyConsumptionRecord>;
};