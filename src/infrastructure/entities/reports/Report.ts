import { ReportDTO, ReportType, ReportViewDTO } from "../../api/dtos/reports/report.dto";

export interface ReportAttributes {
  id: string;
  observations: string | null;
  startDate: Date;
  endDate: Date;
  title: string;
  publicId: string;
  operatorId: string | null;
  supervisorId: string | null;
}

export abstract class Report {
  id: string;
  observations: string | null;
  startDate: Date;
  endDate: Date;
  title: string;
  publicId: string;
  operatorId: string | null;
  supervisorId: string | null;

  constructor({ id, observations, startDate, endDate, title, publicId, operatorId, supervisorId }: ReportAttributes) {
    if ((operatorId === undefined || null) && (supervisorId === undefined || null)) {
      throw new Error("The alert must be associated to an Operator or a Supervisor.");
    }

    this.id = id;
    this.observations = observations;
    this.startDate = startDate;
    this.endDate = endDate;
    this.title = title;
    this.publicId = publicId;
    this.operatorId = operatorId;
    this.supervisorId = supervisorId;
  }

  getView(type: ReportType): ReportViewDTO {
    return {
      title: this.title,
      startDate: this.startDate.toDateString(),
      endDate: this.endDate.toDateString(),
      type,
      publicId: this.publicId
    };
  };

  getReportDTO(): ReportDTO {
    return {
      publicId: this.publicId,
      observations: this.observations || undefined,
      startDate: this.startDate.toDateString(),
      endDate: this.endDate?.toDateString(),
      title: this.title,
    };
  }

}