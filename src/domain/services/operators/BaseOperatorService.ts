import "reflect-metadata";
import "@/config/container";
import { inject, injectable } from "tsyringe";
import { OperatorDTO } from "@/src/infrastructure/api/dtos/operators/operator.dto";
import OperatorService from "./OperatorService";
import SupervisorService from "./SupervisorService";
import { OperatorEntity } from "@/src/infrastructure/entities/operators/OperatorEntity";
import { SupervisorEntity } from "@/src/infrastructure/entities/operators/SupervisorEntity";

@injectable()
export class BaseOperatorService {
  constructor(
    @inject(OperatorService) private operatorService: OperatorService,
    @inject(SupervisorService) private supervisorService: SupervisorService,
  ) { }

  async login(email: string, password: string): Promise<OperatorDTO | null> {
    const operator: OperatorEntity | null = await this.operatorService.login(email, password);
    if (operator) return operator.getDTO();

    const supervisor: SupervisorEntity | null = await this.supervisorService.login(email, password);
    if (supervisor) return supervisor.getDTO();

    return null;
  }

  async getOperatorOrSupervisorByEmail(email: string): Promise<OperatorDTO | null> {
    const operator: OperatorEntity | null = await this.operatorService.getByEmail(email);
    if (operator) return operator.getDTO();

    const supervisor: SupervisorEntity | null = await this.supervisorService.getByEmail(email);
    if (supervisor) return supervisor.getDTO();

    return null;
  }
}