import "reflect-metadata";
import "@/config/container";
import { inject, injectable } from "tsyringe";
import { AnomaliesReportService } from "./AnomaliesReportService";
import { ConsumptionReportService } from "./ConsumptionReportService";
import { AnomaliesReportEntity } from "@/src/infrastructure/entities/reports/AnomaliesReportEntity";
import { ReportViewDTO } from "@/src/infrastructure/api/dtos/reports/report.dto";
import { ConsumptionReportEntity } from "@/src/infrastructure/entities/reports/ConsumptionReportEntity";

@injectable()
export class BaseReportService {
  constructor(
    @inject(AnomaliesReportService) private anomaliesReportService: AnomaliesReportService,
    @inject(ConsumptionReportService) private consumptionReportService: ConsumptionReportService,
  ) { }

  async getAllByOperatorEmail(email: string): Promise<ReportViewDTO[]> {
    const anomaliesReports: AnomaliesReportEntity[] | null =
      await this.anomaliesReportService.getAllByOperatorEmail(email);
    const consumptionReports: ConsumptionReportEntity[] | null =
      await this.consumptionReportService.getAllByOperatorEmail(email);

    const reports: ReportViewDTO[] = [];

    if (anomaliesReports) {
      anomaliesReports.map((report: AnomaliesReportEntity) => reports.push(report.getView()));
    }

    if (consumptionReports) {
      consumptionReports.map((report: ConsumptionReportEntity) => reports.push(report.getView()));
    }

    return reports;
  }
}