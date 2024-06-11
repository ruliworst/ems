import { UpdateReportDTO } from "@/src/infrastructure/api/dtos/reports/report.dto";
import { ReportRepository } from "../../persistence/reports/ReportRepository";

export abstract class ReportService<T, E> {
  constructor(
    protected reportRepository: ReportRepository<T>,
  ) { }

  protected abstract mapToEntity(alert: T): E;
  protected abstract getReportToUpdate(updateReportDTO: UpdateReportDTO): Partial<T>;

  async update(updateReportDTO: UpdateReportDTO): Promise<E> {
    const report: T | null = await this.reportRepository.update(updateReportDTO.publicId, this.getReportToUpdate(updateReportDTO));
    if (!report) throw new Error("The report could not be updated.");
    return this.mapToEntity(report);
  };

  async getAllByOperatorEmail(email: string): Promise<E[] | null> {
    return this.reportRepository
      .getAllByOperatorEmail(email)
      .then(reports => {
        if (!reports) return null;
        return reports.map(this.mapToEntity);
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  };

  async getByPublicId(publicId: string): Promise<E | null> {
    return this.reportRepository
      .getByPublicId(publicId)
      .then(report => {
        if (!report) return null;
        return this.mapToEntity(report);
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  };
}