import { injectable, inject } from "tsyringe";
import { CreateOperatorDTO } from "@/src/infrastructure/api/dtos/operators/operator.dto";
import { Supervisor } from "@prisma/client";
import type { OperatorRepository } from "../../persistence/operators/OperatorRepository";
import { SupervisorEntity } from "@/src/infrastructure/entities/operators/SupervisorEntity";

@injectable()
class SupervisorService {
  constructor(
    @inject("SupervisorRepository") private supervisorRepository: OperatorRepository<Supervisor>
  ) { }

  async login(email: string, password: string): Promise<SupervisorEntity | null> {
    return this.supervisorRepository.login(email, password)
      .then(supervisor => {
        if (!supervisor) return null;
        return new SupervisorEntity({ ...supervisor });
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  }

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

export default SupervisorService;