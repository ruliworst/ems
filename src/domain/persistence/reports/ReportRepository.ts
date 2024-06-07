export interface ReportRepository<T> {
  getAllByOperatorEmail(operatorEmail: string): Promise<T[] | null>;
};