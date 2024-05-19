import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import prisma from "../../jest.setup";
import { Prisma, Status } from "@prisma/client";
import { DeviceRepository } from "@/ports/DeviceRepository";


describe("DeviceRepository", () => {
  let deviceRepository: DeviceRepository;

  beforeAll(() => {
    deviceRepository = container.resolve("DeviceRepository");
  });

  it("should fetch all devices", async () => {
    // Arrange.
    const devicesToCreate: Prisma.DeviceCreateInput[] = [
      {
        name: "MKR4353-223MD",
        ratedPower: 100,
        installationDate: new Date(),
        status: Status.IDLE,
        observations: "Observation 1",
        lastMaintenance: new Date()
      },
      {
        name: "MKR32432-223MD",
        ratedPower: 200,
        installationDate: new Date(),
        status: Status.RUNNING,
        observations: "Observation 2",
        lastMaintenance: new Date()
      }
    ];

    await prisma.device.createMany({ data: devicesToCreate });

    // Act.
    const devices = await deviceRepository.getAll();

    // Assert.
    expect(devices).toContainEqual({ id: expect.any(String), ...devicesToCreate[0] });
    expect(devices).toContainEqual({ id: expect.any(String), ...devicesToCreate[1] });
  });

  it("should create a new device", async () => {
    // Arrange.
    const deviceToCreate: Prisma.DeviceCreateInput = {
      name: "MK342858-223MD",
      ratedPower: 100,
      installationDate: new Date(),
      status: Status.IDLE,
      observations: "Observation 1",
      lastMaintenance: new Date(),
    };

    // Act.
    const createdDevice = await deviceRepository.create(deviceToCreate);

    // Assert.
    expect(createdDevice).toMatchObject(deviceToCreate);
    expect(createdDevice).toHaveProperty("id");
    expect(typeof createdDevice.id).toBe("string");

    const foundDevice = await prisma.device.findUnique({ where: { id: createdDevice.id } });
    expect(foundDevice).not.toBeNull();
    expect(foundDevice).toMatchObject(deviceToCreate);
  });
});
