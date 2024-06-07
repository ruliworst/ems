import "@/config/container";
import { AnomaliesReport, Operator, PrismaClient, Supervisor } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import PrismaReportRepository from "./PrismaReportRepository";
import type { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";

@injectable()
export default class PrismaAnomaliesReportRepository extends PrismaReportRepository<AnomaliesReport> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
    @inject("OperatorRepository") protected operatorRepository: OperatorRepository<Operator>,
    @inject("SupervisorRepository") protected supervisorRepository: OperatorRepository<Supervisor>,
  ) {
    super(prismaClient, operatorRepository, supervisorRepository, prismaClient.anomaliesReport);
  }
}