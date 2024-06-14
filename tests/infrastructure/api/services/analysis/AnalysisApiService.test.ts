import { CompareConsumptionBetweenDevicesDTO } from "@/src/infrastructure/api/dtos/analysis/analysis.dto";
import { EnergyConsumptionRecordDTO } from "@/src/infrastructure/api/dtos/energy-consumption-records/energy-consumption-record.dto";
import { AnalysisApiService } from "@/src/infrastructure/api/services/analysis/AnalysisApiService";

describe("AnalysisApiService", () => {
  describe("getRecordByDeviceName", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch and return energy consumption record", async () => {
      const deviceName = "device1";
      const mockData: EnergyConsumptionRecordDTO = {
        recordDate: "2024-06-11T22:00:00.000Z",
        quantity: 100,
        price: 2.50,
      };

      const mockFetchPromise = Promise.resolve(new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
      }));

      jest.spyOn(global, 'fetch').mockReturnValue(mockFetchPromise);

      const result = await AnalysisApiService.getRecordByDeviceName(deviceName);

      expect(fetch).toHaveBeenCalledWith(`/api/devices/${deviceName}/monitorize`);
      expect(result).toEqual(mockData);
    });

    it("should throw an error if fetch fails", async () => {
      const deviceName = "device1";

      const mockFetchPromise = Promise.resolve(new Response(null, {
        status: 500,
        statusText: "Internal Server Error"
      }));

      jest.spyOn(global, 'fetch').mockReturnValue(mockFetchPromise);

      await expect(AnalysisApiService.getRecordByDeviceName(deviceName)).rejects.toThrow('Failed to fetch energy consumption record');
    });
  });

  describe("compareConsumptionBetweenDevices", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch and return comparison data", async () => {
      const dto: CompareConsumptionBetweenDevicesDTO = {
        firstDeviceName: "device1",
        secondDeviceName: "device2",
        startDate: "2024-06-01T00:00:00.000Z",
        endDate: "2024-06-02T00:00:00.000Z",
      };

      const mockData = {
        firstDeviceEnergyConsumptionRecords: [
          {
            recordDate: "2024-06-01T10:00:00.000Z",
            quantity: 10,
            price: 5,
            deviceId: "device1",
          }
        ],
        secondDeviceEnergyConsumptionRecords: [
          {
            recordDate: "2024-06-01T10:00:00.000Z",
            quantity: 20,
            price: 10,
            deviceId: "device2",
          }
        ]
      };

      const mockFetchPromise = Promise.resolve(new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
      }));

      jest.spyOn(global, 'fetch').mockReturnValue(mockFetchPromise);

      const result = await AnalysisApiService.compareConsumptionBetweenDevices(dto);

      expect(fetch).toHaveBeenCalledWith(`/api/analysis/compare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
      expect(result).toEqual(mockData);
    });

    it("should throw an error if fetch fails", async () => {
      const dto: CompareConsumptionBetweenDevicesDTO = {
        firstDeviceName: "device1",
        secondDeviceName: "device2",
        startDate: "2024-06-01T00:00:00.000Z",
        endDate: "2024-06-02T00:00:00.000Z",
      };

      const mockFetchPromise = Promise.resolve(new Response(null, {
        status: 500,
        statusText: "Internal Server Error"
      }));

      jest.spyOn(global, 'fetch').mockReturnValue(mockFetchPromise);

      await expect(AnalysisApiService.compareConsumptionBetweenDevices(dto)).rejects.toThrow('Failed to fetch comparison data');
    });
  });
});
