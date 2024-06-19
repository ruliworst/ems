import "reflect-metadata";
import "@/config/container";
import { injectable, inject } from "tsyringe";
import { AlertService } from "./AlertService";
import { MaintenanceAlertEntity } from "@/src/infrastructure/entities/alerts/MaintenanceAlertEntity";
import { MaintenanceAlert } from "@prisma/client";
import type { AlertRepository } from "../../persistence/alerts/AlertRepository";
import DeviceService from "../devices/DeviceService";
import { UpdateDeviceDTO } from "@/src/infrastructure/api/dtos/devices/device.dto";

@injectable()
export class MaintenanceAlertService extends AlertService<MaintenanceAlert, MaintenanceAlertEntity> {
  constructor(
    @inject("MaintenanceAlertRepository") alertRepository: AlertRepository<MaintenanceAlert>,
    @inject(DeviceService) protected deviceService: DeviceService,
  ) {
    super(alertRepository);
  };

  async resolveMaintenanceAlert(publicId: string, deviceName: string): Promise<MaintenanceAlertEntity | null> {
    const lastMaintenance = new Date().toISOString();

    const updateDeviceDTO: UpdateDeviceDTO = {
      originalName: deviceName,
      lastMaintenance,
      name: deviceName,
      ratedPower: null,
      installationDate: null,
      observations: null
    }

    await this.deviceService.update(updateDeviceDTO);

    return super.resolve(publicId);
  }

  protected mapToEntity(alert: MaintenanceAlert): MaintenanceAlertEntity {
    return new MaintenanceAlertEntity({ ...alert });
  };
}