import { mockDeep, mockReset } from 'jest-mock-extended';
import "reflect-metadata";
import "@/config/container";

import { PrismaClient, AnomaliesReport } from "@prisma/client";
import { AnomaliesReportService } from "@/src/domain/services/reports/AnomaliesReportService";
import { AnomaliesReportEntity } from "@/src/infrastructure/entities/reports/AnomaliesReportEntity";
import { ReportRepository } from "@/src/domain/persistence/reports/ReportRepository";
import { ReportType, UpdateReportDTO } from '@/src/infrastructure/api/dtos/reports/report.dto';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockDeep<PrismaClient>()),
}));

jest.mock("@/src/domain/persistence/reports/ReportRepository");

describe("AnomaliesReportService", () => {
  let prismaMock: jest.Mocked<PrismaClient>;
  let reportRepositoryMock: jest.Mocked<ReportRepository<AnomaliesReport>>;
  let anomaliesReportService: AnomaliesReportService;

  beforeEach(() => {
    prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;
    reportRepositoryMock = {
      getAllByOperatorEmail: jest.fn(),
      getByPublicId: jest.fn(),
      update: jest.fn()
    } as unknown as jest.Mocked<ReportRepository<AnomaliesReport>>;
    anomaliesReportService = new AnomaliesReportService(reportRepositoryMock);
  });

  afterEach(() => {
    mockReset(prismaMock);
  });

  describe("getAllByOperatorEmail", () => {
    it("should return reports mapped to entities for a given operator email", async () => {
      const email = "operator@example.com";
      const reports: AnomaliesReport[] = [{
        id: "report1",
        operatorId: "1",
        publicId: "1232345235",
        observations: "",
        startDate: new Date(),
        endDate: new Date(),
        title: 'Titulo',
        threshold: 0,
        supervisorId: null,
        deviceId: null
      }];

      const expectedEntities = reports.map(report => new AnomaliesReportEntity({ ...report }));

      reportRepositoryMock.getAllByOperatorEmail.mockResolvedValue(reports);

      const result = await anomaliesReportService.getAllByOperatorEmail(email);

      expect(reportRepositoryMock.getAllByOperatorEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(expectedEntities);
    });

    it("should return null if no reports are found", async () => {
      const email = "operator@example.com";

      reportRepositoryMock.getAllByOperatorEmail.mockResolvedValue(null);

      const result = await anomaliesReportService.getAllByOperatorEmail(email);

      expect(reportRepositoryMock.getAllByOperatorEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });

    it("should handle errors and return null", async () => {
      const email = "operator@example.com";

      reportRepositoryMock.getAllByOperatorEmail.mockRejectedValue(new Error("Error"));

      const result = await anomaliesReportService.getAllByOperatorEmail(email);

      expect(reportRepositoryMock.getAllByOperatorEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });
  });

  describe("getByPublicId", () => {
    it("should return the report mapped to entity when found", async () => {
      const publicId = "12345";
      const report: AnomaliesReport = {
        id: "report1",
        publicId: "12345",
        observations: "",
        startDate: new Date(),
        endDate: new Date(),
        title: "Test Report",
        threshold: 0,
        operatorId: "1",
        supervisorId: null,
        deviceId: null,
      };

      const expectedEntity = new AnomaliesReportEntity({ ...report });

      reportRepositoryMock.getByPublicId.mockResolvedValue(report);

      const result = await anomaliesReportService.getByPublicId(publicId);

      expect(reportRepositoryMock.getByPublicId).toHaveBeenCalledWith(publicId);
      expect(result).toEqual(expectedEntity);
    });

    it("should return null when report is not found", async () => {
      const publicId = "12345";

      reportRepositoryMock.getByPublicId.mockResolvedValue(null);

      const result = await anomaliesReportService.getByPublicId(publicId);

      expect(reportRepositoryMock.getByPublicId).toHaveBeenCalledWith(publicId);
      expect(result).toBeNull();
    });

    it("should handle errors and return null", async () => {
      const publicId = "12345";

      reportRepositoryMock.getByPublicId.mockRejectedValue(new Error("Error"));

      const result = await anomaliesReportService.getByPublicId(publicId);

      expect(reportRepositoryMock.getByPublicId).toHaveBeenCalledWith(publicId);
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update the report and return the updated entity", async () => {
      const updateReportDTO: UpdateReportDTO = {
        publicId: "12345",
        observations: "Updated observations",
        type: ReportType.ANOMALIES
      };
      const updatedReport: AnomaliesReport = {
        id: "report1",
        publicId: "12345",
        observations: "Updated observations",
        startDate: new Date(),
        endDate: new Date(),
        title: "Updated Report Title",
        threshold: 10,
        operatorId: "1",
        supervisorId: null,
        deviceId: null,
      };

      const expectedEntity = new AnomaliesReportEntity({ ...updatedReport });

      reportRepositoryMock.update.mockResolvedValue(updatedReport);

      const result = await anomaliesReportService.update(updateReportDTO);

      expect(reportRepositoryMock.update).toHaveBeenCalledWith(updateReportDTO.publicId, {
        observations: updateReportDTO.observations,
      });
      expect(result).toEqual(expectedEntity);
    });

    it("should throw an error when the report cannot be updated", async () => {
      const updateReportDTO: UpdateReportDTO = {
        publicId: "12345",
        observations: "Updated observations",
        type: ReportType.ANOMALIES
      };

      reportRepositoryMock.update.mockResolvedValue(null);

      await expect(anomaliesReportService.update(updateReportDTO)).rejects.toThrow("The report could not be updated.");
    });

    it("should handle errors and throw an error", async () => {
      const updateReportDTO: UpdateReportDTO = {
        publicId: "12345",
        observations: "Updated observations",
        type: ReportType.ANOMALIES
      };

      reportRepositoryMock.update.mockRejectedValue(new Error("The report could not be updated."));

      await expect(anomaliesReportService.update(updateReportDTO)).rejects.toThrow("The report could not be updated.");
    });
  });
});
