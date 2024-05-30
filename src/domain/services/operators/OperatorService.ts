import { injectable, inject } from "tsyringe";
import type { OperatorRepository } from "../../persistence/operators/OperatorRepository";
import { OperatorEntity } from "@/src/infrastructure/entities/operators/OperatorEntity";
import { CreateOperatorDTO } from "@/src/infrastructure/api/dtos/operators/operator.dto";
import { Operator } from "@prisma/client";

@injectable()
class OperatorService {
  constructor(
    @inject("OperatorRepository") private operatorRepository: OperatorRepository
  ) { }

  async create(createOperatorDTO: CreateOperatorDTO): Promise<OperatorEntity> {
    try {
      const operator: Operator = await this.operatorRepository.create({ ...createOperatorDTO });
      return new OperatorEntity({ ...operator });
    } catch (error) {
      console.error("Error creating an operator:", error);
      throw error;
    }
  }
}

export default OperatorService;