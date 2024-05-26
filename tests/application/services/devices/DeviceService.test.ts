import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { DeviceRepository } from "@/ports/devices/DeviceRepository";
import DeviceService from "@/application/services/devices/DeviceService";
import { DeviceDTO } from "@/dtos/devices/device.dto";
import { Device, Prisma, Status } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

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
      installationDate: "Wed May 01 2024",
      status: Status.IDLE,
      observations: "Observation 1",
      lastMaintenance: "Wed May 01 2024"
    },
    {
      name: "Device 2",
      ratedPower: 200,
      installationDate: "Wed May 01 2024",
      status: Status.RUNNING,
      observations: "Observation 2",
      lastMaintenance: "Wed May 01 2024"
    }
  ];

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
      })
    } as unknown as jest.Mocked<DeviceRepository>;

    container.registerInstance("DeviceRepository", deviceRepository);
    deviceService = container.resolve(DeviceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch all devices", async () => {
    const devices = await deviceService.getAll();
    expect(devices).toEqual(mockDeviceDTOs);
    expect(deviceRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it("should create a new device", async () => {
    const deviceDTO: DeviceDTO = {
      name: "Device 1",
      ratedPower: 100,
      installationDate: "Wed May 01 2024",
      status: Status.IDLE,
      observations: "Observation 1",
      lastMaintenance: "Wed May 01 2024"
    };

    const createdDeviceDTO = await deviceService.create(deviceDTO);
    expect(createdDeviceDTO).toMatchObject(deviceDTO);
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
      const deviceName = "Device 2";
      const expectedDevice = mockDeviceDTOs[1];
      const fetchedDevice = await deviceService.getByName(deviceName);
      expect(fetchedDevice).toMatchObject(expectedDevice!);
    });

    it("should return null if the device is not found", async () => {
      const deviceName = "NonExistentDevice";
      const fetchedDevice = await deviceService.getByName(deviceName);
      expect(fetchedDevice).toBeNull();
    });
  });


  describe("toDeviceCreateInputMany", () => {
    it("should convert an array of DeviceDTOs to an array of Prisma.DeviceCreateInput", () => {
      const deviceDTOs: DeviceDTO[] = [
        {
          name: "MASKSK32-12",
          ratedPower: 100,
          installationDate: "Wed May 01 2024",
          lastMaintenance: "Fri May 10 2024",
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          name: "MLSLS-234",
          ratedPower: 200,
          installationDate: "Sat Jun 01 2024",
          lastMaintenance: "Mon Jun 10 2024",
          observations: "Second device, requires maintenance.",
          status: Status.IDLE,
        }
      ];

      const expected: Prisma.DeviceCreateInput[] = [
        {
          name: "MASKSK32-12",
          ratedPower: 100,
          installationDate: new Date("Wed May 01 2024"),
          lastMaintenance: new Date("Fri May 10 2024"),
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          name: "MLSLS-234",
          ratedPower: 200,
          installationDate: new Date("Sat Jun 01 2024"),
          lastMaintenance: new Date("Mon Jun 10 2024"),
          observations: "Second device, requires maintenance.",
          status: Status.IDLE,
        }
      ];

      const result = deviceService.toDeviceCreateInputMany(deviceDTOs);
      expect(result).toEqual(expected);
    });
  });

  describe("toDeviceDtoMany", () => {
    it("should convert an array of Devices to an array of DeviceDTOs", () => {
      const devices: Device[] = [
        {
          id: uuidv4(),
          name: "MASKSK23",
          ratedPower: 100,
          installationDate: new Date("Wed May 01 2024"),
          lastMaintenance: new Date("Fri May 10 2024"),
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          id: uuidv4(),
          name: "mSKOP32",
          ratedPower: 200,
          installationDate: new Date("Sat Jun 01 2024"),
          lastMaintenance: new Date("Mon Jun 10 2024"),
          observations: "Second device, requires maintenance.",
          status: Status.IDLE,
        }
      ];

      const expected: DeviceDTO[] = [
        {
          name: "MASKSK23",
          ratedPower: 100,
          installationDate: "Wed May 01 2024",
          lastMaintenance: "Fri May 10 2024",
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          name: "mSKOP32",
          ratedPower: 200,
          installationDate: "Sat Jun 01 2024",
          lastMaintenance: "Mon Jun 10 2024",
          observations: "Second device, requires maintenance.",
          status: Status.IDLE,
        }
      ];

      const result = deviceService.toDeviceDtoMany(devices);
      expect(result).toEqual(expected);
    });
  });
});
