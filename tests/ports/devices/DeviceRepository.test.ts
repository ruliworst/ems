import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { Device, Prisma, PrismaClient, Status } from "@prisma/client";
import { DeviceRepository } from "@/ports/devices/DeviceRepository";
import { CreateDeviceDTO, UpdateDeviceDTO } from "@/dtos/devices/device.dto";


describe("DeviceRepository", () => {
  let deviceRepository: DeviceRepository;
  let prisma: PrismaClient = new PrismaClient();

  const devicesToCreate: CreateDeviceDTO[] = [
    {
      name: "MKR4353-223MD",
      ratedPower: 100,
      installationDate: "2024-05-01T10:00:00.000Z",
      lastMaintenance: "2024-05-01T10:00:00.000Z",
      status: Status.IDLE,
      observations: "Observation 1",
    },
    {
      name: "MKR32432-223MD",
      ratedPower: 200,
      installationDate: "2024-05-01T10:00:00.000Z",
      lastMaintenance: "2024-05-01T10:00:00.000Z",
      status: Status.RUNNING,
      observations: "Observation 2",
    }
  ];

  beforeAll(async () => {
    deviceRepository = container.resolve("DeviceRepository");
    await prisma.device.createMany({ data: devicesToCreate });
  });

  describe("read", () => {
    it("should fetch all devices", async () => {
      // Act.
      const devices: Device[] = await deviceRepository.getAll();

      // Assert.
      expect(devices).toContainEqual({
        id: expect.any(String),
        ...devicesToCreate[0],
        installationDate: new Date(devicesToCreate[0]["installationDate"]),
        lastMaintenance: new Date(devicesToCreate[0]["lastMaintenance"]!),
      });
      expect(devices).toContainEqual({
        id: expect.any(String),
        ...devicesToCreate[1],
        installationDate: new Date(devicesToCreate[1]["installationDate"]),
        lastMaintenance: new Date(devicesToCreate[1]["lastMaintenance"]!)
      });
    });

    it("should fetch a device by name successfully", async () => {
      // Act.
      const fetchedDevice: Device | null = await deviceRepository.getByName(devicesToCreate[0].name);

      // Assert.
      expect(fetchedDevice).toMatchObject({
        id: expect.any(String),
        ...devicesToCreate[0],
        installationDate: new Date(devicesToCreate[0]["installationDate"]),
        lastMaintenance: new Date(devicesToCreate[0]["lastMaintenance"]!),
      });
    });

    it("should return null if the device is not found", async () => {
      // Act.
      const fetchedDevice: Device | null = await deviceRepository.getByName("NonExistentDevice");

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
      const deviceToCreate: CreateDeviceDTO = {
        name: "MKF32-223MD-Delete",
        ratedPower: 100,
        installationDate: "2024-05-01T10:00:00.000Z",
        lastMaintenance: "2024-05-01T10:00:00.000Z",
        status: Status.RUNNING,
        observations: "Observation to delete",
      };

      await prisma.device.create({ data: deviceToCreate });

      // Act.
      const deletedDevice: Device | null = await deviceRepository.delete(deviceToCreate.name);

      // Assert.
      expect(deletedDevice).toMatchObject({
        id: expect.any(String),
        ...deviceToCreate,
        installationDate: new Date(deviceToCreate["installationDate"]),
        lastMaintenance: new Date(deviceToCreate["lastMaintenance"]!),
      });
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

  describe("update", () => {
    it("should update a device successfully", async () => {
      const updateDeviceDTO: UpdateDeviceDTO = {
        originalName: "MKR4353-223MD",
        name: "Updated-MKR4353-223MD",
        ratedPower: 150,
        installationDate: "2024-06-01T10:00:00.000Z",
        observations: "Updated Observation",
      };

      const updatedDevice: Device | null = await deviceRepository.update(updateDeviceDTO.originalName, updateDeviceDTO);
      const fetchedDevice: Device | null = await deviceRepository.getByName("Updated-MKR4353-223MD");
      expect(fetchedDevice).toMatchObject({ ...updatedDevice });
    });

    it("should return null if the device to update is not found", async () => {
      const updateDeviceDTO: UpdateDeviceDTO = {
        originalName: "NonExistentDevice",
        name: "Updated Device",
        ratedPower: 150,
        installationDate: "2024-06-01T10:00:00.000Z",
        observations: "Updated Observation",
      };

      const updatedDevice = await deviceRepository.update(updateDeviceDTO.originalName, updateDeviceDTO);
      expect(updatedDevice).toBeNull();
    });

    it("should throw an error if the device name is empty", async () => {
      const updateDeviceDTO: UpdateDeviceDTO = {
        originalName: "MKR4353-223MD",
        name: "",
        ratedPower: 150,
        installationDate: "2024-06-01T10:00:00.000Z",
        observations: "Updated Observation",
      };

      await expect(deviceRepository.update(updateDeviceDTO.originalName, updateDeviceDTO)).rejects.toThrow("It was not possible to update the Device because the name cannot be empty.");
    });
  });
});
