import "@/config/container";
import { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { CreateOperatorDTO } from "../../api/dtos/operators/operator.dto";
import bcrypt from "bcrypt";
import PrismaRepository from "../PrismaRepository";

@injectable()
export default class PrismaOperatorRepository<T> extends PrismaRepository implements OperatorRepository<T> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
    protected entity: any,
  ) {
    super(prismaClient);
  }

  async getByEmail(email: string): Promise<T | null> {
    try {
      await this.connect();
      return await this.entity.findUnique({ where: { email } });
    }
    finally {
      this.disconnect();
    }
  }

  async create(operator: CreateOperatorDTO): Promise<T> {
    try {
      await this.connect();
      const hashedPassword = await bcrypt.hash(operator.password, 10);
      const createdOperator = await this.entity.create({
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