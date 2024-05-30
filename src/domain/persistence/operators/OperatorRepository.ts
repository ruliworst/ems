import { CreateOperatorDTO } from "@/src/infrastructure/api/dtos/operators/operator.dto";
import { Operator } from "@prisma/client";

export interface OperatorRepository {
  create(operator: CreateOperatorDTO): Promise<Operator>;
}
