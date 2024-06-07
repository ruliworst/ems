import "@/config/container";
import { Operator, PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import PrismaOperatorRepository from "./PrismaOperatorRepository";

@injectable()
export default class PrismaOperatorOperatorRepository extends PrismaOperatorRepository<Operator> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
  ) {
    super(prismaClient, prismaClient.operator);
  }
}