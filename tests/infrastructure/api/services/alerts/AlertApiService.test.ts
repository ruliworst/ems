import { AlertType, AlertViewDTO } from "@/src/infrastructure/api/dtos/alerts/alert.dto";
import { AlertApiService } from "@/src/infrastructure/api/services/alerts/AlertApiService";

global.fetch = jest.fn();

describe("AlertApiService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch all alerts by device name successfully", async () => {
    // Arrange
    const deviceName = "Device1";
    const mockAlerts: AlertViewDTO[] = [
      {
        message: "Test Alert 1",
        resolved: false,
        priority: "HIGH",
        publicId: "alert-1",
        type: AlertType.MAINTENANCE
      },
      {
        message: "Test Alert 2",
        resolved: true,
        priority: "LOW",
        publicId: "alert-2",
        type: AlertType.UNUSUAL_CONSUMPTION
      },
    ];

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockAlerts,
    });

    // Act
    const alerts = await AlertApiService.fetchAllByDeviceName(deviceName);

    // Assert
    expect(alerts).toEqual(mockAlerts);
    expect(fetch).toHaveBeenCalledWith(`/api/devices/${deviceName}/alerts`);
  });

  it("should throw an error when fetching alerts by device name fails", async () => {
    // Arrange
    const deviceName = "Device1";

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert
    await expect(AlertApiService.fetchAllByDeviceName(deviceName)).rejects.toThrow("Failed to fetch alerts");
    expect(fetch).toHaveBeenCalledWith(`/api/devices/${deviceName}/alerts`);
  });

  it("should resolve an alert successfully", async () => {
    // Arrange
    const deviceName = "Device1";
    const publicId = "alert-1";
    const resolvedAlert: AlertViewDTO = {
      message: "Test Alert 1",
      resolved: true,
      priority: "HIGH",
      publicId: "alert-1",
      type: AlertType.MAINTENANCE
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => resolvedAlert,
    });

    // Act
    const result = await AlertApiService.resolve(deviceName, publicId);

    // Assert
    expect(result).toEqual(resolvedAlert);
    expect(fetch).toHaveBeenCalledWith(`/api/devices/${deviceName}/alerts/${publicId}`, {
      method: "PATCH",
    });
  });

  it("should throw an error when resolving an alert fails", async () => {
    // Arrange
    const deviceName = "Device1";
    const publicId = "alert-1";

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert
    await expect(AlertApiService.resolve(deviceName, publicId)).rejects.toThrow("Failed to resolve alert");
    expect(fetch).toHaveBeenCalledWith(`/api/devices/${deviceName}/alerts/${publicId}`, {
      method: "PATCH",
    });
  });

  it("should delete an alert successfully", async () => {
    // Arrange
    const deviceName = "Device1";
    const publicId = "alert-1";
    const deletedAlert: AlertViewDTO = {
      message: "Test Alert 1",
      resolved: true,
      priority: "HIGH",
      publicId: "alert-1",
      type: AlertType.MAINTENANCE
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => deletedAlert,
    });

    // Act
    const result = await AlertApiService.delete(deviceName, publicId);

    // Assert
    expect(result).toEqual(deletedAlert);
    expect(fetch).toHaveBeenCalledWith(`/api/devices/${deviceName}/alerts/${publicId}`, {
      method: "DELETE",
    });
  });

  it("should throw an error when deleting an alert fails", async () => {
    // Arrange
    const deviceName = "Device1";
    const publicId = "alert-1";

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert
    await expect(AlertApiService.delete(deviceName, publicId)).rejects.toThrow("Failed to delete alert");
    expect(fetch).toHaveBeenCalledWith(`/api/devices/${deviceName}/alerts/${publicId}`, {
      method: "DELETE",
    });
  });
});
