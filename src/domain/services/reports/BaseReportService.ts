import "reflect-metadata";
import "@/config/container";
import { inject, injectable } from "tsyringe";
import { AnomaliesReportService } from "./AnomaliesReportService";
import { ConsumptionReportService } from "./ConsumptionReportService";
import { AnomaliesReportEntity } from "@/src/infrastructure/entities/reports/AnomaliesReportEntity";
import { ReportDTO, ReportType, ReportViewDTO, UpdateReportDTO } from "@/src/infrastructure/api/dtos/reports/report.dto";
import { ConsumptionReportEntity } from "@/src/infrastructure/entities/reports/ConsumptionReportEntity";

@injectable()
export class BaseReportService {
  constructor(
    @inject(AnomaliesReportService) private anomaliesReportService: AnomaliesReportService,
    @inject(ConsumptionReportService) private consumptionReportService: ConsumptionReportService,
  ) { }

  async update(updateReportDTO: UpdateReportDTO): Promise<ReportDTO> {
    let updatedReport;
    try {
      if (updateReportDTO.type === ReportType.ANOMALIES) {
        updatedReport = await this.anomaliesReportService.update(updateReportDTO);
      } else if (updateReportDTO.type === ReportType.CONSUMPTION) {
        updatedReport = await this.consumptionReportService.update(updateReportDTO);
      } else {
        throw new Error("The specified task type is not valid.")
      }
      return updatedReport.getReportDTO();
    } catch (error) {
      console.error("Error updating a task:", error);
      throw error;
    }
  }

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

  async getByPublicId(publicId: string): Promise<ReportDTO | null> {
    const reports = await Promise.all([
      this.anomaliesReportService.getByPublicId(publicId),
      this.consumptionReportService.getByPublicId(publicId),
    ]);

    const report = reports.find(report => report !== null);
    return report ? report.getReportDTO() : null;
  }
}