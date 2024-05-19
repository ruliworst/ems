import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import prisma from "../../../jest.setup";
import DeviceService from "@/application/services/DeviceService";
import { Device, Prisma, Status } from "@prisma/client";
import { DeviceDTO } from "@/dtos/device.dto";

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
      installationDate: new Date().toISOString(),
      status: Status.IDLE,
      observations: "Observation 1",
      lastMaintenance: new Date().toISOString(),
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
          installationDate: "2024-05-01T10:00:00.000Z",
          lastMaintenance: "2024-05-10T10:00:00.000Z",
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          name: "MLSLS-234",
          ratedPower: 200,
          installationDate: "2024-06-01T10:00:00.000Z",
          lastMaintenance: "2024-06-10T10:00:00.000Z",
          observations: "Second device, requires maintenance.",
          status: Status.IDLE,
        }
      ];

      const expected: Prisma.DeviceCreateInput[] = [
        {
          name: "MASKSK32-12",
          ratedPower: 100,
          installationDate: new Date("2024-05-01T10:00:00.000Z"),
          lastMaintenance: new Date("2024-05-10T10:00:00.000Z"),
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          name: "MLSLS-234",
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
          name: "MASKSK23",
          ratedPower: 100,
          installationDate: new Date("2024-05-01T10:00:00.000Z"),
          lastMaintenance: new Date("2024-05-10T10:00:00.000Z"),
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          id: "2",
          name: "mSKOP32",
          ratedPower: 200,
          installationDate: new Date("2024-06-01T10:00:00.000Z"),
          lastMaintenance: new Date("2024-06-10T10:00:00.000Z"),
          observations: "Second device, requires maintenance.",
          status: Status.IDLE,
        }
      ];

      const expected: DeviceDTO[] = [
        {
          name: "MASKSK23",
          ratedPower: 100,
          installationDate: "2024-05-01T10:00:00.000Z",
          lastMaintenance: "2024-05-10T10:00:00.000Z",
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          name: "mSKOP32",
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