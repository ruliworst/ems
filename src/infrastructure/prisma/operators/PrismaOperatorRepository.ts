import "@/config/container";
import { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";
import { Operator, PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { CreateOperatorDTO } from "../../api/dtos/operators/operator.dto";
import bcrypt from "bcrypt";
import PrismaRepository from "../PrismaRepository";

@injectable()
export default class PrismaOperatorRepository extends PrismaRepository implements OperatorRepository {
  constructor(
    @inject(PrismaClient) protected prismaClient: PrismaClient,
  ) {
    super(prismaClient);
  }

  async create(operator: CreateOperatorDTO): Promise<Operator> {
    try {
      await this.connect();
      const hashedPassword = await bcrypt.hash(operator.password, 10);
      const createdOperator = await this.prismaClient.operator.create({
        data: {
          ...operator,
          password: hashedPassword,
        },
      });
      return createdOperator;
    } finally {
      this.disconnect();
    }
  }
}