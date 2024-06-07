export enum ReportType {
  ANOMALIES,
  CONSUMPTION
}

export type ReportViewDTO = {
  title: string
  startDate: string
  endDate: string
  type: ReportType
  publicId: string
}