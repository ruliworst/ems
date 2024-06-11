import { ReportDTO, ReportType, ReportViewDTO } from "../../api/dtos/reports/report.dto";
import { ReportAttributes } from "./Report";
import { Report } from "@/src/infrastructure/entities/reports/Report";

interface AnomaliesReportAttributes extends ReportAttributes {
  threshold: number
}

export class AnomaliesReportEntity extends Report {
  threshold: number;

  constructor({ id, observations, startDate, endDate, title, publicId, operatorId, supervisorId, threshold }: AnomaliesReportAttributes) {
    super({ id, observations, startDate, endDate, title, publicId, operatorId, supervisorId });
    this.threshold = threshold;
  }

  getView(): ReportViewDTO {
    return super.getView(ReportType.ANOMALIES);
  }

  getReportDTO(): ReportDTO {
    return {
      ...super.getReportDTO(),
      threshold: this.threshold,
      type: ReportType.ANOMALIES
    }
  }
}