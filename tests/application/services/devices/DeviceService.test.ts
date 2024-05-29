import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { DeviceRepository } from "@/ports/devices/DeviceRepository";
import DeviceService from "@/application/services/devices/DeviceService";
import { CreateDeviceDTO, DeviceDTO, UpdateDeviceDTO } from "@/dtos/devices/device.dto";
import { Device, Status } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { DeviceEntity } from "@/domain/model/Device";

describe("DeviceService", () => {
  let deviceService: DeviceService;
  let deviceRepository: jest.Mocked<DeviceRepository>;

  const mockDevices: Device[] = [
    {
      id: uuidv4(),
      name: "Device 1",
      ratedPower: 100,
      installationDate: new Date("2024-05-01T10:00:00.000Z"),
      status: Status.IDLE,
      observations: "Observation 1",
      lastMaintenance: new Date("2024-05-01T10:00:00.000Z")
    },
    {
      id: uuidv4(),
      name: "Device 2",
      ratedPower: 200,
      installationDate: new Date("2024-05-01T10:00:00.000Z"),
      status: Status.RUNNING,
      observations: "Observation 2",
      lastMaintenance: new Date("2024-05-01T10:00:00.000Z")
    }
  ];

  const mockDeviceDTOs: DeviceDTO[] = [
    {
      name: "Device 1",
      ratedPower: 100,
      installationDate: "2024-05-01T10:00:00.000Z",
      lastMaintenance: "2024-05-01T10:00:00.000Z",
      status: Status.IDLE,
      observations: "Observation 1",
      currentPower: 10
    },
    {
      name: "Device 2",
      ratedPower: 200,
      installationDate: "2024-05-01T10:00:00.000Z",
      lastMaintenance: "2024-05-01T10:00:00.000Z",
      status: Status.RUNNING,
      observations: "Observation 2",
      currentPower: 100
    }
  ];

  const expectedUpdatedDevice = {
    ...mockDevices[0],
    name: "Updated Device 1",
    ratedPower: 150,
    installationDate: "2024-06-01T10:00:00.000Z",
    observations: "Updated Observation 1",
  }

  beforeEach(() => {
    deviceRepository = {
      getAll: jest.fn().mockResolvedValue(mockDevices),
      create: jest.fn().mockResolvedValue(mockDevices[0]),
      getByName: jest.fn().mockImplementation((name: string) =>
        mockDevices.find(device => device.name === name) || null),
      delete: jest.fn().mockImplementation((name: string) => {
        const index = mockDevices.findIndex(device => device.name === name);
        if (index === -1) return null;
        return mockDevices.splice(index, 1)[0];
      }),
      update: jest.fn().mockResolvedValue(expectedUpdatedDevice),
    } as unknown as jest.Mocked<DeviceRepository>;

    container.registerInstance("DeviceRepository", deviceRepository);
    deviceService = container.resolve(DeviceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch all devices", async () => {
    const devices: DeviceEntity[] = await deviceService.getAll();
    expect(devices.length).toBe(2);
    expect(deviceRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it("should create a new device", async () => {
    const createDeviceDTO: CreateDeviceDTO = {
      name: "Device 1",
      ratedPower: 100,
      installationDate: "2024-05-01T10:00:00.000Z",
      lastMaintenance: "2024-05-01T10:00:00.000Z",
      status: Status.IDLE,
      observations: "Observation 1",
    };

    const deviceEntity: DeviceEntity = await deviceService.create(createDeviceDTO);
    expect(deviceEntity).toMatchObject({
      ...createDeviceDTO,
      installationDate: new Date(mockDeviceDTOs[0]["installationDate"]),
      lastMaintenance: new Date(mockDeviceDTOs[0]["lastMaintenance"]!),
    });
  });

  describe("delete", () => {
    it("should delete a device successfully", async () => {
      const deviceName = "Device 1";
      const deletedDeviceDTO = await deviceService.delete(deviceName);
      expect(deletedDeviceDTO).toMatchObject({ name: deviceName });
      const fetchedDevice = await deviceService.getByName(deviceName);
      expect(fetchedDevice).toBeNull();
    });

    it("should throw an error when deleting a device that does not exist", async () => {
      const deviceName = "NonExistentDevice";
      const deletedDevice = await deviceService.delete(deviceName);
      expect(deletedDevice).toBeNull();
    });
  });

  describe("getByName", () => {
    it("should fetch a device by name successfully", async () => {
      const expectedDevice: Device = mockDevices[0];
      const fetchedDevice: DeviceEntity | null = await deviceService.getByName(expectedDevice.name);
      expect(fetchedDevice).toMatchObject(expectedDevice!);
    });

    it("should return null if the device is not found", async () => {
      const deviceName = "NonExistentDevice";
      const fetchedDevice = await deviceService.getByName(deviceName);
      expect(fetchedDevice).toBeNull();
    });
  });

  describe("update", () => {
    it("update a device successfully", async () => {
      const updateDeviceDTO: UpdateDeviceDTO = {
        originalName: "Device 1",
        name: "Updated Device 1",
        ratedPower: 150,
        installationDate: "2024-06-01T10:00:00.000Z",
        observations: "Updated Observation 1",
      };

      const updatedDevice: DeviceEntity | null = await deviceService.update(updateDeviceDTO);

      expect(updatedDevice).toMatchObject(expectedUpdatedDevice);
    });
  });
});
