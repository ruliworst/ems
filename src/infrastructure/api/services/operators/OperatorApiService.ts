import { CreateOperatorDTO } from "../../dtos/operators/operator.dto";

export class OperatorApiService {
  static async create(operator: CreateOperatorDTO): Promise<string> {
    const response = await fetch('/api/operators', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(operator),
    });
    if (!response.ok) {
      throw new Error('Failed to create operator');
    }
    return response.json();
  }
}