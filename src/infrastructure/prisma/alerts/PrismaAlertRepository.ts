import { inject } from "tsyringe";
import "@/config/container";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";
import PrismaRepository from "../PrismaRepository";
import { Alert } from "../../entities/alerts/Alert";
import { AlertRepository } from "@/src/domain/persistence/alerts/AlertRepository";
import { PrismaClient } from "@prisma/client";

export default class PrismaAlertRepository<T> extends PrismaRepository implements AlertRepository<T> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
    @inject("DeviceRepository") protected deviceRepository: DeviceRepository,
    protected entity: any,
  ) {
    super(prismaClient);
  }


  getAllByDeviceName(deviceName: string): Promise<T[] | null> {
    return this.deviceRepository
      .getByName(deviceName)
      .then(device => {
        if (!device) return null;
        return this.entity.findMany({ where: { deviceId: device.id } });
      })
      .catch(error => {
        console.error(error.message);
        return null;
      });
  }

  resolve(publicId: string): Promise<T | null> {
    const updatedAlert: Partial<Alert> = {
      resolved: true,
    }

    return this.entity
      .update({
        where: { publicId },
        data: { ...updatedAlert },
      })
      .then(updatedAlert)
      .catch((error: any) => {
        console.error(error.message);
        return null;
      });
  }

  delete(publicId: string): Promise<T | null> {
    return this.entity
      .delete({
        where: { publicId },
      })
      .then((alert: any) => alert)
      .catch((error: any) => {
        console.error(error.message);
        return null;
      });
  }
}
