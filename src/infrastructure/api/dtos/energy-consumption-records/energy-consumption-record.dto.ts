export type CreateEnergyConsumptionRecordDTO = {
  recordDate: string;
  quantity: number;
  price: number;
  deviceId: string;
}

export type GetEnergyConsumptionRecordBetweenDatesDTO = {
  deviceId: string;
  startDate: string;
  endDate: string;
}

export type EnergyConsumptionRecordDTO = {
  recordDate: string;
  quantity: number,
  price: number;
}