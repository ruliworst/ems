import { CreateAlertDTO } from "@/src/infrastructure/api/dtos/alerts/alert.dto";
import type { AlertRepository } from "../../persistence/alerts/AlertRepository";

export abstract class AlertService<T, E> {
  constructor(
    protected alertRepository: AlertRepository<T>,
  ) { }

  protected abstract mapToEntity(alert: T): E;

  async getAllByDeviceName(deviceName: string): Promise<E[] | null> {
    return this.alertRepository
      .getAllByDeviceName(deviceName)
      .then(alerts => {
        if (!alerts) return null;
        return alerts.map(this.mapToEntity);
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  };

  resolve(publicId: string): Promise<E | null> {
    return this.alertRepository
      .resolve(publicId)
      .then(alert => {
        if (!alert) return null;
        return this.mapToEntity(alert);
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  }

  delete(publicId: string): Promise<E | null> {
    return this.alertRepository
      .delete(publicId)
      .then(alert => {
        if (!alert) return null;
        return this.mapToEntity(alert);
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  }

  async create(createAlertDTO: CreateAlertDTO): Promise<E> {
    const properties = this.getPropertiesToCreateAlert(createAlertDTO);

    return this.alertRepository
      .create(properties)
      .then(alert => {
        return this.mapToEntity(alert);
      })
      .catch(error => {
        console.error(error);
        throw error;
      });
  }

  protected getPropertiesToCreateAlert(createAlertDTO: CreateAlertDTO): any {
    const { type, ...alertBaseProperties } = createAlertDTO;
    return alertBaseProperties;
  };
}