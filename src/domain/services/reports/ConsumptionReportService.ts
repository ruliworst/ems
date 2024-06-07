import "reflect-metadata";
import "@/config/container";
import { injectable, inject } from "tsyringe";
import { ConsumptionReport } from "@prisma/client";
import { ConsumptionReportEntity } from "@/src/infrastructure/entities/reports/ConsumptionReportEntity";
import { ReportService } from "./ReportService";
import type { ReportRepository } from "../../persistence/reports/ReportRepository";

@injectable()
export class ConsumptionReportService extends ReportService<ConsumptionReport, ConsumptionReportEntity> {
  constructor(
    @inject("ConsumptionReportRepository") reportRepository: ReportRepository<ConsumptionReport>
  ) {
    super(reportRepository);
  };

  protected mapToEntity(report: ConsumptionReport): ConsumptionReportEntity {
    return new ConsumptionReportEntity({ ...report });
  };
}