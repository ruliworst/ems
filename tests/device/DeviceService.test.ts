import "reflect-metadata";
import "../../config/container";
import { container } from "tsyringe";
import prisma from "../../jest.setup";
import DeviceService from "@/application/services/DeviceService";
import { Device, Prisma, Status } from "@prisma/client";
import { DeviceDTO } from "@/dtos/device.dto";
import PrismaDeviceRepository from "@/infrastructure/repositories/PrismaDeviceRepository";

describe("DeviceService", () => {
  let deviceService: DeviceService;

  beforeAll(() => {
    deviceService = container.resolve(DeviceService);
  });

  it("should fetch all devices", async () => {
    // Arrange.
    const devicesToCreate: DeviceDTO[] = [
      {
        name: "Device 1",
        ratedPower: 100,
        installationDate: new Date().toDateString(),
        status: Status.IDLE,
        observations: "Observation 1",
        lastMaintenance: new Date().toDateString()
      },
      {
        name: "Device 2",
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

  describe("toDeviceCreateInputMany", () => {
    it("should convert an array of DeviceDTOs to an array of Prisma.DeviceCreateInput", () => {
      const deviceDTOs: DeviceDTO[] = [
        {
          name: "Device 1",
          ratedPower: 100,
          installationDate: "2024-05-01T10:00:00.000Z",
          lastMaintenance: "2024-05-10T10:00:00.000Z",
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          name: "Device 2",
          ratedPower: 200,
          installationDate: "2024-06-01T10:00:00.000Z",
          lastMaintenance: "2024-06-10T10:00:00.000Z",
          observations: "Second device, requires maintenance.",
          status: Status.IDLE,
        }
      ];

      const expected: Prisma.DeviceCreateInput[] = [
        {
          name: "Device 1",
          ratedPower: 100,
          installationDate: new Date("2024-05-01T10:00:00.000Z"),
          lastMaintenance: new Date("2024-05-10T10:00:00.000Z"),
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          name: "Device 2",
          ratedPower: 200,
          installationDate: new Date("2024-06-01T10:00:00.000Z"),
          lastMaintenance: new Date("2024-06-10T10:00:00.000Z"),
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
          name: "Device 1",
          ratedPower: 100,
          installationDate: new Date("2024-05-01T10:00:00.000Z"),
          lastMaintenance: new Date("2024-05-10T10:00:00.000Z"),
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          id: "2",
          name: "Device 2",
          ratedPower: 200,
          installationDate: new Date("2024-06-01T10:00:00.000Z"),
          lastMaintenance: new Date("2024-06-10T10:00:00.000Z"),
          observations: "Second device, requires maintenance.",
          status: Status.IDLE,
        }
      ];

      const expected: DeviceDTO[] = [
        {
          name: "Device 1",
          ratedPower: 100,
          installationDate: "2024-05-01T10:00:00.000Z",
          lastMaintenance: "2024-05-10T10:00:00.000Z",
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          name: "Device 2",
          ratedPower: 200,
          installationDate: "2024-06-01T10:00:00.000Z",
          lastMaintenance: "2024-06-10T10:00:00.000Z",
          observations: "Second device, requires maintenance.",
          status: Status.IDLE,
        }
      ];

      const result = deviceService.toDeviceDtoMany(devices);
      expect(result).toEqual(expected);
    });
  });
});