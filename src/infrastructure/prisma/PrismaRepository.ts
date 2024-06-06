import "@/config/container";
import { PrismaClient } from "@prisma/client";
import { inject } from "tsyringe";

export default abstract class PrismaRepository {
  constructor(
    @inject(PrismaClient) protected prismaClient: PrismaClient
  ) {
  }

  async connect(): Promise<void> {
    await this.prismaClient.$connect();
  }

  async disconnect(): Promise<void> {
    await this.prismaClient.$disconnect();
  }
}