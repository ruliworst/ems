import { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";
import { Operator, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";
import { CreateOperatorDTO } from "../../api/dtos/operators/operator.dto";
import bcrypt from "bcrypt";

@injectable()
export default class PrismaOperatorRepository implements OperatorRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(operator: CreateOperatorDTO): Promise<Operator> {
    try {
      await this.connect();
      const hashedPassword = await bcrypt.hash(operator.password, 10);
      const createdOperator = await this.prisma.operator.create({
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

  async connect(): Promise<void> {
    await this.prisma.$connect();
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}