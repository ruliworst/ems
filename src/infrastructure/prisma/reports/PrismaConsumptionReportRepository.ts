import "@/config/container";
import { ConsumptionReport, Operator, PrismaClient, Supervisor } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import PrismaReportRepository from "./PrismaReportRepository";
import type { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";

@injectable()
export default class PrismaConsumptionReportRepository extends PrismaReportRepository<ConsumptionReport> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
    @inject("OperatorRepository") protected operatorRepository: OperatorRepository<Operator>,
    @inject("SupervisorRepository") protected supervisorRepository: OperatorRepository<Supervisor>,
  ) {
    super(prismaClient, operatorRepository, supervisorRepository, prismaClient.consumptionReport);
  }
}