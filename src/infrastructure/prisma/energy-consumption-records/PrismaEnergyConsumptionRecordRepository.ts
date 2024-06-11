import "@/config/container";
import { EnergyConsumptionRecord, PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import PrismaRepository from "../PrismaRepository";
import { EnergyConsumptionRecordRepository } from "@/src/domain/persistence/energy-consumption-records/EnergyConsumptionRecordRepository";
import { CreateEnergyConsumptionRecordDTO } from "../../api/dtos/energy-consumption-records/energy-consumption-record.dto";

@injectable()
export default class PrismaEnergyConsumptionRecordRepository extends PrismaRepository implements EnergyConsumptionRecordRepository {
  constructor(
    @inject(PrismaClient) protected prismaClient: PrismaClient,
  ) {
    super(prismaClient);
  }

  async getBetweenDates(deviceId: string, startDate: Date, endDate: Date): Promise<EnergyConsumptionRecord[]> {
    try {
      const records = await this.prismaClient.energyConsumptionRecord.findMany({
        where: {
          deviceId,
          recordDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return records;
    } catch (error) {
      console.error("Error fetching energy consumption records:", error);
      throw new Error("Could not fetch energy consumption records");
    } finally {
      this.disconnect();
    }
  }

  async create(energyConsumptionRecord: CreateEnergyConsumptionRecordDTO): Promise<EnergyConsumptionRecord> {
    try {
      await this.connect();
      return this.prismaClient.energyConsumptionRecord.create({
        data: {
          ...energyConsumptionRecord,
          recordDate: new Date(energyConsumptionRecord.recordDate)
        }
      });
    } finally {
      this.disconnect();
    }
  }
}