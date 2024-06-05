import { Alert, AlertAttributes } from "./Alert";

interface MaintenanceAlertAttributes extends AlertAttributes { }

export class MaintenanceAlertEntity extends Alert {
  constructor({ id, message, resolved = false, priority, deviceId, operatorId, supervisorId, publicId }: MaintenanceAlertAttributes) {
    super({ id, message, resolved, priority, deviceId, operatorId, supervisorId, publicId });
  }
}