import { CreateOperatorDTO } from "@/src/infrastructure/api/dtos/operators/operator.dto";

export interface OperatorRepository<T> {
  create(operator: CreateOperatorDTO): Promise<T>;
  getByEmail(email: string): Promise<T | null>;
}
