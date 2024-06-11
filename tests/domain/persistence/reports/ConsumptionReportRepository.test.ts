import { mockDeep, mockReset } from 'jest-mock-extended';
import "reflect-metadata";
import "@/config/container";

import { PrismaClient, ConsumptionReport, Operator, Supervisor, PrismaPromise } from "@prisma/client";
import PrismaConsumptionReportRepository from "@/src/infrastructure/prisma/reports/PrismaConsumptionReportRepository";
import { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockDeep<PrismaClient>()),
}));

jest.mock("@/src/domain/persistence/operators/OperatorRepository");

describe("PrismaConsumptionReportRepository", () => {
  let prismaMock: jest.Mocked<PrismaClient>;
  let operatorRepositoryMock: jest.Mocked<OperatorRepository<Operator>>;
  let supervisorRepositoryMock: jest.Mocked<OperatorRepository<Supervisor>>;
  let consumptionReportRepository: PrismaConsumptionReportRepository;

  beforeEach(() => {
    prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;
    operatorRepositoryMock = {
      getByEmail: jest.fn(),
    } as unknown as jest.Mocked<OperatorRepository<Operator>>;
    supervisorRepositoryMock = {
      getByEmail: jest.fn(),
    } as unknown as jest.Mocked<OperatorRepository<Supervisor>>;
    consumptionReportRepository = new PrismaConsumptionReportRepository(
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

      operatorRepositoryMock.getByEmail.mockResolvedValue(operator);

      const consumptionReportMock =
        prismaMock.consumptionReport as jest.Mocked<PrismaClient["consumptionReport"]>;

      consumptionReportMock.findMany.mockImplementation(
        () => Promise.resolve(reports) as PrismaPromise<ConsumptionReport[]>
      );

      const result = await consumptionReportRepository.getAllByOperatorEmail(email);

      expect(result).toEqual(reports);
      expect(operatorRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
      expect(prismaMock.consumptionReport.findMany).toHaveBeenCalledWith({ where: { operatorId: operator.id } });
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
      const reports: ConsumptionReport[] = [{
        id: "report1",
        publicId: "1232345235",
        observations: "",
        startDate: new Date(),
        endDate: new Date(),
        title: 'Titulo',
        supervisorId: "2",
        deviceId: null,
        operatorId: null
      }];

      operatorRepositoryMock.getByEmail.mockResolvedValue(null);
      supervisorRepositoryMock.getByEmail.mockResolvedValue(supervisor);

      const consumptionReportMock =
        prismaMock.consumptionReport as jest.Mocked<PrismaClient["consumptionReport"]>;

      consumptionReportMock.findMany.mockImplementation(
        () => Promise.resolve(reports) as PrismaPromise<ConsumptionReport[]>
      );

      const result = await consumptionReportRepository.getAllByOperatorEmail(email);

      expect(result).toEqual(reports);
      expect(operatorRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
      expect(supervisorRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
      expect(prismaMock.consumptionReport.findMany).toHaveBeenCalledWith({ where: { supervisorId: supervisor.id } });
    });

    it("should return null when neither operator nor supervisor is found", async () => {
      const email = "unknown@example.com";

      operatorRepositoryMock.getByEmail.mockResolvedValue(null);
      supervisorRepositoryMock.getByEmail.mockResolvedValue(null);

      const result = await consumptionReportRepository.getAllByOperatorEmail(email);

      expect(result).toBeNull();
      expect(operatorRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
      expect(supervisorRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe("getByPublicId", () => {
    it("should return the report when found", async () => {
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

      const consumptionReportMock =
        prismaMock.consumptionReport as jest.Mocked<PrismaClient["consumptionReport"]>;

      consumptionReportMock.findUnique.mockResolvedValue(report);

      const result = await consumptionReportRepository.getByPublicId(publicId);

      expect(result).toEqual(report);
      expect(prismaMock.consumptionReport.findUnique).toHaveBeenCalledWith({
        where: { publicId },
      });
    });

    it("should return null when report is not found", async () => {
      const publicId = "12345";

      const consumptionReportMock =
        prismaMock.consumptionReport as jest.Mocked<PrismaClient["consumptionReport"]>;

      consumptionReportMock.findUnique.mockResolvedValue(null);

      const result = await consumptionReportRepository.getByPublicId(publicId);

      expect(result).toBeNull();
      expect(prismaMock.consumptionReport.findUnique).toHaveBeenCalledWith({
        where: { publicId },
      });
    });

    it("should handle errors and return null", async () => {
      const publicId = "12345";

      const consumptionReportMock =
        prismaMock.consumptionReport as jest.Mocked<PrismaClient["consumptionReport"]>;

      consumptionReportMock.findUnique.mockRejectedValue(new Error("Database error"));

      const result = await consumptionReportRepository.getByPublicId(publicId);

      expect(result).toBeNull();
      expect(prismaMock.consumptionReport.findUnique).toHaveBeenCalledWith({
        where: { publicId },
      });
    });
  });

  describe("update", () => {
    it("should update the report when found", async () => {
      const publicId = "12345";
      const updatedReport: Partial<ConsumptionReport> = {
        observations: "Updated observations"
      };
      const report: ConsumptionReport = {
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

      const consumptionReportMock =
        prismaMock.consumptionReport as jest.Mocked<PrismaClient["consumptionReport"]>;

      consumptionReportMock.update.mockResolvedValue(report);

      const result = await consumptionReportRepository.update(publicId, updatedReport);

      expect(result).toEqual(report);
      expect(prismaMock.consumptionReport.update).toHaveBeenCalledWith({
        where: { publicId },
        data: { ...updatedReport },
      });
    });

    it("should handle errors and return null", async () => {
      const publicId = "12345";
      const updatedReport: Partial<ConsumptionReport> = {
        observations: "Updated observations"
      };

      const consumptionReportMock =
        prismaMock.consumptionReport as jest.Mocked<PrismaClient["consumptionReport"]>;

      consumptionReportMock.update.mockRejectedValue(new Error("Database error"));

      const result = await consumptionReportRepository.update(publicId, updatedReport);

      expect(result).toBeNull();
      expect(prismaMock.consumptionReport.update).toHaveBeenCalledWith({
        where: { publicId },
        data: { ...updatedReport },
      });
    });
  });
});