import { CreateOperatorDTO } from "@/src/infrastructure/api/dtos/operators/operator.dto";
import { OperatorApiService } from "@/src/infrastructure/api/services/operators/OperatorApiService";

global.fetch = jest.fn();

describe("OperatorApiService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an operator successfully", async () => {
    // Arrange
    const operatorToCreate: CreateOperatorDTO = {
      firstName: "Alice",
      firstSurname: "Brown",
      secondSurname: "Davis",
      email: "alice.brown@example.com",
      password: "password123",
      phoneNumber: "123123123"
    };

    const createdOperator = { id: "1", ...operatorToCreate };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => createdOperator,
    });

    // Act
    const result = await OperatorApiService.create(operatorToCreate);

    // Assert
    expect(result).toEqual(createdOperator);
    expect(fetch).toHaveBeenCalledWith("/api/operators", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(operatorToCreate),
    });
  });

  it("should throw an error when creating an operator fails", async () => {
    // Arrange
    const operatorToCreate: CreateOperatorDTO = {
      firstName: "Bob",
      firstSurname: "White",
      secondSurname: "Black",
      email: "bob.white@example.com",
      password: "password123",
      phoneNumber: "321321321"
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert
    await expect(OperatorApiService.create(operatorToCreate)).rejects.toThrow("Failed to create operator");
    expect(fetch).toHaveBeenCalledWith("/api/operators", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(operatorToCreate),
    });
  });
});
