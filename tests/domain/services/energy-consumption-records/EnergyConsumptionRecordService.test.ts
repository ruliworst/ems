import "reflect-metadata";
import { container } from "tsyringe";
import { EnergyConsumptionRecord } from "@prisma/client";
import { mockDeep, mockReset } from 'jest-mock-extended';
import { EnergyConsumptionRecordService } from '@/src/domain/services/energy-consumption-records/EnergyConsumptionRecordService';
import { EnergyConsumptionRecordRepository } from '@/src/domain/persistence/energy-consumption-records/EnergyConsumptionRecordRepository';
import { CreateEnergyConsumptionRecordDTO, GetEnergyConsumptionRecordBetweenDatesDTO } from '@/src/infrastructure/api/dtos/energy-consumption-records/energy-consumption-record.dto';
import { EnergyConsumptionRecordEntity } from '@/src/infrastructure/entities/energy-consumption-records/EnergyConsumptionRecordEntity';

const mockRepository = mockDeep<EnergyConsumptionRecordRepository>();

describe('EnergyConsumptionRecordService', () => {
  let service: EnergyConsumptionRecordService;

  beforeEach(() => {
    mockReset(mockRepository);
    container.registerInstance("EnergyConsumptionRecordRepository", mockRepository);
    service = container.resolve(EnergyConsumptionRecordService);
  });

  describe('create', () => {
    it('should create a new energy consumption record', async () => {
      const createDTO: CreateEnergyConsumptionRecordDTO = {
        recordDate: "2024-05-01T10:00:00.000Z",
        quantity: 100,
        price: 200,
        deviceId: 'device-123',
      };
      const createdRecord: EnergyConsumptionRecord = {
        ...createDTO,
        id: 'record-1',
        consumptionReportId: null,
        anomaliesReportId: null,
        recordDate: new Date(createDTO.recordDate)
      };

      mockRepository.create.mockResolvedValue(createdRecord);

      const result = await service.create(createDTO);

      expect(result).toEqual(new EnergyConsumptionRecordEntity(createdRecord));
      expect(mockRepository.create).toHaveBeenCalledWith(createDTO);
    });

    it('should throw an error if creating record fails', async () => {
      const createDTO: CreateEnergyConsumptionRecordDTO = {
        recordDate: "2024-05-01T10:00:00.000Z",
        quantity: 100,
        price: 200,
        deviceId: 'device-123',
      };

      mockRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDTO)).rejects.toThrow('Database error');
    });
  });

  describe('getBetweenDates', () => {
    it('should return energy consumption records between the specified dates', async () => {
      const dto: GetEnergyConsumptionRecordBetweenDatesDTO = {
        deviceId: 'device-123',
        startDate: "2024-04-01T10:00:00.000Z",
        endDate: "2024-06-01T10:00:00.000Z",
      };
      const records: EnergyConsumptionRecord[] = [
        {
          id: 'record-1',
          recordDate: new Date('"2024-05-01T10:00:00.000Z"'),
          quantity: 100,
          price: 200,
          deviceId: 'device-123',
          consumptionReportId: null,
          anomaliesReportId: null
        },
      ];

      mockRepository.getBetweenDates.mockResolvedValue(records);

      const result = await service.getBetweenDates(dto);

      expect(result).toEqual(records.map(record => new EnergyConsumptionRecordEntity(record)));
      expect(mockRepository.getBetweenDates).toHaveBeenCalledWith(dto.deviceId, new Date(dto.startDate), new Date(dto.endDate));
    });

    it('should throw an error if fetching records fails', async () => {
      const dto: GetEnergyConsumptionRecordBetweenDatesDTO = {
        deviceId: 'device-123',
        startDate: "2024-04-01T10:00:00.000Z",
        endDate: "2024-06-01T10:00:00.000Z",
      };

      mockRepository.getBetweenDates.mockRejectedValue(new Error('Database error'));

      await expect(service.getBetweenDates(dto)).rejects.toThrow('Database error');
    });
  });
});
