import { inject } from "tsyringe";
import "@/config/container";
import PrismaRepository from "../PrismaRepository";
import { Operator, PrismaClient, Supervisor } from "@prisma/client";
import { ReportRepository } from "@/src/domain/persistence/reports/ReportRepository";
import type { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";

export default class PrismaReportRepository<T> extends PrismaRepository implements ReportRepository<T> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
    @inject("OperatorRepository") protected operatorRepository: OperatorRepository<Operator>,
    @inject("SupervisorRepository") protected supervisorRepository: OperatorRepository<Supervisor>,
    protected entity: any,
  ) {
    super(prismaClient);
  }

  async update(publicId: string, updatedReport: Partial<T>): Promise<T | null> {
    try {
      await this.connect();
      const report = await this.entity.update({
        where: { publicId },
        data: { ...updatedReport },
      }).catch((error: any) => {
        console.error(error);
        return null;
      });

      return report;
    } finally {
      this.disconnect();
    }
  }

  async getByPublicId(publicId: string): Promise<T | null> {
    try {
      await this.connect();
      const report = await this.entity.findUnique({
        where: {
          publicId,
        },
      });
      return report;
    } catch (error) {
      return null;
    } finally {
      this.disconnect();
    }
  }

  async getAllByOperatorEmail(email: string): Promise<T[] | null> {
    const operator: Operator | null = await this.operatorRepository.getByEmail(email);
    console.log(operator)
    if (operator) {
      return this.entity.findMany({ where: { operatorId: operator.id } })
    }

    return this.supervisorRepository
      .getByEmail(email)
      .then((supervisor: any) => {
        if (!supervisor) return null;
        return this.entity.findMany({ where: { supervisorId: supervisor.id } });
      })
      .catch(error => {
        console.error(error.message);
        return null;
      });
  }
}
