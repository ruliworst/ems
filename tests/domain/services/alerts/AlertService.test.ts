import { AlertService } from "@/src/domain/services/alerts/AlertService";
import { AlertRepository } from "@/src/domain/persistence/alerts/AlertRepository";

interface MockAlert {
  id: string;
  message: string;
  resolved: boolean;
  priority: string;
  deviceId: string;
  operatorId: string | null;
  supervisorId: string | null;
  publicId: string;
}

interface MockAlertEntity {
  id: string;
  message: string;
  resolved: boolean;
  priority: string;
  deviceId: string;
  operatorId: string | null;
  supervisorId: string | null;
  publicId: string;
  getView: () => any;
}

class MockAlertService extends AlertService<MockAlert, MockAlertEntity> {
  protected mapToEntity(alert: MockAlert): MockAlertEntity {
    return {
      ...alert,
      getView: () => ({
        message: alert.message,
        resolved: alert.resolved,
        priority: alert.priority,
      }),
    };
  }
}

describe("AlertService", () => {
  let mockAlertRepository: jest.Mocked<AlertRepository<MockAlert>>;
  let mockAlertService: MockAlertService;

  beforeEach(() => {
    mockAlertRepository = {
      getAllByDeviceName: jest.fn(),
      resolve: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AlertRepository<MockAlert>>;

    mockAlertService = new MockAlertService(mockAlertRepository);
  });

  describe("getAllByDeviceName", () => {
    it("should return alerts mapped to entities for a given device name", async () => {
      const mockDeviceName = "Device1";
      const mockAlerts: MockAlert[] = [
        {
          id: "alert-1",
          message: "Test Alert 1",
          resolved: false,
          priority: "HIGH",
          deviceId: "device-1",
          operatorId: "operator-1",
          supervisorId: null,
          publicId: "public-1",
        },
      ];
      const expectedEntities = mockAlerts.map(alert => ({
        ...alert,
        getView: expect.any(Function),
      }));

      mockAlertRepository.getAllByDeviceName.mockResolvedValue(mockAlerts);

      const result = await mockAlertService.getAllByDeviceName(mockDeviceName);

      expect(mockAlertRepository.getAllByDeviceName).toHaveBeenCalledWith(mockDeviceName);
      expect(result).toEqual(expectedEntities);
    });

    it("should return null if no alerts are found", async () => {
      const mockDeviceName = "Device1";

      mockAlertRepository.getAllByDeviceName.mockResolvedValue(null);

      const result = await mockAlertService.getAllByDeviceName(mockDeviceName);

      expect(mockAlertRepository.getAllByDeviceName).toHaveBeenCalledWith(mockDeviceName);
      expect(result).toBeNull();
    });

    it("should handle errors and return null", async () => {
      const mockDeviceName = "Device1";

      mockAlertRepository.getAllByDeviceName.mockRejectedValue(new Error("Error"));

      const result = await mockAlertService.getAllByDeviceName(mockDeviceName);

      expect(mockAlertRepository.getAllByDeviceName).toHaveBeenCalledWith(mockDeviceName);
      expect(result).toBeNull();
    });
  });

  describe("resolve", () => {
    it("should resolve an alert by publicId and map to entity", async () => {
      const mockPublicId = "public-1";
      const mockAlert: MockAlert = {
        id: "alert-1",
        message: "Test Alert 1",
        resolved: false,
        priority: "HIGH",
        deviceId: "device-1",
        operatorId: "operator-1",
        supervisorId: null,
        publicId: "public-1",
      };
      const expectedEntity = {
        ...mockAlert,
        getView: expect.any(Function),
      };

      mockAlertRepository.resolve.mockResolvedValue(mockAlert);

      const result = await mockAlertService.resolve(mockPublicId);

      expect(mockAlertRepository.resolve).toHaveBeenCalledWith(mockPublicId);
      expect(result).toEqual(expectedEntity);
    });

    it("should return null if the alert is not found", async () => {
      const mockPublicId = "public-1";

      mockAlertRepository.resolve.mockResolvedValue(null);

      const result = await mockAlertService.resolve(mockPublicId);

      expect(mockAlertRepository.resolve).toHaveBeenCalledWith(mockPublicId);
      expect(result).toBeNull();
    });

    it("should handle errors and return null", async () => {
      const mockPublicId = "public-1";

      mockAlertRepository.resolve.mockRejectedValue(new Error("Error"));

      const result = await mockAlertService.resolve(mockPublicId);

      expect(mockAlertRepository.resolve).toHaveBeenCalledWith(mockPublicId);
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an alert by publicId and map to entity", async () => {
      const mockPublicId = "public-1";
      const mockAlert: MockAlert = {
        id: "alert-1",
        message: "Test Alert 1",
        resolved: false,
        priority: "HIGH",
        deviceId: "device-1",
        operatorId: "operator-1",
        supervisorId: null,
        publicId: "public-1",
      };
      const expectedEntity = {
        ...mockAlert,
        getView: expect.any(Function),
      };

      mockAlertRepository.delete.mockResolvedValue(mockAlert);

      const result = await mockAlertService.delete(mockPublicId);

      expect(mockAlertRepository.delete).toHaveBeenCalledWith(mockPublicId);
      expect(result).toEqual(expectedEntity);
    });

    it("should return null if the alert is not found", async () => {
      const mockPublicId = "public-1";

      mockAlertRepository.delete.mockResolvedValue(null);

      const result = await mockAlertService.delete(mockPublicId);

      expect(mockAlertRepository.delete).toHaveBeenCalledWith(mockPublicId);
      expect(result).toBeNull();
    });

    it("should handle errors and return null", async () => {
      const mockPublicId = "public-1";

      mockAlertRepository.delete.mockRejectedValue(new Error("Error"));

      const result = await mockAlertService.delete(mockPublicId);

      expect(mockAlertRepository.delete).toHaveBeenCalledWith(mockPublicId);
      expect(result).toBeNull();
    });
  });
});
