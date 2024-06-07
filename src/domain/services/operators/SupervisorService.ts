import { injectable, inject } from "tsyringe";
import { CreateOperatorDTO } from "@/src/infrastructure/api/dtos/operators/operator.dto";
import { Supervisor } from "@prisma/client";
import type { OperatorRepository } from "../../persistence/operators/OperatorRepository";
import { SupervisorEntity } from "@/src/infrastructure/entities/operators/SupervisorEntity";

@injectable()
class OperatorService {
  constructor(
    @inject("SupervisorRepository") private supervisorRepository: OperatorRepository<Supervisor>
  ) { }

  async getByEmail(email: string): Promise<SupervisorEntity | null> {
    return this.supervisorRepository
      .getByEmail(email)
      .then(supervisor => {
        if (!supervisor) return null;
        return new SupervisorEntity({ ...supervisor });
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  }

  async create(createOperatorDTO: CreateOperatorDTO): Promise<SupervisorEntity> {
    try {
      const supervisor: Supervisor = await this.supervisorRepository.create({ ...createOperatorDTO });
      return new SupervisorEntity({ ...supervisor });
    } catch (error) {
      console.error("Error creating an operator:", error);
      throw error;
    }
  }
}

export default OperatorService;