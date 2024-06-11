export interface ReportRepository<T> {
  getAllByOperatorEmail(operatorEmail: string): Promise<T[] | null>;
  getByPublicId(publicId: string): Promise<T | null>;
  update(publicId: string, updatedReport: Partial<T>): Promise<T | null>;
};