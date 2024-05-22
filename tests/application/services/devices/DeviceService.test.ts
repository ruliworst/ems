import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import prisma from "../../../../jest.setup";
import DeviceService from "@/application/services/DeviceService";
import { Device, Prisma, Status } from "@prisma/client";
import { DeviceDTO } from "@/dtos/devices/device.dto";

describe("DeviceService", () => {
  let deviceService: DeviceService;

  beforeAll(() => {
    deviceService = container.resolve(DeviceService);
  });

  it("should fetch all devices", async () => {
    // Arrange.
    const devicesToCreate: DeviceDTO[] = [
      {
        name: "MJDSFJ-1283-S",
        ratedPower: 100,
        installationDate: new Date().toDateString(),
        status: Status.IDLE,
        observations: "Observation 1",
        lastMaintenance: new Date().toDateString()
      },
      {
        name: "3224MDS-223MD",
        ratedPower: 200,
        installationDate: new Date().toDateString(),
        status: Status.RUNNING,
        observations: "Observation 2",
        lastMaintenance: new Date().toDateString()
      }
    ];

    const deviceCreateInputObjects: Prisma.DeviceCreateInput[] = deviceService.toDeviceCreateInputMany(devicesToCreate);
    await prisma.device.createMany({ data: deviceCreateInputObjects });

    // Act.
    const devices: DeviceDTO[] = await deviceService.getAll();

    // Assert.
    expect(devices).toContainEqual(devicesToCreate[0]);
    expect(devices).toContainEqual(devicesToCreate[1]);
  });

  it("should create a new device", async () => {
    // Arrange.
    const deviceDTO: DeviceDTO = {
      name: "MSKO34",
      ratedPower: 100,
      installationDate: new Date().toDateString(),
      status: Status.IDLE,
      observations: "Observation 1",
      lastMaintenance: new Date().toDateString(),
    };

    // Act.
    const createdDeviceDTO = await deviceService.create(deviceDTO);

    // Assert.
    expect(createdDeviceDTO).toMatchObject(deviceDTO);
    expect(createdDeviceDTO).toHaveProperty("name", deviceDTO.name);
    expect(createdDeviceDTO).toHaveProperty("ratedPower", deviceDTO.ratedPower);
    expect(createdDeviceDTO).toHaveProperty("installationDate", deviceDTO.installationDate);
    expect(createdDeviceDTO).toHaveProperty("status", deviceDTO.status);
    expect(createdDeviceDTO).toHaveProperty("observations", deviceDTO.observations);
    expect(createdDeviceDTO).toHaveProperty("lastMaintenance", deviceDTO.lastMaintenance);
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
          id: "1",
          name: "MASKSK23",
          ratedPower: 100,
          installationDate: new Date("Wed May 01 2024"),
          lastMaintenance: new Date("Fri May 10 2024"),
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          id: "2",
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

  describe("getByName", () => {
    it("should fetch a device by name successfully", async () => {
      // Arrange.
      const deviceDTO: DeviceDTO = {
        name: "KASOOWEL-231",
        ratedPower: 100,
        installationDate: new Date().toDateString(),
        status: Status.IDLE,
        observations: "Observation 1",
        lastMaintenance: new Date().toDateString(),
      };

      // Act.
      await deviceService.create(deviceDTO);

      // Act.
      const fetchedDevice = await deviceService.getByName(deviceDTO.name);

      // Assert.
      expect(fetchedDevice).toMatchObject(deviceDTO);
    });

    it("should return null if the device is not found", async () => {
      // Act.
      const fetchedDevice = await deviceService.getByName("NonExistentDevice");

      // Assert.
      expect(fetchedDevice).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete a device successfully", async () => {
      // Arrange.
      const deviceDTO: DeviceDTO = {
        name: "DeviceToDelete",
        ratedPower: 100,
        installationDate: new Date().toDateString(),
        status: Status.IDLE,
        observations: "Observation to delete",
        lastMaintenance: new Date().toDateString(),
      };

      await deviceService.create(deviceDTO);

      // Act.
      const deletedDeviceDTO = await deviceService.delete(deviceDTO.name);

      // Assert.
      expect(deletedDeviceDTO).toMatchObject(deviceDTO);
      const fetchedDevice = await prisma.device.findUnique({ where: { name: deviceDTO.name } });
      expect(fetchedDevice).toBeNull();
    });

    it("should throw an error when deleting a device that does not exist", async () => {
      // Act.
      const deletedDevice = await deviceService.delete("NonExistentDevice");

      // Assert.
      expect(deletedDevice).toBeNull();
    });
  });
});