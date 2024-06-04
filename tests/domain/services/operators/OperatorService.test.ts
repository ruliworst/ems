import "reflect-metadata";
import { container } from "tsyringe";
import { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";
import OperatorService from "@/src/domain/services/operators/OperatorService";
import { Operator } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { CreateOperatorDTO } from "@/src/infrastructure/api/dtos/operators/operator.dto";
import { OperatorEntity } from "@/src/infrastructure/entities/operators/OperatorEntity";

describe("OperatorService", () => {
  let operatorService: OperatorService;
  let operatorRepository: jest.Mocked<OperatorRepository>;

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
      getByName: jest.fn().mockImplementation((email: string) =>
        mockOperators.find(operator => operator.email === email) || null),
    } as unknown as jest.Mocked<OperatorRepository>;

    container.registerInstance("OperatorRepository", operatorRepository);
    operatorService = container.resolve(OperatorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new operator", async () => {
      const { id, ...createOperatorDTO } = mockOperators[0];

      const operatorEntity: OperatorEntity = await operatorService.create(createOperatorDTO);

      expect(operatorRepository.create).toHaveBeenCalledWith(createOperatorDTO);
      expect(operatorEntity).toMatchObject({
        firstName: createOperatorDTO.firstName,
        firstSurname: createOperatorDTO.firstSurname,
        secondSurname: createOperatorDTO.secondSurname,
        email: createOperatorDTO.email,
        phoneNumber: createOperatorDTO.phoneNumber,
      });
      expect(operatorEntity).toHaveProperty("id");
      expect(operatorEntity).toBeInstanceOf(OperatorEntity);
    });

    it("should throw an error when the repository throws an error", async () => {
      const createOperatorDTO: CreateOperatorDTO = {
        firstName: "Bob",
        firstSurname: "White",
        secondSurname: "Black",
        email: "bob.white@example.com",
        password: "password123",
        phoneNumber: "321321321"
      };

      operatorRepository.create.mockRejectedValue(new Error("Repository error"));

      await expect(operatorService.create(createOperatorDTO)).rejects.toThrow("Repository error");
    });
  });
});
