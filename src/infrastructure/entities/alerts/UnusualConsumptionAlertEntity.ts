import { AlertViewDTO } from "../../api/dtos/alerts/alert.dto";
import { Alert, AlertAttributes } from "./Alert";

interface UnusualConsumptionAlertAttributes extends AlertAttributes {
  threshold: number;
}

export class UnusualConsumptionAlertEntity extends Alert {
  threshold: number;

  constructor({ id, message, resolved = false, priority, deviceId, operatorId, supervisorId, publicId, threshold }: UnusualConsumptionAlertAttributes) {
    super({ id, message, resolved, priority, deviceId, operatorId, supervisorId, publicId });
    this.threshold = threshold;
  }
}