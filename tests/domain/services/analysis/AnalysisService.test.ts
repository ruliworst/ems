import "reflect-metadata";
import { container } from "tsyringe";
import { DeviceEntity } from "@/src/infrastructure/entities/devices/DeviceEntity";
import { EnergyConsumptionRecordDTO } from "@/src/infrastructure/api/dtos/energy-consumption-records/energy-consumption-record.dto";
import { AnalysisService } from "@/src/domain/services/analysis/AnalysisService";
import DeviceService from "@/src/domain/services/devices/DeviceService";
import { EnergyConsumptionRecordService } from "@/src/domain/services/energy-consumption-records/EnergyConsumptionRecordService";
import { CompareConsumptionBetweenDevicesDTO } from "@/src/infrastructure/api/dtos/analysis/analysis.dto";
import { EnergyConsumptionRecordEntity } from "@/src/infrastructure/entities/energy-consumption-records/EnergyConsumptionRecordEntity";
import { v4 as uuidv4 } from 'uuid';

describe("AnalysisService", () => {
  let analysisService: AnalysisService;
  let energyConsumptionRecordService: jest.Mocked<EnergyConsumptionRecordService>;
  let deviceService: jest.Mocked<DeviceService>;

  const mockDevices: DeviceEntity[] = [
    { id: "1", name: "Device1" } as DeviceEntity,
    { id: "2", name: "Device2" } as DeviceEntity,
  ];

  const mockEnergyConsumptionRecords1: EnergyConsumptionRecordEntity[] = [
    new EnergyConsumptionRecordEntity({
      id: uuidv4(),
      recordDate: new Date("2024-06-01T10:00:00.000Z"),
      quantity: 10,
      price: 5,
      deviceId: "1",
      anomaliesReportId: null,
      consumptionReportId: null
    }),
    new EnergyConsumptionRecordEntity({
      id: uuidv4(),
      recordDate: new Date("2024-06-02T10:00:00.000Z"),
      quantity: 17,
      price: 2,
      deviceId: "1",
      anomaliesReportId: null,
      consumptionReportId: null
    }),
  ];

  const mockEnergyConsumptionRecords2: EnergyConsumptionRecordEntity[] = [
    new EnergyConsumptionRecordEntity({
      id: uuidv4(),
      recordDate: new Date("2024-06-01T10:00:00.000Z"),
      quantity: 20,
      price: 10,
      deviceId: "123456",
      anomaliesReportId: null,
      consumptionReportId: null
    }),
    new EnergyConsumptionRecordEntity({
      id: uuidv4(),
      recordDate: new Date("2024-06-02T10:00:00.000Z"),
      quantity: 25,
      price: 15,
      deviceId: "123456",
      anomaliesReportId: null,
      consumptionReportId: null
    }),
  ];

  beforeEach(() => {
    energyConsumptionRecordService = {
      getBetweenDates: jest.fn()
        .mockImplementationOnce(() => Promise.resolve(mockEnergyConsumptionRecords1))
        .mockImplementationOnce(() => Promise.resolve(mockEnergyConsumptionRecords2)),
    } as unknown as jest.Mocked<EnergyConsumptionRecordService>;

    deviceService = {
      getByName: jest.fn().mockImplementation((name: string) =>
        mockDevices.find(device => device.name === name) || null),
    } as unknown as jest.Mocked<DeviceService>;

    container.registerInstance(EnergyConsumptionRecordService, energyConsumptionRecordService);
    container.registerInstance(DeviceService, deviceService);

    analysisService = container.resolve(AnalysisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return null if the first device is not found", async () => {
    deviceService.getByName.mockResolvedValueOnce(null);

    const dto: CompareConsumptionBetweenDevicesDTO = {
      firstDeviceName: "Device1",
      secondDeviceName: "Device2",
      startDate: "2024-06-01T00:00:00.000Z",
      endDate: "2024-06-02T00:00:00.000Z",
    };

    const result = await analysisService.compareConsumptionBetweenDevices(dto);

    expect(result).toBeNull();
    expect(deviceService.getByName).toHaveBeenCalledWith("Device1");
  });

  it("should return null if the second device is not found", async () => {
    deviceService.getByName.mockResolvedValueOnce(mockDevices[0]);
    deviceService.getByName.mockResolvedValueOnce(null);

    const dto: CompareConsumptionBetweenDevicesDTO = {
      firstDeviceName: "Device1",
      secondDeviceName: "Device2",
      startDate: "2024-06-01T00:00:00.000Z",
      endDate: "2024-06-02T00:00:00.000Z",
    };

    const result = await analysisService.compareConsumptionBetweenDevices(dto);

    expect(result).toBeNull();
    expect(deviceService.getByName).toHaveBeenCalledWith("Device2");
  });

  it("should return energy consumption records for both devices", async () => {
    deviceService.getByName.mockResolvedValueOnce(mockDevices[0]);
    deviceService.getByName.mockResolvedValueOnce(mockDevices[1]);

    const dto: CompareConsumptionBetweenDevicesDTO = {
      firstDeviceName: "Device1",
      secondDeviceName: "Device2",
      startDate: "2024-06-01T00:00:00.000Z",
      endDate: "2024-06-02T00:00:00.000Z",
    };

    const result = await analysisService.compareConsumptionBetweenDevices(dto);

    expect(result).toEqual({
      firstDeviceEnergyConsumptionRecords: mockEnergyConsumptionRecords1.map(r => r.getDTO()),
      secondDeviceEnergyConsumptionRecords: mockEnergyConsumptionRecords2.map(r => r.getDTO()),
    });

    expect(deviceService.getByName).toHaveBeenCalledWith("Device1");
    expect(deviceService.getByName).toHaveBeenCalledWith("Device2");
    expect(energyConsumptionRecordService.getBetweenDates).toHaveBeenCalledWith({
      deviceId: mockDevices[0].id,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });
    expect(energyConsumptionRecordService.getBetweenDates).toHaveBeenCalledWith({
      deviceId: mockDevices[1].id,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });
  });
});
