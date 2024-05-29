import { Status } from "@prisma/client";
import { DeviceDTO, DeviceViewDTO } from "@/dtos/devices/device.dto";

export interface DeviceAttributes {
  id: string;
  name: string;
  ratedPower: number;
  installationDate: Date;
  status: Status;
  lastMaintenance: Date | null;
  observations: string | null;
}

export class DeviceEntity {
  id: string;
  name: string;
  ratedPower: number;
  installationDate: Date;
  status: Status;
  lastMaintenance: Date | null;
  observations: string | null;
  currentPower: number;

  constructor({
    id,
    name,
    ratedPower,
    installationDate,
    status,
    lastMaintenance,
    observations
  }: DeviceAttributes) {
    this.id = id;
    this.name = name;
    this.ratedPower = ratedPower;
    this.installationDate = installationDate;
    this.status = status;
    this.lastMaintenance = lastMaintenance;
    this.observations = observations;
    this.currentPower = this.getCurrentPower();
  }

  getDeviceView(): DeviceViewDTO {
    return {
      name: this.name,
      ratedPower: this.ratedPower,
      installationDate: this.installationDate.toDateString(),
      lastMaintenance: this.lastMaintenance?.toDateString(),
      status: this.status,
    };
  };

  getDeviceDTO(): DeviceDTO {
    return {
      name: this.name,
      ratedPower: this.ratedPower,
      installationDate: this.installationDate.toDateString(),
      lastMaintenance: this.lastMaintenance?.toDateString(),
      status: this.status,
      observations: this.observations,
      currentPower: this.currentPower
    }
  }

  getCurrentPower = () => {
    let factor = 0;

    if (this.status === Status.IDLE) {
      factor = 0.1;
    } else if (this.status === Status.RUNNING) {
      factor = 0.5;
    } else if (this.status === Status.PEAK) {
      factor = 1;
    }

    return this.ratedPower * factor;
  };
}
