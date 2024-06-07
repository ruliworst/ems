import "@/config/container";
import { PrismaClient, Supervisor } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import PrismaOperatorRepository from "./PrismaOperatorRepository";

@injectable()
export default class PrismaSupervisorOperatorRepository extends PrismaOperatorRepository<Supervisor> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
  ) {
    super(prismaClient, prismaClient.supervisor);
  }
}