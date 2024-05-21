import { DeviceApiService } from "@/adapters/services/DeviceApiService";
import { DeviceDTO } from "@/dtos/device.dto";

global.fetch = jest.fn();

describe("DeviceApiService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch devices successfully", async () => {
    // Arrange.
    const mockDevices: DeviceDTO[] = [
      {
        name: "MKASL323",
        ratedPower: 100,
        installationDate: "Sat Jun 01 2024",
        lastMaintenance: "Mon Jun 10 2024",
        observations: "First device, performing well.",
        status: "RUNNING",
      },
      {
        name: "MKASL32334",
        ratedPower: 200,
        installationDate: "Sat Jun 01 2024",
        lastMaintenance: "Mon Jun 10 2024",
        observations: "Second device, requires maintenance.",
        status: "IDLE",
      },
    ];

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockDevices,
    });

    // Act.
    const devices = await DeviceApiService.fetchAll();

    // Assert.
    expect(devices).toEqual(mockDevices);
    expect(fetch).toHaveBeenCalledWith("/api/devices");
  });

  it("should throw an error when fetching devices fails", async () => {
    // Arrange.
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert.
    await expect(DeviceApiService.fetchAll()).rejects.toThrow("Failed to fetch devices");
    expect(fetch).toHaveBeenCalledWith("/api/devices");
  });

  it("should throw an error when fetching devices fails", async () => {
    // Arrange.
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert.
    await expect(DeviceApiService.fetchAll()).rejects.toThrow("Failed to fetch devices");
    expect(fetch).toHaveBeenCalledWith("/api/devices");
  });

  it("should create a device successfully", async () => {
    // Arrange.
    const deviceToCreate: DeviceDTO = {
      name: "MAKSLSL3223",
      ratedPower: 100,
      installationDate: "Sat Jun 01 2024",
      lastMaintenance: "Mon Jun 10 2024",
      observations: "First device, performing well.",
      status: "RUNNING",
    };

    const createdDevice: DeviceDTO = { ...deviceToCreate };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => createdDevice,
    });

    // Act.
    const result = await DeviceApiService.create(deviceToCreate);

    // Assert.
    expect(result).toEqual(createdDevice);
    expect(fetch).toHaveBeenCalledWith("/api/devices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deviceToCreate),
    });
  });

  it("should throw an error when creating a device fails", async () => {
    // Arrange.
    const deviceToCreate: DeviceDTO = {
      name: "OQPWPE-32",
      ratedPower: 100,
      installationDate: "Sat Jun 01 2024",
      lastMaintenance: "Mon Jun 10 2024",
      observations: "First device, performing well.",
      status: "RUNNING",
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert.
    await expect(DeviceApiService.create(deviceToCreate)).rejects.toThrow("Failed to create device");
    expect(fetch).toHaveBeenCalledWith("/api/devices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deviceToCreate),
    });
  });

  it("should fetch a device by name successfully", async () => {
    // Arrange.
    const deviceName = "MAKS-DLS-23";
    const mockDevice: DeviceDTO = {
      name: "MAKS-DLS-23",
      ratedPower: 100,
      installationDate: "Sat Jun 01 2024",
      lastMaintenance: "Mon Jun 10 2024",
      observations: "First device, performing well.",
      status: "RUNNING",
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockDevice,
    });

    // Act.
    const device = await DeviceApiService.fetchByName(deviceName);

    // Assert.
    expect(device).toEqual(mockDevice);
    expect(fetch).toHaveBeenCalledWith(`/api/devices/${deviceName}`);
  });

  it("should throw an error when fetching a device by name fails", async () => {
    // Arrange.
    const deviceName = "NonExistentDevice";

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert.
    await expect(DeviceApiService.fetchByName(deviceName)).rejects.toThrow(`Failed to fetch device with name ${deviceName}`);
    expect(fetch).toHaveBeenCalledWith(`/api/devices/${deviceName}`);
  });
});
