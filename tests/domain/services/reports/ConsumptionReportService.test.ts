import { mockDeep, mockReset } from 'jest-mock-extended';
import "reflect-metadata";
import "@/config/container";

import { PrismaClient, ConsumptionReport } from "@prisma/client";
import { ConsumptionReportService } from "@/src/domain/services/reports/ConsumptionReportService";
import { ConsumptionReportEntity } from "@/src/infrastructure/entities/reports/ConsumptionReportEntity";
import { ReportRepository } from "@/src/domain/persistence/reports/ReportRepository";

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
});
