import { Status } from "@prisma/client";

export type DeviceDTO = {
  name: string;
  ratedPower: number;
  installationDate: string;
  lastMaintenance?: string | null;
  observations?: string | null;
  status: Status;
  currentPower: number;
};

export type DeviceViewDTO = {
  name: string;
  ratedPower: number;
  installationDate: string;
  lastMaintenance?: string | null;
  status: Status;
}

export type CreateDeviceDTO = {
  name: string;
  ratedPower: number;
  installationDate: string;
  lastMaintenance?: string | null;
  observations?: string | null;
  status?: Status;
}

export type UpdateDeviceDTO = {
  originalName: string;
  name: string | null;
  ratedPower: number | null;
  installationDate: string | null;
  observations: string | null;
}