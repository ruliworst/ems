import { mockDeep, mockReset } from 'jest-mock-extended';
import "reflect-metadata";
import "@/config/container";

import { PrismaClient, ConsumptionReport } from "@prisma/client";
import { ConsumptionReportService } from "@/src/domain/services/reports/ConsumptionReportService";
import { ConsumptionReportEntity } from "@/src/infrastructure/entities/reports/ConsumptionReportEntity";
import { ReportRepository } from "@/src/domain/persistence/reports/ReportRepository";
import { ReportType, UpdateReportDTO } from '@/src/infrastructure/api/dtos/reports/report.dto';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockDeep<PrismaClient>()),
}));

jest.mock("@/src/domain/persistence/reports/ReportRepository");

describe("ConsumptionReportService", () => {
  let prismaMock: jest.Mocked<PrismaClient>;
  let reportRepositoryMock: jest.Mocked<ReportRepository<ConsumptionReport>>;
  let consumptionReportService: ConsumptionReportService;

  beforeEach(() => {
    prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;
    reportRepositoryMock = {
      getAllByOperatorEmail: jest.fn(),
      getByPublicId: jest.fn(),
      update: jest.fn()
    } as unknown as jest.Mocked<ReportRepository<ConsumptionReport>>;
    consumptionReportService = new ConsumptionReportService(reportRepositoryMock);
  });

  afterEach(() => {
    mockReset(prismaMock);
  });

  describe("getAllByOperatorEmail", () => {
    it("should return reports mapped to entities for a given operator email", async () => {
      const email = "operator@example.com";
      const reports: ConsumptionReport[] = [{
        id: "report1",
        operatorId: "1",
        publicId: "1232345235",
        observations: "",
        startDate: new Date(),
        endDate: new Date(),
        title: 'Titulo',
        supervisorId: null,
        deviceId: null
      }];

      const expectedEntities = reports.map(report => new ConsumptionReportEntity({ ...report }));

      reportRepositoryMock.getAllByOperatorEmail.mockResolvedValue(reports);

      const result = await consumptionReportService.getAllByOperatorEmail(email);

      expect(reportRepositoryMock.getAllByOperatorEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(expectedEntities);
    });

    it("should return null if no reports are found", async () => {
      const email = "operator@example.com";

      reportRepositoryMock.getAllByOperatorEmail.mockResolvedValue(null);

      const result = await consumptionReportService.getAllByOperatorEmail(email);

      expect(reportRepositoryMock.getAllByOperatorEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });

    it("should handle errors and return null", async () => {
      const email = "operator@example.com";

      reportRepositoryMock.getAllByOperatorEmail.mockRejectedValue(new Error("Error"));

      const result = await consumptionReportService.getAllByOperatorEmail(email);

      expect(reportRepositoryMock.getAllByOperatorEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });
  });

  describe("getByPublicId", () => {
    it("should return the report mapped to entity when found", async () => {
      const publicId = "12345";
      const report: ConsumptionReport = {
        id: "report1",
        publicId: "12345",
        observations: "",
        startDate: new Date(),
        endDate: new Date(),
        title: "Test Report",
        operatorId: "1",
        supervisorId: null,
        deviceId: null,
      };

      const expectedEntity = new ConsumptionReportEntity({ ...report });

      reportRepositoryMock.getByPublicId.mockResolvedValue(report);

      const result = await consumptionReportService.getByPublicId(publicId);

      expect(reportRepositoryMock.getByPublicId).toHaveBeenCalledWith(publicId);
      expect(result).toEqual(expectedEntity);
    });

    it("should return null when report is not found", async () => {
      const publicId = "12345";

      reportRepositoryMock.getByPublicId.mockResolvedValue(null);

      const result = await consumptionReportService.getByPublicId(publicId);

      expect(result).toBeNull();
      expect(reportRepositoryMock.getByPublicId).toHaveBeenCalledWith(publicId);
    });

    it("should handle errors and return null", async () => {
      const publicId = "12345";

      reportRepositoryMock.getByPublicId.mockRejectedValue(new Error("Error"));

      const result = await consumptionReportService.getByPublicId(publicId);

      expect(result).toBeNull();
      expect(reportRepositoryMock.getByPublicId).toHaveBeenCalledWith(publicId);
    });
  });

  describe("update", () => {
    it("should update the report and return the updated entity", async () => {
      const updateReportDTO: UpdateReportDTO = {
        publicId: "12345",
        observations: "Updated observations",
        type: ReportType.CONSUMPTION
      };
      const updatedReport: ConsumptionReport = {
        id: "report1",
        publicId: "12345",
        observations: "Updated observations",
        startDate: new Date(),
        endDate: new Date(),
        title: "Updated Report Title",
        operatorId: "1",
        supervisorId: null,
        deviceId: null,
      };

      const expectedEntity = new ConsumptionReportEntity({ ...updatedReport });

      reportRepositoryMock.update.mockResolvedValue(updatedReport);

      const result = await consumptionReportService.update(updateReportDTO);

      expect(reportRepositoryMock.update).toHaveBeenCalledWith(updateReportDTO.publicId, {
        observations: updateReportDTO.observations,
      });
      expect(result).toEqual(expectedEntity);
    });

    it("should throw an error when the report cannot be updated", async () => {
      const updateReportDTO: UpdateReportDTO = {
        publicId: "12345",
        observations: "Updated observations",
        type: ReportType.CONSUMPTION
      };

      reportRepositoryMock.update.mockResolvedValue(null);

      await expect(consumptionReportService.update(updateReportDTO)).rejects.toThrow("The report could not be updated.");
    });

    it("should handle errors and throw an error", async () => {
      const updateReportDTO: UpdateReportDTO = {
        publicId: "12345",
        observations: "Updated observations",
        type: ReportType.CONSUMPTION
      };

      reportRepositoryMock.update.mockRejectedValue(new Error("The report could not be updated."));

      await expect(consumptionReportService.update(updateReportDTO)).rejects.toThrow("The report could not be updated.");
    });
  });
});
