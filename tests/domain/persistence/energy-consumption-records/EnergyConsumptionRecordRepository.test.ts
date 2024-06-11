import "reflect-metadata";
import "@/config/container";
import { PrismaClient, EnergyConsumptionRecord } from "@prisma/client";
import { mockReset, DeepMockProxy } from 'jest-mock-extended';
import { CreateEnergyConsumptionRecordDTO } from '@/src/infrastructure/api/dtos/energy-consumption-records/energy-consumption-record.dto';
import PrismaEnergyConsumptionRecordRepository from "@/src/infrastructure/prisma/energy-consumption-records/PrismaEnergyConsumptionRecordRepository";


jest.mock('@prisma/client', () => {
  const mockPrisma = jest.requireActual('jest-mock-extended').mockDeep();
  return {
    PrismaClient: jest.fn(() => mockPrisma)
  };
});

const mockPrismaClient = new PrismaClient() as unknown as DeepMockProxy<PrismaClient>;

describe('PrismaEnergyConsumptionRecordRepository', () => {
  let repository: PrismaEnergyConsumptionRecordRepository;

  beforeEach(() => {
    mockReset(mockPrismaClient);
    repository = new PrismaEnergyConsumptionRecordRepository(mockPrismaClient);
  });

  describe('getBetweenDates', () => {
    it('should return energy consumption records between the specified dates', async () => {
      const deviceId = 'device-123';
      const startDate = new Date("2024-04-01T10:00:00.000Z");
      const endDate = new Date("2024-06-01T10:00:00.000Z");
      const expectedRecords: EnergyConsumptionRecord[] = [
        {
          id: 'record-1',
          recordDate: new Date("2024-05-01T10:00:00.000Z"),
          quantity: 100,
          price: 200,
          deviceId: 'device-123',
          consumptionReportId: null,
          anomaliesReportId: null
        },
      ];

      mockPrismaClient.energyConsumptionRecord.findMany.mockResolvedValue(expectedRecords);

      const records = await repository.getBetweenDates(deviceId, startDate, endDate);

      expect(records).toEqual(expectedRecords);
      expect(mockPrismaClient.energyConsumptionRecord.findMany).toHaveBeenCalledWith({
        where: {
          deviceId,
          recordDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
    });

    it('should throw an error if fetching records fails', async () => {
      const deviceId = 'device-123';
      const startDate = new Date("2024-04-01T10:00:00.000Z");
      const endDate = new Date("2024-06-01T10:00:00.000Z");

      mockPrismaClient.energyConsumptionRecord.findMany.mockRejectedValue(new Error('Could not fetch energy consumption records'));

      await expect(repository.getBetweenDates(deviceId, startDate, endDate)).rejects.toThrow('Could not fetch energy consumption records');
    });
  });

  describe('create', () => {
    it('should create a new energy consumption record', async () => {
      const newRecord: CreateEnergyConsumptionRecordDTO = {
        recordDate: "2024-05-01T10:00:00.000Z",
        quantity: 100,
        price: 200,
        deviceId: 'device-123',
      };
      const expectedRecord: EnergyConsumptionRecord = {
        ...newRecord,
        id: 'record-1',
        consumptionReportId: null,
        anomaliesReportId: null,
        recordDate: new Date(newRecord.recordDate)
      };

      mockPrismaClient.energyConsumptionRecord.create.mockResolvedValue(expectedRecord);

      const createdRecord = await repository.create(newRecord);

      expect(createdRecord).toEqual(expectedRecord);
      expect(mockPrismaClient.energyConsumptionRecord.create).toHaveBeenCalledWith({
        data: {
          ...newRecord,
          recordDate: new Date(newRecord.recordDate)
        }
      });
    });

    it('should throw an error if creating record fails', async () => {
      const newRecord: CreateEnergyConsumptionRecordDTO = {
        recordDate: "2024-05-01T10:00:00.000Z",
        quantity: 100,
        price: 200,
        deviceId: 'device-123',
      };

      mockPrismaClient.energyConsumptionRecord.create.mockRejectedValue(new Error('Could not create energy consumption record'));

      await expect(repository.create(newRecord)).rejects.toThrow('Could not create energy consumption record');
    });
  });
});
