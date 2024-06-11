import { ReportDTO, ReportViewDTO, UpdateReportDTO } from "../../dtos/reports/report.dto";

const baseUrl = "/api/reports"
export class ReportApiService {
  static async fetchAllByOperatorEmail(email: string): Promise<ReportViewDTO[]> {
    const response = await fetch(`${baseUrl}?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch reports associated to ${email}`);
    }
    return response.json();
  }

  static async fetchByPublicId(publicId: string): Promise<ReportDTO> {
    const response = await fetch(`${baseUrl}/${publicId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch the report with public identifier: ${publicId}`);
    }
    return response.json();
  }

  static async patch(updateReportDTO: UpdateReportDTO): Promise<ReportDTO> {
    const response = await fetch(`${baseUrl}/${updateReportDTO.publicId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateReportDTO),
    });
    if (!response.ok) {
      throw new Error(`Failed to update report`);
    }
    return response.json();
  }
}
