import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { MaintenanceAlertService } from "@/src/domain/services/alerts/MaintenanceAlertService";
import { UnusualConsumptionAlertService } from "@/src/domain/services/alerts/UnusualConsumptionAlertService";
import { BaseAlertService } from "@/src/domain/services/alerts/BaseAlertService";
import { AlertType, AlertViewDTO } from "@/src/infrastructure/api/dtos/alerts/alert.dto";
import { MaintenanceAlertEntity } from "@/src/infrastructure/entities/alerts/MaintenanceAlertEntity";
import { UnusualConsumptionAlertEntity } from "@/src/infrastructure/entities/alerts/UnusualConsumptionAlertEntity";
import { Priority } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

describe("BaseAlertService", () => {
  let baseAlertService: BaseAlertService;

  let maintenanceAlertService: jest.Mocked<MaintenanceAlertService>;
  let unusualConsumptionAlertService: jest.Mocked<UnusualConsumptionAlertService>;

  const deviceName = "Device-1";
  const mockMaintenanceAlerts: MaintenanceAlertEntity[] = [
    new MaintenanceAlertEntity({
      id: uuidv4(),
      message: "Maintenance required",
      resolved: false,
      priority: Priority.HIGH,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: uuidv4(),
    }),
  ];

  const mockUnusualConsumptionAlerts: UnusualConsumptionAlertEntity[] = [
    new UnusualConsumptionAlertEntity({
      id: uuidv4(),
      message: "Unusual consumption detected",
      resolved: false,
      priority: Priority.MEDIUM,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: uuidv4(),
      threshold: 10
    }),
  ];

  beforeEach(() => {
    maintenanceAlertService = {
      getAllByDeviceName: jest.fn().mockResolvedValue(mockMaintenanceAlerts),
      resolve: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<MaintenanceAlertService>;

    unusualConsumptionAlertService = {
      getAllByDeviceName: jest.fn().mockResolvedValue(mockUnusualConsumptionAlerts),
      resolve: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UnusualConsumptionAlertService>;

    container.registerInstance(MaintenanceAlertService, maintenanceAlertService);
    container.registerInstance(UnusualConsumptionAlertService, unusualConsumptionAlertService);

    baseAlertService = container.resolve(BaseAlertService);
  });

  it("should fetch all alerts by device name", async () => {
    const result = await baseAlertService.getAllByDeviceName(deviceName);

    const expectedAlerts: AlertViewDTO[] = [
      {
        message: mockMaintenanceAlerts[0].message,
        resolved: mockMaintenanceAlerts[0].resolved,
        priority: mockMaintenanceAlerts[0].priority,
        publicId: mockMaintenanceAlerts[0].publicId,
        type: AlertType.MAINTENANCE
      },
      {
        message: mockUnusualConsumptionAlerts[0].message,
        resolved: mockUnusualConsumptionAlerts[0].resolved,
        priority: mockUnusualConsumptionAlerts[0].priority,
        publicId: mockUnusualConsumptionAlerts[0].publicId,
        type: AlertType.UNUSUAL_CONSUMPTION
      },
    ];

    expect(result).toEqual(expectedAlerts);
    expect(maintenanceAlertService.getAllByDeviceName).toHaveBeenCalledWith(deviceName);
    expect(unusualConsumptionAlertService.getAllByDeviceName).toHaveBeenCalledWith(deviceName);
  });

  it("should handle null values returned from maintenance alerts service", async () => {
    maintenanceAlertService.getAllByDeviceName.mockResolvedValueOnce(null);

    container.clearInstances();
    container.registerInstance(MaintenanceAlertService, maintenanceAlertService);
    container.registerInstance(UnusualConsumptionAlertService, unusualConsumptionAlertService);
    baseAlertService = container.resolve(BaseAlertService);

    const result = await baseAlertService.getAllByDeviceName(deviceName);

    const expectedAlerts: AlertViewDTO[] = [
      {
        message: mockUnusualConsumptionAlerts[0].message,
        resolved: mockUnusualConsumptionAlerts[0].resolved,
        priority: mockUnusualConsumptionAlerts[0].priority,
        publicId: mockUnusualConsumptionAlerts[0].publicId,
        type: AlertType.UNUSUAL_CONSUMPTION
      },
    ];

    expect(result).toEqual(expectedAlerts);
  });

  it("should handle null values returned from unusual consumption alerts service", async () => {
    unusualConsumptionAlertService.getAllByDeviceName.mockResolvedValueOnce(null);

    container.clearInstances();
    container.registerInstance(MaintenanceAlertService, maintenanceAlertService);
    container.registerInstance(UnusualConsumptionAlertService, unusualConsumptionAlertService);
    baseAlertService = container.resolve(BaseAlertService);

    const result = await baseAlertService.getAllByDeviceName(deviceName);

    const expectedAlerts: AlertViewDTO[] = [
      {
        message: mockMaintenanceAlerts[0].message,
        resolved: mockMaintenanceAlerts[0].resolved,
        priority: mockMaintenanceAlerts[0].priority,
        publicId: mockMaintenanceAlerts[0].publicId,
        type: AlertType.MAINTENANCE
      },
    ];

    expect(result).toEqual(expectedAlerts);
  });

  it("should handle null values returned from both services", async () => {
    maintenanceAlertService.getAllByDeviceName.mockResolvedValueOnce(null);
    unusualConsumptionAlertService.getAllByDeviceName.mockResolvedValueOnce(null);

    container.clearInstances();
    container.registerInstance(MaintenanceAlertService, maintenanceAlertService);
    container.registerInstance(UnusualConsumptionAlertService, unusualConsumptionAlertService);
    baseAlertService = container.resolve(BaseAlertService);

    const result = await baseAlertService.getAllByDeviceName(deviceName);

    expect(result).toEqual([]);
  });

  it("should resolve an alert by publicId", async () => {
    const mockPublicId = "public-1";
    const resolvedAlert = new MaintenanceAlertEntity({
      id: uuidv4(),
      message: "Maintenance required",
      resolved: true,
      priority: Priority.HIGH,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: mockPublicId,
    });

    maintenanceAlertService.resolve.mockResolvedValue(resolvedAlert);

    container.clearInstances();
    container.registerInstance(MaintenanceAlertService, maintenanceAlertService);
    container.registerInstance(UnusualConsumptionAlertService, unusualConsumptionAlertService);
    baseAlertService = container.resolve(BaseAlertService);

    const result = await baseAlertService.resolve(mockPublicId);

    expect(maintenanceAlertService.resolve).toHaveBeenCalledWith(mockPublicId);
    expect(result).toEqual(resolvedAlert.getView());
  });

  it("should handle resolving alerts from unusual consumption alerts service", async () => {
    const mockPublicId = "public-2";
    const resolvedAlert = new UnusualConsumptionAlertEntity({
      id: uuidv4(),
      message: "Unusual consumption detected",
      resolved: true,
      priority: Priority.MEDIUM,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: mockPublicId,
      threshold: 10
    });

    maintenanceAlertService.resolve.mockResolvedValue(null);
    unusualConsumptionAlertService.resolve.mockResolvedValue(resolvedAlert);

    container.clearInstances();
    container.registerInstance(MaintenanceAlertService, maintenanceAlertService);
    container.registerInstance(UnusualConsumptionAlertService, unusualConsumptionAlertService);
    baseAlertService = container.resolve(BaseAlertService);

    const result = await baseAlertService.resolve(mockPublicId);

    expect(unusualConsumptionAlertService.resolve).toHaveBeenCalledWith(mockPublicId);
    expect(result).toEqual(resolvedAlert.getView());
  });

  it("should handle null values when resolving alerts", async () => {
    const mockPublicId = "public-3";

    maintenanceAlertService.resolve.mockResolvedValue(null);
    unusualConsumptionAlertService.resolve.mockResolvedValue(null);

    container.clearInstances();
    container.registerInstance(MaintenanceAlertService, maintenanceAlertService);
    container.registerInstance(UnusualConsumptionAlertService, unusualConsumptionAlertService);
    baseAlertService = container.resolve(BaseAlertService);

    const result = await baseAlertService.resolve(mockPublicId);

    expect(result).toBeNull();
  });

  it("should delete an alert by publicId", async () => {
    const mockPublicId = "public-1";
    const deletedAlert = new MaintenanceAlertEntity({
      id: uuidv4(),
      message: "Maintenance required",
      resolved: true,
      priority: Priority.HIGH,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: mockPublicId,
    });

    maintenanceAlertService.delete.mockResolvedValue(deletedAlert);

    container.clearInstances();
    container.registerInstance(MaintenanceAlertService, maintenanceAlertService);
    container.registerInstance(UnusualConsumptionAlertService, unusualConsumptionAlertService);
    baseAlertService = container.resolve(BaseAlertService);

    const result = await baseAlertService.delete(mockPublicId);

    expect(result).toEqual(deletedAlert.getView());
  });

  it("should handle deleting alerts from unusual consumption alerts service", async () => {
    const mockPublicId = "public-2";
    const deletedAlert = new UnusualConsumptionAlertEntity({
      id: uuidv4(),
      message: "Unusual consumption detected",
      resolved: true,
      priority: Priority.MEDIUM,
      deviceId: "1",
      operatorId: "2",
      supervisorId: null,
      publicId: mockPublicId,
      threshold: 10
    });

    maintenanceAlertService.delete.mockResolvedValue(null);
    unusualConsumptionAlertService.delete.mockResolvedValue(deletedAlert);

    container.clearInstances();
    container.registerInstance(MaintenanceAlertService, maintenanceAlertService);
    container.registerInstance(UnusualConsumptionAlertService, unusualConsumptionAlertService);
    baseAlertService = container.resolve(BaseAlertService);

    const result = await baseAlertService.delete(mockPublicId);

    expect(result).toEqual(deletedAlert.getView());
  });

  it("should handle null values when deleting alerts", async () => {
    const mockPublicId = "public-3";

    maintenanceAlertService.delete.mockResolvedValue(null);
    unusualConsumptionAlertService.delete.mockResolvedValue(null);

    container.clearInstances();
    container.registerInstance(MaintenanceAlertService, maintenanceAlertService);
    container.registerInstance(UnusualConsumptionAlertService, unusualConsumptionAlertService);
    baseAlertService = container.resolve(BaseAlertService);

    const result = await baseAlertService.delete(mockPublicId);

    expect(result).toBeNull();
  });
});
