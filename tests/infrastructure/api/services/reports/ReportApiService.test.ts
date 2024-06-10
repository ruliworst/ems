import { ReportType, ReportViewDTO, ReportDTO } from "@/src/infrastructure/api/dtos/reports/report.dto";
import { ReportApiService } from "@/src/infrastructure/api/services/reports/ReportApiService";

global.fetch = jest.fn();

describe("ReportApiService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchAllByOperatorEmail", () => {
    it("should fetch all reports by operator email successfully", async () => {
      // Arrange
      const email = "operator@example.com";
      const reports: ReportViewDTO[] = [
        {
          publicId: "1232345235",
          startDate: new Date().toDateString(),
          endDate: new Date().toDateString(),
          title: 'Report Title 1',
          type: ReportType.ANOMALIES
        },
        {
          publicId: "1232345236",
          startDate: new Date().toDateString(),
          endDate: new Date().toDateString(),
          title: 'Report Title 2',
          type: ReportType.CONSUMPTION
        }
      ];

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => reports,
      });

      // Act
      const result = await ReportApiService.fetchAllByOperatorEmail(email);

      // Assert
      expect(result).toEqual(reports);
      expect(fetch).toHaveBeenCalledWith(`/api/reports?email=${encodeURIComponent(email)}`);
    });

    it("should throw an error when fetching reports fails", async () => {
      // Arrange
      const email = "operator@example.com";

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      // Act & Assert
      await expect(ReportApiService.fetchAllByOperatorEmail(email)).rejects.toThrow(`Failed to fetch reports associated to ${email}`);
      expect(fetch).toHaveBeenCalledWith(`/api/reports?email=${encodeURIComponent(email)}`);
    });
  });

  describe("fetchByPublicId", () => {
    it("should fetch report by public id successfully", async () => {
      // Arrange
      const publicId = "12345";
      const report: ReportDTO = {
        publicId: "12345",
        startDate: new Date().toDateString(),
        endDate: new Date().toDateString(),
        title: "Test Report",
        type: ReportType.ANOMALIES,
        observations: "Some observations",
        threshold: 10,
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => report,
      });

      // Act
      const result = await ReportApiService.fetchByPublicId(publicId);

      // Assert
      expect(result).toEqual(report);
      expect(fetch).toHaveBeenCalledWith(`/api/reports/${publicId}`);
    });

    it("should throw an error when fetching report by public id fails", async () => {
      // Arrange
      const publicId = "12345";

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      // Act & Assert
      await expect(ReportApiService.fetchByPublicId(publicId)).rejects.toThrow(`Failed to fetch the report with public identifier: ${publicId}`);
      expect(fetch).toHaveBeenCalledWith(`/api/reports/${publicId}`);
    });
  });
});
