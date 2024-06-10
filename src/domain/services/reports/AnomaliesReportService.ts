import "reflect-metadata";
import "@/config/container";
import { injectable, inject } from "tsyringe";
import { AnomaliesReport } from "@prisma/client";
import { AnomaliesReportEntity } from "@/src/infrastructure/entities/reports/AnomaliesReportEntity";
import { ReportService } from "./ReportService";
import type { ReportRepository } from "../../persistence/reports/ReportRepository";
import { UpdateReportDTO } from "@/src/infrastructure/api/dtos/reports/report.dto";

@injectable()
export class AnomaliesReportService extends ReportService<AnomaliesReport, AnomaliesReportEntity> {
  constructor(
    @inject("AnomaliesReportRepository") reportRepository: ReportRepository<AnomaliesReport>
  ) {
    super(reportRepository);
  };

  protected mapToEntity(report: AnomaliesReport): AnomaliesReportEntity {
    return new AnomaliesReportEntity({ ...report });
  };

  protected getReportToUpdate(updateReportDTO: UpdateReportDTO): Partial<AnomaliesReport> {
    return {
      observations: updateReportDTO.observations ?? undefined,
    };
  }
}