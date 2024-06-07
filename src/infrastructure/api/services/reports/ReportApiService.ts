import { ReportViewDTO } from "../../dtos/reports/report.dto";

export class ReportApiService {
  static async fetchAllByOperatorEmail(email: string): Promise<ReportViewDTO[]> {
    const response = await fetch(`/api/reports?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch reports associated to ${email}`);
    }
    return response.json();
  }
}
