import "reflect-metadata";
import "@/config/container";
import { injectable, inject } from "tsyringe";
import { AlertService } from "./AlertService";
import { UnusualConsumptionAlertEntity } from "@/src/infrastructure/entities/alerts/UnusualConsumptionAlertEntity";
import { UnusualConsumptionAlert } from "@prisma/client";
import type { AlertRepository } from "../../persistence/alerts/AlertRepository";


@injectable()
export class UnusualConsumptionAlertService extends AlertService<UnusualConsumptionAlert, UnusualConsumptionAlertEntity> {
  constructor(
    @inject("UnusualConsumptionAlertRepository") alertRepository: AlertRepository<UnusualConsumptionAlert>
  ) {
    super(alertRepository);
  };

  protected mapToEntity(alert: UnusualConsumptionAlert): UnusualConsumptionAlertEntity {
    return new UnusualConsumptionAlertEntity({ ...alert });
  };
}