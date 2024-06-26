import { DeviceDTO, CreateDeviceDTO, UpdateDeviceDTO } from "@/src/infrastructure/api/dtos/devices/device.dto";
import { DeviceApiService } from "@/src/infrastructure/api/services/devices/DeviceApiService";
import { Status } from "@prisma/client";

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
        installationDate: "2024-05-01T10:00:00.000Z",
        lastMaintenance: "2024-05-01T10:00:00.000Z",
        observations: "First device, performing well.",
        status: Status.RUNNING,
        currentPower: 50
      },
      {
        name: "MKASL32334",
        ratedPower: 200,
        installationDate: "2024-05-01T10:00:00.000Z",
        lastMaintenance: "2024-05-01T10:00:00.000Z",
        observations: "Second device, requires maintenance.",
        status: Status.IDLE,
        currentPower: 20
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

  it("should create a device successfully", async () => {
    // Arrange.
    const deviceToCreate: CreateDeviceDTO = {
      name: "MAKSLSL3223",
      ratedPower: 100,
      installationDate: "2024-05-01T10:00:00.000Z",
      lastMaintenance: "2024-05-01T10:00:00.000Z",
      observations: "First device, performing well.",
      status: Status.RUNNING,
    };

    const createdDevice: DeviceDTO = { ...deviceToCreate, currentPower: 50, status: deviceToCreate.status! };

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
    const deviceToCreate: CreateDeviceDTO = {
      name: "OQPWPE-32",
      ratedPower: 100,
      installationDate: "2024-05-01T10:00:00.000Z",
      lastMaintenance: "2024-05-01T10:00:00.000Z",
      observations: "First device, performing well.",
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
      installationDate: "2024-05-01T10:00:00.000Z",
      lastMaintenance: "2024-05-01T10:00:00.000Z",
      observations: "First device, performing well.",
      status: Status.RUNNING,
      currentPower: 50
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

  it('should delete a device successfully', async () => {
    // Arrange.
    const deviceName = 'KASDM-32929';

    const deletedDevice: DeviceDTO = {
      name: 'KASDM-32929',
      ratedPower: 100,
      installationDate: "2024-05-01T10:00:00.000Z",
      lastMaintenance: "2024-05-01T10:00:00.000Z",
      observations: 'First device, performing well.',
      status: Status.RUNNING,
      currentPower: 50
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => deletedDevice,
    });

    // Act.
    const result = await DeviceApiService.delete(deviceName);

    // Assert.
    expect(result).toEqual(deletedDevice);
    expect(fetch).toHaveBeenCalledWith(`/api/devices/${deviceName}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should throw an error when deleting a device fails', async () => {
    // Arrange.
    const deviceName = 'NotDefinedName';

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert.
    await expect(DeviceApiService.delete(deviceName)).rejects.toThrow('Failed to delete device');
    expect(fetch).toHaveBeenCalledWith(`/api/devices/${deviceName}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  // Tests for the patch method.
  it('should update a device successfully', async () => {
    // Arrange.
    const updateDeviceDTO: UpdateDeviceDTO = {
      originalName: 'MKASL323',
      name: 'UpdatedDeviceName',
      ratedPower: 150,
      installationDate: '2024-05-01T10:00:00.000Z',
      observations: 'Updated observations',
      lastMaintenance: '2024-05-01T10:00:00.000Z',
    };

    const updatedDevice: DeviceDTO = {
      name: 'UpdatedDeviceName',
      ratedPower: 150,
      installationDate: '2024-05-01T10:00:00.000Z',
      lastMaintenance: '2024-05-01T10:00:00.000Z',
      status: Status.RUNNING,
      observations: 'Updated observations',
      currentPower: 75,
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => updatedDevice,
    });

    // Act.
    const result = await DeviceApiService.patch(updateDeviceDTO);

    // Assert.
    expect(result).toEqual(updatedDevice);
    expect(fetch).toHaveBeenCalledWith(`/api/devices/${updateDeviceDTO.originalName}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateDeviceDTO),
    });
  });

  it('should throw an error when updating a device fails', async () => {
    // Arrange.
    const updateDeviceDTO: UpdateDeviceDTO = {
      originalName: 'MKASL323',
      name: 'UpdatedDeviceName',
      ratedPower: 150,
      installationDate: '2024-05-01T10:00:00.000Z',
      observations: 'Updated observations',
      lastMaintenance: '2024-05-01T10:00:00.000Z',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert.
    await expect(DeviceApiService.patch(updateDeviceDTO)).rejects.toThrow('Failed to update device with name MKASL323');
    expect(fetch).toHaveBeenCalledWith(`/api/devices/${updateDeviceDTO.originalName}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateDeviceDTO),
    });
  });
});
