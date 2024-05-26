import { Status } from "@prisma/client";

// TODO: Move to here the calculation of currentPower.
export type DeviceDTO = {
  name: string;
  ratedPower: number;
  installationDate: string;
  lastMaintenance?: string | null;
  observations?: string | null;
  status?: Status;
};