import { ReportRepository } from "../../persistence/reports/ReportRepository";

export abstract class ReportService<T, E> {
  constructor(
    protected reportRepository: ReportRepository<T>,
  ) { }

  protected abstract mapToEntity(alert: T): E;

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