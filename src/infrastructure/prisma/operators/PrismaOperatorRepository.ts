import "@/config/container";
import { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";
import { Operator, PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { CreateOperatorDTO } from "../../api/dtos/operators/operator.dto";
import bcrypt from "bcryptjs";
import PrismaRepository from "../PrismaRepository";

@injectable()
export default class PrismaOperatorRepository<T extends Operator> extends PrismaRepository implements OperatorRepository<T> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
    protected entity: any,
  ) {
    super(prismaClient);
  }

  async login(email: string, password: string): Promise<T | null> {
    const operator: T | null = await this.getByEmail(email);

    if (!operator) return null;

    const isPasswordCorrect = await bcrypt.compare(password, operator.password);

    if (!isPasswordCorrect) {
      return null;
    }

    return operator;
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
    const { role, ...operatorData } = operator;

    try {
      await this.connect();
      const hashedPassword = await bcrypt.hash(operator.password, 10);
      const createdOperator = await this.entity.create({
        data: {
          ...operatorData,
          password: hashedPassword,
        },
      });
      return createdOperator;
    } finally {
      this.disconnect();
    }
  }
}