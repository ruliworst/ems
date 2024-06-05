import "reflect-metadata";
import "@/config/container";
import { inject, injectable } from "tsyringe";
import { MaintenanceAlertService } from "./MaintenanceAlertService";
import { UnusualConsumptionAlertService } from "./UnusualConsumptionAlertService";
import { AlertViewDTO } from "@/src/infrastructure/api/dtos/alerts/alert.dto";
import { MaintenanceAlertEntity } from "@/src/infrastructure/entities/alerts/MaintenanceAlertEntity";
import { UnusualConsumptionAlertEntity } from "@/src/infrastructure/entities/alerts/UnusualConsumptionAlertEntity";

@injectable()
export class BaseAlertService {
  constructor(
    @inject(MaintenanceAlertService) private maintenanceAlertService: MaintenanceAlertService,
    @inject(UnusualConsumptionAlertService) private unusualConsumptionAlertService: UnusualConsumptionAlertService,
  ) { }

  async getAllByDeviceName(deviceName: string): Promise<AlertViewDTO[]> {
    const maintenanceAlerts: MaintenanceAlertEntity[] | null =
      await this.maintenanceAlertService.getAllByDeviceName(deviceName);
    const unusualConsumptionAlerts: UnusualConsumptionAlertEntity[] | null =
      await this.unusualConsumptionAlertService.getAllByDeviceName(deviceName);

    const alerts: AlertViewDTO[] = [];

    if (maintenanceAlerts) {
      maintenanceAlerts.map((alert: MaintenanceAlertEntity) => alerts.push(alert.getView()));
    }

    if (unusualConsumptionAlerts) {
      unusualConsumptionAlerts.map((alert: UnusualConsumptionAlertEntity) => alerts.push(alert.getView()));
    }

    return alerts;
  }
}