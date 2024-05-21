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

  it("should create a new device", async () => {
    // Arrange.
    const deviceDTO: DeviceDTO = {
      name: "Device 1",
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
          name: "Device 1",
          ratedPower: 100,
          installationDate: "Wed May 01 2024",
          lastMaintenance: "Fri May 10 2024",
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          name: "Device 2",
          ratedPower: 200,
          installationDate: "Sat Jun 01 2024",
          lastMaintenance: "Mon Jun 10 2024",
          observations: "Second device, requires maintenance.",
          status: Status.IDLE,
        }
      ];

      const expected: Prisma.DeviceCreateInput[] = [
        {
          name: "Device 1",
          ratedPower: 100,
          installationDate: new Date("Wed May 01 2024"),
          lastMaintenance: new Date("Fri May 10 2024"),
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          name: "Device 2",
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
          name: "Device 1",
          ratedPower: 100,
          installationDate: new Date("Wed May 01 2024"),
          lastMaintenance: new Date("Fri May 10 2024"),
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          id: "2",
          name: "Device 2",
          ratedPower: 200,
          installationDate: new Date("Sat Jun 01 2024"),
          lastMaintenance: new Date("Mon Jun 10 2024"),
          observations: "Second device, requires maintenance.",
          status: Status.IDLE,
        }
      ];

      const expected: DeviceDTO[] = [
        {
          name: "Device 1",
          ratedPower: 100,
          installationDate: "Wed May 01 2024",
          lastMaintenance: "Fri May 10 2024",
          observations: "First device, performing well.",
          status: Status.RUNNING,
        },
        {
          name: "Device 2",
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