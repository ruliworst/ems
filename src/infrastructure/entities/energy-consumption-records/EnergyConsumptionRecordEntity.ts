export interface EnergyConsumptionRecordAttributes {
  id: string;
  recordDate: Date;
  quantity: number;
  price: number;
  deviceId: string;
  anomaliesReportId: string | null;
  consumptionReportId: string | null;
}

export class EnergyConsumptionRecordEntity {
  id: string;
  recordDate: Date;
  quantity: number;
  price: number;
  deviceId: string;
  anomaliesReportId: string | null;
  consumptionReportId: string | null;

  constructor({
    id,
    recordDate,
    quantity,
    price,
    deviceId,
    anomaliesReportId,
    consumptionReportId
  }: EnergyConsumptionRecordAttributes) {
    this.id = id;
    this.recordDate = recordDate;
    this.quantity = quantity;
    this.price = price;
    this.deviceId = deviceId;
    this.anomaliesReportId = anomaliesReportId;
    this.consumptionReportId = consumptionReportId;
  }
}
