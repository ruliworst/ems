import { ReportDTO, ReportType, ReportViewDTO } from "../../api/dtos/reports/report.dto";
import { ReportAttributes } from "./Report";
import { Report } from "@/src/infrastructure/entities/reports/Report";

interface ConsumptionReportAttributes extends ReportAttributes { }

export class ConsumptionReportEntity extends Report {
  cost: number;

  constructor({ id, observations, startDate, endDate, title, publicId, operatorId, supervisorId }: ConsumptionReportAttributes) {
    super({ id, observations, startDate, endDate, title, publicId, operatorId, supervisorId });
    // TODO: Calculate the cost based on energy consumption records.
    this.cost = 0;
  }

  getView(): ReportViewDTO {
    return super.getView(ReportType.CONSUMPTION);
  }

  getReportDTO(): ReportDTO {
    return {
      ...super.getReportDTO(),
      cost: this.cost,
      type: ReportType.CONSUMPTION
    }
  }
}