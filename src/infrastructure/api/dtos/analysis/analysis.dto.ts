import { EnergyConsumptionRecordDTO } from "../energy-consumption-records/energy-consumption-record.dto"

export type CompareConsumptionBetweenDevicesDTO = {
  firstDeviceName: string
  secondDeviceName: string
  startDate: string
  endDate: string
}

export type DevicesEnergyConsumptionRecordsDTO = {
  firstDeviceEnergyConsumptionRecords: EnergyConsumptionRecordDTO[]
  secondDeviceEnergyConsumptionRecords: EnergyConsumptionRecordDTO[]
}