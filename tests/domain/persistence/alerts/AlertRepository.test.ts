import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { PrismaClient, MaintenanceAlert, UnusualConsumptionAlert, Priority, Device, Status } from "@prisma/client";
import PrismaAlertRepository from "@/src/infrastructure/prisma/alerts/PrismaAlertRepository";
import { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    maintenanceAlert: {
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    unusualConsumptionAlert: {
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

describe("PrismaAlertRepository", () => {
  let prismaClient: jest.Mocked<PrismaClient>;
  let deviceRepository: jest.Mocked<DeviceRepository>;
  let maintenanceAlertRepository: PrismaAlertRepository<MaintenanceAlert>;
  let unusualConsumptionAlertRepository: PrismaAlertRepository<UnusualConsumptionAlert>;

  beforeEach(() => {
    prismaClient = new PrismaClient() as jest.Mocked<PrismaClient>;
    deviceRepository = {
      getByName: jest.fn(),
    } as unknown as jest.Mocked<DeviceRepository>;

    maintenanceAlertRepository = new PrismaAlertRepository<MaintenanceAlert>(
      prismaClient,
      deviceRepository,
      prismaClient.maintenanceAlert
    );

    unusualConsumptionAlertRepository = new PrismaAlertRepository<UnusualConsumptionAlert>(
      prismaClient,
      deviceRepository,
      prismaClient.unusualConsumptionAlert
    );

    container.clearInstances();
    container.registerInstance("PrismaClient", prismaClient);
    container.registerInstance("DeviceRepository", deviceRepository);
  });

  describe("getAllByDeviceName", () => {
    it("should return alerts for a given device name (MaintenanceAlert)", async () => {
      const mockDevice: Device = {
        id: "device-id",
        name: "DeviceName",
        ratedPower: 100,
        installationDate: new Date("2023-01-01T00:00:00.000Z"),
        status: "IDLE",
        lastMaintenance: null,
        observations: null,
      };
      const mockAlerts: MaintenanceAlert[] = [{
        id: "alert-id",
        message: "Test Alert",
        resolved: false,
        priority: "LOW",
        deviceId: "device-id",
        operatorId: "operator-id",
        supervisorId: "supervisor-id",
        publicId: "public-id"
      }];

      deviceRepository.getByName.mockResolvedValue(mockDevice);
      jest.spyOn(prismaClient.maintenanceAlert, 'findMany').mockResolvedValue(mockAlerts as any);

      const result = await maintenanceAlertRepository.getAllByDeviceName("DeviceName");

      expect(deviceRepository.getByName).toHaveBeenCalledWith("DeviceName");
      expect(prismaClient.maintenanceAlert.findMany).toHaveBeenCalledWith({ where: { deviceId: mockDevice.id } });
      expect(result).toEqual(mockAlerts);
    });

    it("should return alerts for a given device name (UnusualConsumptionAlert)", async () => {
      const mockDevice: Device = {
        id: "device-id",
        name: "DeviceName",
        ratedPower: 100,
        installationDate: new Date("2023-01-01T00:00:00.000Z"),
        status: "IDLE",
        lastMaintenance: null,
        observations: null,
      };
      const mockAlerts: UnusualConsumptionAlert[] = [{
        id: "alert-id",
        message: "Test Alert",
        resolved: false,
        priority: "LOW",
        deviceId: "device-id",
        operatorId: "operator-id",
        supervisorId: "supervisor-id",
        publicId: "public-id",
        threshold: 10
      }];

      deviceRepository.getByName.mockResolvedValue(mockDevice);
      jest.spyOn(prismaClient.unusualConsumptionAlert, 'findMany').mockResolvedValue(mockAlerts as any);

      const result = await unusualConsumptionAlertRepository.getAllByDeviceName("DeviceName");

      expect(deviceRepository.getByName).toHaveBeenCalledWith("DeviceName");
      expect(prismaClient.unusualConsumptionAlert.findMany).toHaveBeenCalledWith({ where: { deviceId: mockDevice.id } });
      expect(result).toEqual(mockAlerts);
    });

    it("should return null if the device is not found (MaintenanceAlert)", async () => {
      deviceRepository.getByName.mockResolvedValue(null);

      const result = await maintenanceAlertRepository.getAllByDeviceName("DeviceName");

      expect(deviceRepository.getByName).toHaveBeenCalledWith("DeviceName");
      expect(result).toBeNull();
    });

    it("should return null if the device is not found (UnusualConsumptionAlert)", async () => {
      deviceRepository.getByName.mockResolvedValue(null);

      const result = await unusualConsumptionAlertRepository.getAllByDeviceName("DeviceName");

      expect(deviceRepository.getByName).toHaveBeenCalledWith("DeviceName");
      expect(result).toBeNull();
    });

    it("should handle errors and return null (MaintenanceAlert)", async () => {
      deviceRepository.getByName.mockRejectedValue(new Error("Error"));

      const result = await maintenanceAlertRepository.getAllByDeviceName("DeviceName");

      expect(deviceRepository.getByName).toHaveBeenCalledWith("DeviceName");
      expect(result).toBeNull();
    });

    it("should handle errors and return null (UnusualConsumptionAlert)", async () => {
      deviceRepository.getByName.mockRejectedValue(new Error("Error"));

      const result = await unusualConsumptionAlertRepository.getAllByDeviceName("DeviceName");

      expect(deviceRepository.getByName).toHaveBeenCalledWith("DeviceName");
      expect(result).toBeNull();
    });
  });

  describe("resolve", () => {
    it("should resolve an alert by publicId (MaintenanceAlert)", async () => {
      const mockAlert: MaintenanceAlert = {
        id: "alert-id",
        message: "Test Alert",
        resolved: false,
        priority: "LOW",
        deviceId: "device-id",
        operatorId: "operator-id",
        supervisorId: "supervisor-id",
        publicId: "public-id"
      };
      const updatedAlert: MaintenanceAlert = { ...mockAlert, resolved: true };

      jest.spyOn(prismaClient.maintenanceAlert, 'update').mockResolvedValue(updatedAlert as any);

      const result = await maintenanceAlertRepository.resolve("public-id");

      expect(prismaClient.maintenanceAlert.update).toHaveBeenCalledWith({
        where: { publicId: "public-id" },
        data: { resolved: true },
      });
      expect(result).toEqual(updatedAlert);
    });

    it("should resolve an alert by publicId (UnusualConsumptionAlert)", async () => {
      const mockAlert: UnusualConsumptionAlert = {
        id: "alert-id",
        message: "Test Alert",
        resolved: false,
        priority: "LOW",
        deviceId: "device-id",
        operatorId: "operator-id",
        supervisorId: "supervisor-id",
        publicId: "public-id",
        threshold: 10
      };
      const updatedAlert: UnusualConsumptionAlert = { ...mockAlert, resolved: true };

      jest.spyOn(prismaClient.unusualConsumptionAlert, 'update').mockResolvedValue(updatedAlert as any);

      const result = await unusualConsumptionAlertRepository.resolve("public-id");

      expect(prismaClient.unusualConsumptionAlert.update).toHaveBeenCalledWith({
        where: { publicId: "public-id" },
        data: { resolved: true },
      });
      expect(result).toEqual(updatedAlert);
    });

    it("should return null if the update fails (MaintenanceAlert)", async () => {
      jest.spyOn(prismaClient.maintenanceAlert, 'update').mockRejectedValue(new Error("error"));

      const result = await maintenanceAlertRepository.resolve("public-id");

      expect(prismaClient.maintenanceAlert.update).toHaveBeenCalledWith({
        where: { publicId: "public-id" },
        data: { resolved: true },
      });
      expect(result).toBeNull();
    });

    it("should return null if the update fails (UnusualConsumptionAlert)", async () => {
      jest.spyOn(prismaClient.unusualConsumptionAlert, 'update').mockRejectedValue(new Error("error"));

      const result = await unusualConsumptionAlertRepository.resolve("public-id");

      expect(prismaClient.unusualConsumptionAlert.update).toHaveBeenCalledWith({
        where: { publicId: "public-id" },
        data: { resolved: true },
      });
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an alert by publicId (MaintenanceAlert)", async () => {
      const mockAlert: MaintenanceAlert = {
        id: "alert-id",
        message: "Test Alert",
        resolved: false,
        priority: "LOW",
        deviceId: "device-id",
        operatorId: "operator-id",
        supervisorId: "supervisor-id",
        publicId: "public-id"
      };

      jest.spyOn(prismaClient.maintenanceAlert, 'delete').mockResolvedValue(mockAlert as any);

      const result = await maintenanceAlertRepository.delete("public-id");

      expect(prismaClient.maintenanceAlert.delete).toHaveBeenCalledWith({
        where: { publicId: "public-id" },
      });
      expect(result).toEqual(mockAlert);
    });

    it("should delete an alert by publicId (UnusualConsumptionAlert)", async () => {
      const mockAlert: UnusualConsumptionAlert = {
        id: "alert-id",
        message: "Test Alert",
        resolved: false,
        priority: "LOW",
        deviceId: "device-id",
        operatorId: "operator-id",
        supervisorId: "supervisor-id",
        publicId: "public-id",
        threshold: 10
      };

      jest.spyOn(prismaClient.unusualConsumptionAlert, 'delete').mockResolvedValue(mockAlert as any);

      const result = await unusualConsumptionAlertRepository.delete("public-id");

      expect(prismaClient.unusualConsumptionAlert.delete).toHaveBeenCalledWith({
        where: { publicId: "public-id" },
      });
      expect(result).toEqual(mockAlert);
    });

    it("should return null if the delete fails (MaintenanceAlert)", async () => {
      jest.spyOn(prismaClient.maintenanceAlert, 'delete').mockRejectedValue(new Error("error"));

      const result = await maintenanceAlertRepository.delete("public-id");

      expect(prismaClient.maintenanceAlert.delete).toHaveBeenCalledWith({
        where: { publicId: "public-id" },
      });
      expect(result).toBeNull();
    });

    it("should return null if the delete fails (UnusualConsumptionAlert)", async () => {
      jest.spyOn(prismaClient.unusualConsumptionAlert, 'delete').mockRejectedValue(new Error("error"));

      const result = await unusualConsumptionAlertRepository.delete("public-id");

      expect(prismaClient.unusualConsumptionAlert.delete).toHaveBeenCalledWith({
        where: { publicId: "public-id" },
      });
      expect(result).toBeNull();
    });
  });
});
