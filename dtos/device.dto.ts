import { Status } from "@prisma/client";

export type DeviceDTO = {
  name: string;
  ratedPower: number;
  installationDate: string;
  lastMaintenance?: string | null;
  observations?: string | null;
  status: Status;
};