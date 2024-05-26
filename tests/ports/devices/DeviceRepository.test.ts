import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { Prisma, PrismaClient, Status } from "@prisma/client";
import { DeviceRepository } from "@/ports/devices/DeviceRepository";


describe("DeviceRepository", () => {
  let deviceRepository: DeviceRepository;
  let prisma: PrismaClient = new PrismaClient();

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

  beforeAll(async () => {
    deviceRepository = container.resolve("DeviceRepository");
    await prisma.device.createMany({ data: devicesToCreate });
  });

  describe("read", () => {
    it("should fetch all devices", async () => {
      // Act.
      const devices = await deviceRepository.getAll();

      // Assert.
      expect(devices).toContainEqual({ id: expect.any(String), ...devicesToCreate[0] });
      expect(devices).toContainEqual({ id: expect.any(String), ...devicesToCreate[1] });
    });

    it("should fetch a device by name successfully", async () => {
      // Arrange.
      const deviceToCreate: Prisma.DeviceCreateInput = {
        name: "MKF32-223MD",
        ratedPower: 100,
        installationDate: new Date(),
        status: Status.RUNNING,
        observations: "Observation 3",
        lastMaintenance: new Date(),
      };

      await prisma.device.create({ data: deviceToCreate });

      // Act.
      const fetchedDevice = await deviceRepository.getByName(deviceToCreate.name);

      // Assert.
      expect(fetchedDevice).toMatchObject(deviceToCreate);
    });

    it("should return null if the device is not found", async () => {
      // Act.
      const fetchedDevice = await deviceRepository.getByName("NonExistentDevice");

      // Assert.
      expect(fetchedDevice).toBeNull();
    });
  });

  describe("create", () => {
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

  describe("delete", () => {
    it("should delete a device by name successfully", async () => {
      // Arrange.
      const deviceToCreate: Prisma.DeviceCreateInput = {
        name: "MKF32-223MD-Delete",
        ratedPower: 100,
        installationDate: new Date(),
        status: Status.RUNNING,
        observations: "Observation to delete",
        lastMaintenance: new Date(),
      };

      await prisma.device.create({ data: deviceToCreate });

      // Act.
      const deletedDevice = await deviceRepository.delete(deviceToCreate.name);

      // Assert.
      expect(deletedDevice).toMatchObject(deviceToCreate);
      const fetchedDevice = await prisma.device.findUnique({ where: { name: deviceToCreate.name } });
      expect(fetchedDevice).toBeNull();
    });

    it("should return null when trying to delete a non-existent device", async () => {
      // Act.
      const result = await deviceRepository.delete("NonExistentDevice");

      // Assert.
      expect(result).toBeNull();
    });
  });
});
