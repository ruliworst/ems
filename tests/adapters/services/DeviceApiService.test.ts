import { DeviceApiService } from "@/adapters/services/DeviceApiService";
import { DeviceDTO } from "@/dtos/device.dto";

global.fetch = jest.fn();

describe('DeviceApiService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch devices successfully', async () => {
    // Arrange.
    const mockDevices: DeviceDTO[] = [
      {
        name: 'Device 1',
        ratedPower: 100,
        installationDate: '2024-05-01T10:00:00.000Z',
        lastMaintenance: '2024-05-10T10:00:00.000Z',
        observations: 'First device, performing well.',
        status: 'RUNNING',
      },
      {
        name: 'Device 2',
        ratedPower: 200,
        installationDate: '2024-06-01T10:00:00.000Z',
        lastMaintenance: '2024-06-10T10:00:00.000Z',
        observations: 'Second device, requires maintenance.',
        status: 'IDLE',
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
    expect(fetch).toHaveBeenCalledWith('/api/devices');
  });

  it('should throw an error when fetching devices fails', async () => {
    // Arrange.
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert.
    await expect(DeviceApiService.fetchAll()).rejects.toThrow('Failed to fetch devices');
    expect(fetch).toHaveBeenCalledWith('/api/devices');
  });

  it('should throw an error when fetching devices fails', async () => {
    // Arrange.
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert.
    await expect(DeviceApiService.fetchAll()).rejects.toThrow('Failed to fetch devices');
    expect(fetch).toHaveBeenCalledWith('/api/devices');
  });

  it('should create a device successfully', async () => {
    // Arrange.
    const deviceToCreate: DeviceDTO = {
      name: 'Device 1',
      ratedPower: 100,
      installationDate: '2024-05-01T10:00:00.000Z',
      lastMaintenance: '2024-05-10T10:00:00.000Z',
      observations: 'First device, performing well.',
      status: 'RUNNING',
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
    expect(fetch).toHaveBeenCalledWith('/api/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deviceToCreate),
    });
  });

  it('should throw an error when creating a device fails', async () => {
    // Arrange.
    const deviceToCreate: DeviceDTO = {
      name: 'Device 1',
      ratedPower: 100,
      installationDate: '2024-05-01T10:00:00.000Z',
      lastMaintenance: '2024-05-10T10:00:00.000Z',
      observations: 'First device, performing well.',
      status: 'RUNNING',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert.
    await expect(DeviceApiService.create(deviceToCreate)).rejects.toThrow('Failed to create device');
    expect(fetch).toHaveBeenCalledWith('/api/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deviceToCreate),
    });
  });
});
