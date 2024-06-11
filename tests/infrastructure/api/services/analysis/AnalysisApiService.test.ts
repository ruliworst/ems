import { AnalysisApiService } from "@/src/infrastructure/api/services/analysis/AnalysisApiService";

describe("AnalysisApiService", () => {
  describe("getRecordByDeviceName", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch and return energy consumption record", async () => {
      const deviceName = "device1";
      const mockData = {
        recordDate: "2024-06-11T22:00:00.000Z",
        quantity: 100,
        price: 2.50,
        deviceId: deviceName,
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
  });
});
