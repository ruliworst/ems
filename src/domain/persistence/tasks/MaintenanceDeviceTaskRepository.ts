import { MaintenanceDeviceTask } from "@prisma/client";
import { BaseTaskRepository } from "./BaseTaskRepository";

export interface MaintenanceDeviceTaskRepository extends BaseTaskRepository<MaintenanceDeviceTask> { }