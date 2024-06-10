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

export type ReportDTO = {
  publicId: string
  observations?: string
  startDate: string
  endDate: string
  title: string
  threshold?: number | null
  cost?: number | null
  type?: ReportType
}