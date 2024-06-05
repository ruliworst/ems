import "reflect-metadata";
import "@/config/container";
import { injectable, inject } from "tsyringe";
import { AlertService } from "./AlertService";
import { MaintenanceAlertEntity } from "@/src/infrastructure/entities/alerts/MaintenanceAlertEntity";
import { MaintenanceAlert } from "@prisma/client";
import type { AlertRepository } from "../../persistence/alerts/AlertRepository";

@injectable()
export class MaintenanceAlertService extends AlertService<MaintenanceAlert, MaintenanceAlertEntity> {
  constructor(
    @inject("MaintenanceAlertRepository") alertRepository: AlertRepository<MaintenanceAlert>
  ) {
    super(alertRepository);
  };

  protected mapToEntity(alert: MaintenanceAlert): MaintenanceAlertEntity {
    return new MaintenanceAlertEntity({ ...alert });
  };
}