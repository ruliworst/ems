import "reflect-metadata";
import { container } from "tsyringe";
import { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";
import OperatorService from "@/src/domain/services/operators/OperatorService";
import { Operator } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { CreateOperatorDTO, OperatorRole } from "@/src/infrastructure/api/dtos/operators/operator.dto";
import { OperatorEntity } from "@/src/infrastructure/entities/operators/OperatorEntity";

describe("OperatorService", () => {
  let operatorService: OperatorService;
  let operatorRepository: jest.Mocked<OperatorRepository<Operator>>;

  const mockOperators: Operator[] = [
    {
      id: uuidv4(),
      firstName: "John",
      firstSurname: "Doe",
      secondSurname: "Smith",
      email: "john.doe@example.com",
      password: "hashedPassword123",
      phoneNumber: "123456789"
    },
    {
      id: uuidv4(),
      firstName: "Jane",
      firstSurname: "Doe",
      secondSurname: "Johnson",
      email: "jane.doe@example.com",
      password: "hashedPassword123",
      phoneNumber: "987654321"
    }
  ];

  beforeEach(() => {
    operatorRepository = {
      create: jest.fn().mockResolvedValue(mockOperators[0]),
      login: jest.fn().mockImplementation(async (email: string, password: string) =>
        mockOperators.find(operator => operator.email === email && operator.password === password) || null),
      getByEmail: jest.fn().mockImplementation(async (email: string) =>
        mockOperators.find(operator => operator.email === email) || null),
    } as unknown as jest.Mocked<OperatorRepository<Operator>>;

    container.registerInstance("OperatorRepository", operatorRepository);
    operatorService = container.resolve(OperatorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return an operator entity if the credentials are correct", async () => {
      const email = "john.doe@example.com";
      const password = "hashedPassword123";

      const result = await operatorService.login(email, password);

      expect(result).toBeInstanceOf(OperatorEntity);
      expect(result?.email).toBe(email);
      expect(operatorRepository.login).toHaveBeenCalledWith(email, password);
    });

    it("should return null if the credentials are incorrect", async () => {
      const email = "john.doe@example.com";
      const password = "wrongPassword";

      const result = await operatorService.login(email, password);

      expect(result).toBeNull();
      expect(operatorRepository.login).toHaveBeenCalledWith(email, password);
    });

    it("should handle errors gracefully and return null", async () => {
      const email = "john.doe@example.com";
      const password = "hashedPassword123";

      operatorRepository.login.mockRejectedValue(new Error("Repository error"));

      const result = await operatorService.login(email, password);

      expect(result).toBeNull();
      expect(operatorRepository.login).toHaveBeenCalledWith(email, password);
    });
  });

  describe("getByEmail", () => {
    it("should return an operator entity if the email exists", async () => {
      const email = "john.doe@example.com";

      const result = await operatorService.getByEmail(email);

      expect(result).toBeInstanceOf(OperatorEntity);
      expect(result?.email).toBe(email);
      expect(operatorRepository.getByEmail).toHaveBeenCalledWith(email);
    });

    it("should return null if the email does not exist", async () => {
      const email = "nonexistent@example.com";

      const result = await operatorService.getByEmail(email);

      expect(result).toBeNull();
      expect(operatorRepository.getByEmail).toHaveBeenCalledWith(email);
    });

    it("should handle errors gracefully and return null", async () => {
      const email = "john.doe@example.com";

      operatorRepository.getByEmail.mockRejectedValue(new Error("Repository error"));

      const result = await operatorService.getByEmail(email);

      expect(result).toBeNull();
      expect(operatorRepository.getByEmail).toHaveBeenCalledWith(email);
    });
  });
});
