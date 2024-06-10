import { mockDeep, mockReset } from 'jest-mock-extended';
import "reflect-metadata";
import "@/config/container";

import { PrismaClient, AnomaliesReport, Operator, Supervisor, PrismaPromise } from "@prisma/client";
import PrismaAnomaliesReportRepository from "@/src/infrastructure/prisma/reports/PrismaAnomaliesReportRepository";
import { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockDeep<PrismaClient>()),
}));

jest.mock("@/src/domain/persistence/operators/OperatorRepository");

describe("PrismaAnomaliesReportRepository", () => {
  let prismaMock: jest.Mocked<PrismaClient>;
  let operatorRepositoryMock: jest.Mocked<OperatorRepository<Operator>>;
  let supervisorRepositoryMock: jest.Mocked<OperatorRepository<Supervisor>>;
  let anomaliesReportRepository: PrismaAnomaliesReportRepository;

  beforeEach(() => {
    prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;
    operatorRepositoryMock = {
      getByEmail: jest.fn(),
    } as unknown as jest.Mocked<OperatorRepository<Operator>>;
    supervisorRepositoryMock = {
      getByEmail: jest.fn(),
    } as unknown as jest.Mocked<OperatorRepository<Supervisor>>;
    anomaliesReportRepository = new PrismaAnomaliesReportRepository(
      prismaMock,
      operatorRepositoryMock,
      supervisorRepositoryMock
    );
  });

  afterEach(() => {
    mockReset(prismaMock);
  });

  describe("getAllByOperatorEmail", () => {
    it("should return reports for the operator when operator is found", async () => {
      const email = "operator@example.com";
      const operator: Operator = {
        id: "1",
        email,
        firstName: '',
        firstSurname: '',
        secondSurname: null,
        password: '',
        phoneNumber: ''
      };
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

      operatorRepositoryMock.getByEmail.mockResolvedValue(operator);

      const anomaliesReportMock =
        prismaMock.anomaliesReport as jest.Mocked<PrismaClient["anomaliesReport"]>;

      anomaliesReportMock.findMany.mockImplementation(
        () => Promise.resolve(reports) as PrismaPromise<AnomaliesReport[]>
      );

      const result = await anomaliesReportRepository.getAllByOperatorEmail(email);

      expect(result).toEqual(reports);
      expect(operatorRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
      expect(prismaMock.anomaliesReport.findMany).toHaveBeenCalledWith({ where: { operatorId: operator.id } });
    });

    it("should return reports for the supervisor when operator is not found but supervisor is found", async () => {
      const email = "supervisor@example.com";
      const supervisor: Supervisor = {
        id: "2",
        email,
        firstName: '',
        firstSurname: '',
        secondSurname: null,
        password: '',
        phoneNumber: ''
      };
      const reports: AnomaliesReport[] = [{
        id: "report1",
        publicId: "1232345235",
        observations: "",
        startDate: new Date(),
        endDate: new Date(),
        title: 'Titulo',
        threshold: 0,
        supervisorId: "2",
        deviceId: null,
        operatorId: null
      }];

      operatorRepositoryMock.getByEmail.mockResolvedValue(null);
      supervisorRepositoryMock.getByEmail.mockResolvedValue(supervisor);

      const anomaliesReportMock =
        prismaMock.anomaliesReport as jest.Mocked<PrismaClient["anomaliesReport"]>;

      anomaliesReportMock.findMany.mockImplementation(
        () => Promise.resolve(reports) as PrismaPromise<AnomaliesReport[]>
      );

      const result = await anomaliesReportRepository.getAllByOperatorEmail(email);

      expect(result).toEqual(reports);
      expect(operatorRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
      expect(supervisorRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
      expect(prismaMock.anomaliesReport.findMany).toHaveBeenCalledWith({ where: { supervisorId: supervisor.id } });
    });

    it("should return null when neither operator nor supervisor is found", async () => {
      const email = "unknown@example.com";

      operatorRepositoryMock.getByEmail.mockResolvedValue(null);
      supervisorRepositoryMock.getByEmail.mockResolvedValue(null);

      const result = await anomaliesReportRepository.getAllByOperatorEmail(email);

      expect(result).toBeNull();
      expect(operatorRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
      expect(supervisorRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe("getByPublicId", () => {
    it("should return the report when found", async () => {
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

      const anomaliesReportMock =
        prismaMock.anomaliesReport as jest.Mocked<PrismaClient["anomaliesReport"]>;

      anomaliesReportMock.findUnique.mockResolvedValue(report);

      const result = await anomaliesReportRepository.getByPublicId(publicId);

      expect(result).toEqual(report);
      expect(prismaMock.anomaliesReport.findUnique).toHaveBeenCalledWith({
        where: { publicId },
      });
    });

    it("should return null when report is not found", async () => {
      const publicId = "12345";

      const anomaliesReportMock =
        prismaMock.anomaliesReport as jest.Mocked<PrismaClient["anomaliesReport"]>;

      anomaliesReportMock.findUnique.mockResolvedValue(null);

      const result = await anomaliesReportRepository.getByPublicId(publicId);

      expect(result).toBeNull();
      expect(prismaMock.anomaliesReport.findUnique).toHaveBeenCalledWith({
        where: { publicId },
      });
    });

    it("should handle errors and return null", async () => {
      const publicId = "12345";

      const anomaliesReportMock =
        prismaMock.anomaliesReport as jest.Mocked<PrismaClient["anomaliesReport"]>;
      anomaliesReportMock.findUnique.mockRejectedValue(new Error("Database error"));

      const result = await anomaliesReportRepository.getByPublicId(publicId);

      expect(result).toBeNull();
      expect(prismaMock.anomaliesReport.findUnique).toHaveBeenCalledWith({
        where: { publicId },
      });
    });
  });
});
