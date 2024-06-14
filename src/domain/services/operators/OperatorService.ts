import { injectable, inject } from "tsyringe";
import { OperatorEntity } from "@/src/infrastructure/entities/operators/OperatorEntity";
import { CreateOperatorDTO } from "@/src/infrastructure/api/dtos/operators/operator.dto";
import { Operator } from "@prisma/client";
import type { OperatorRepository } from "../../persistence/operators/OperatorRepository";

@injectable()
class OperatorService {
  constructor(
    @inject("OperatorRepository") private operatorRepository: OperatorRepository<Operator>
  ) { }

  async login(email: string, password: string): Promise<OperatorEntity | null> {
    return this.operatorRepository.login(email, password)
      .then(operator => {
        if (!operator) return null;
        return new OperatorEntity({ ...operator });
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  }

  async getByEmail(email: string): Promise<OperatorEntity | null> {
    return this.operatorRepository
      .getByEmail(email)
      .then(operator => {
        if (!operator) return null;
        return new OperatorEntity({ ...operator });
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  }

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