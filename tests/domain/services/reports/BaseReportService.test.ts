import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { mockDeep, DeepMockProxy, any } from 'jest-mock-extended';
import { AnomaliesReportService } from "@/src/domain/services/reports/AnomaliesReportService";
import { ConsumptionReportService } from "@/src/domain/services/reports/ConsumptionReportService";
import { BaseReportService } from "@/src/domain/services/reports/BaseReportService";
import { ReportType, UpdateReportDTO, ReportDTO, ReportViewDTO } from "@/src/infrastructure/api/dtos/reports/report.dto";
import { AnomaliesReportEntity } from "@/src/infrastructure/entities/reports/AnomaliesReportEntity";
import { ConsumptionReportEntity } from "@/src/infrastructure/entities/reports/ConsumptionReportEntity";
import { string } from "zod";

describe("BaseReportService", () => {
  let baseReportService: BaseReportService;
  let anomaliesReportService: DeepMockProxy<AnomaliesReportService>;
  let consumptionReportService: DeepMockProxy<ConsumptionReportService>;

  beforeEach(() => {
    container.clearInstances();

    anomaliesReportService = mockDeep<AnomaliesReportService>();
    consumptionReportService = mockDeep<ConsumptionReportService>();

    container.registerInstance(AnomaliesReportService, anomaliesReportService);
    container.registerInstance(ConsumptionReportService, consumptionReportService);

    baseReportService = container.resolve(BaseReportService);
  });

  describe("update", () => {
    it("should update an anomalies report successfully", async () => {
      const updateReportDTO: UpdateReportDTO = {
        type: ReportType.ANOMALIES,
        publicId: "some-public-id",
        observations: "observations"
      };

      const updatedReportDTO: ReportDTO = {
        ...updateReportDTO,
        startDate: "2024-05-01T10:00:00.000Z",
        endDate: "2024-05-10T10:00:00.000Z",
        title: "Title"
      };

      anomaliesReportService.update.mockResolvedValue({
        getReportDTO: () => updatedReportDTO
      } as AnomaliesReportEntity);

      const result = await baseReportService.update(updateReportDTO);

      expect(result).toEqual(updatedReportDTO);
      expect(anomaliesReportService.update).toHaveBeenCalledWith(updateReportDTO);
    });

    it("should update a consumption report successfully", async () => {
      const updateReportDTO: UpdateReportDTO = {
        type: ReportType.CONSUMPTION,
        publicId: "some-public-id",
        observations: "observations"
      };

      const updatedReportDTO: ReportDTO = {
        ...updateReportDTO,
        startDate: "2024-05-01T10:00:00.000Z",
        endDate: "2024-05-10T10:00:00.000Z",
        title: "Title",
        threshold: 10
      };

      consumptionReportService.update.mockResolvedValue({
        getReportDTO: () => updatedReportDTO,
      } as ConsumptionReportEntity);

      const result = await baseReportService.update(updateReportDTO);

      expect(result).toEqual(updatedReportDTO);
      expect(consumptionReportService.update).toHaveBeenCalledWith(updateReportDTO);
    });
  });

  describe("getAllByOperatorEmail", () => {
    it("should return all reports for a given operator email", async () => {
      const email = "operator@example.com";

      const anomaliesReport: AnomaliesReportEntity = new AnomaliesReportEntity({
        id: "anomalies-id",
        publicId: "anomalies-public-id",
        title: "Anomalies Report",
        startDate: new Date("2024-05-01T10:00:00.000Z"),
        endDate: new Date("2024-05-10T10:00:00.000Z"),
        threshold: 5,
        observations: "Observations",
        operatorId: "2",
        supervisorId: null
      });

      const consumptionReport: ConsumptionReportEntity = new ConsumptionReportEntity({
        id: "consumption-id",
        title: "Consumption Report",
        publicId: "consumption-public-id",
        startDate: new Date("2024-05-01T10:00:00.000Z"),
        endDate: new Date("2024-05-10T10:00:00.000Z"),
        observations: "Observations",
        operatorId: "2",
        supervisorId: null
      });

      anomaliesReportService.getAllByOperatorEmail.mockResolvedValue([anomaliesReport]);
      consumptionReportService.getAllByOperatorEmail.mockResolvedValue([consumptionReport]);

      const result = await baseReportService.getAllByOperatorEmail(email);

      expect(result).toEqual([
        {
          title: "Anomalies Report",
          type: ReportType.ANOMALIES,
          publicId: "anomalies-public-id",
          startDate: "Wed May 01 2024",
          endDate: "Fri May 10 2024"
        },
        {
          title: "Consumption Report",
          type: ReportType.CONSUMPTION,
          publicId: "consumption-public-id",
          startDate: "Wed May 01 2024",
          endDate: "Fri May 10 2024"
        }
      ]);

      expect(anomaliesReportService.getAllByOperatorEmail).toHaveBeenCalledWith(email);
      expect(consumptionReportService.getAllByOperatorEmail).toHaveBeenCalledWith(email);
    });
  });

  describe("getByPublicId", () => {
    it("should return a report by public id", async () => {
      const publicId = "some-public-id";

      const anomaliesReport: AnomaliesReportEntity = new AnomaliesReportEntity({
        id: "anomalies-id",
        publicId,
        title: "Anomalies Report",
        startDate: new Date("2024-05-01T10:00:00.000Z"),
        endDate: new Date("2024-05-10T10:00:00.000Z"),
        threshold: 5,
        observations: "Observations",
        operatorId: "2",
        supervisorId: null
      });

      anomaliesReportService.getByPublicId.mockResolvedValue(anomaliesReport);
      consumptionReportService.getByPublicId.mockResolvedValue(null);

      const result = await baseReportService.getByPublicId(publicId);

      expect(result).toEqual({
        publicId,
        type: ReportType.ANOMALIES,
        title: "Anomalies Report",
        startDate: "Wed May 01 2024",
        endDate: "Fri May 10 2024",
        observations: "Observations",
        threshold: 5
      });

      expect(anomaliesReportService.getByPublicId).toHaveBeenCalledWith(publicId);
      expect(consumptionReportService.getByPublicId).toHaveBeenCalledWith(publicId);
    });

    it("should return null if no report is found", async () => {
      const publicId = "non-existent-public-id";

      anomaliesReportService.getByPublicId.mockResolvedValue(null);
      consumptionReportService.getByPublicId.mockResolvedValue(null);

      const result = await baseReportService.getByPublicId(publicId);

      expect(result).toBeNull();
      expect(anomaliesReportService.getByPublicId).toHaveBeenCalledWith(publicId);
      expect(consumptionReportService.getByPublicId).toHaveBeenCalledWith(publicId);
    });
  });
});
