import "reflect-metadata";
import "@/config/container";
import { Operator, PrismaClient } from "@prisma/client";
import { CreateOperatorDTO, OperatorRole } from "@/src/infrastructure/api/dtos/operators/operator.dto";
import bcrypt from "bcryptjs";
import PrismaOperatorRepository from "@/src/infrastructure/prisma/operators/PrismaOperatorRepository";

describe("PrismaOperatorRepository", () => {
  let operatorRepository: PrismaOperatorRepository<Operator>;
  let prisma: PrismaClient;

  const operatorsToCreate: CreateOperatorDTO[] = [
    {
      firstName: "John",
      firstSurname: "Doe",
      secondSurname: "Smith",
      email: "john.doe@example.com",
      password: "password123",
      phoneNumber: "123456789",
      role: OperatorRole.OPERATOR
    },
    {
      firstName: "Jane",
      firstSurname: "Doe",
      secondSurname: "Johnson",
      email: "jane.doe@example.com",
      password: "password123",
      phoneNumber: "987654321",
      role: OperatorRole.OPERATOR
    }
  ];

  beforeAll(async () => {
    prisma = new PrismaClient();
    operatorRepository = new PrismaOperatorRepository(prisma, prisma.operator);
    await operatorRepository.create(operatorsToCreate[0]);
    await operatorRepository.create(operatorsToCreate[1]);
  });

  afterAll(async () => {
    await prisma.operator.deleteMany({});
    await prisma.$disconnect();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return an operator if the credentials are correct", async () => {
      const email = "john.doe@example.com";
      const password = "password123";

      const result = await operatorRepository.login(email, password);

      expect(result).not.toBeNull();
      expect(result?.email).toBe(email);
      expect(result).toHaveProperty("id");
    });

    it("should return null if the credentials are incorrect", async () => {
      const email = "john.doe@example.com";
      const password = "wrongPassword";

      const result = await operatorRepository.login(email, password);

      expect(result).toBeNull();
    });

    it("should handle errors gracefully and return null", async () => {
      jest.spyOn(prisma.operator, 'findUnique').mockRejectedValueOnce(new Error("Repository error"));

      const email = "john.doe@example.com";
      const password = "password123";

      const result = await operatorRepository.login(email, password);

      expect(result).toBeNull();
    });
  });

  describe("getByEmail", () => {
    it("should return an operator if the email exists", async () => {
      const email = "john.doe@example.com";

      const result = await operatorRepository.getByEmail(email);

      expect(result).not.toBeNull();
      expect(result?.email).toBe(email);
      expect(result).toHaveProperty("id");
    });

    it("should return null if the email does not exist", async () => {
      const email = "nonexistent@example.com";

      const result = await operatorRepository.getByEmail(email);

      expect(result).toBeNull();
    });

    it("should handle errors gracefully and return null", async () => {
      jest.spyOn(prisma.operator, 'findUnique').mockRejectedValueOnce(new Error("Repository error"));

      const email = "john.doe@example.com";

      const result = await operatorRepository.getByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new operator", async () => {
      const operatorToCreate: CreateOperatorDTO = {
        firstName: "Alice",
        firstSurname: "Brown",
        secondSurname: "Davis",
        email: "alice.brown@example.com",
        password: "password123",
        phoneNumber: "123123123",
        role: OperatorRole.OPERATOR
      };

      const createdOperator = await operatorRepository.create(operatorToCreate);

      expect(createdOperator).toHaveProperty("id");
      expect(typeof createdOperator.id).toBe("string");

      const foundOperator = await prisma.operator.findUnique({ where: { id: createdOperator.id } });
      expect(foundOperator).not.toBeNull();

      const isPasswordHashed = await bcrypt.compare(operatorToCreate.password, createdOperator.password);
      expect(isPasswordHashed).toBe(true);
    });

    it("should throw an error when creating an operator with an existing email", async () => {
      const operatorToCreate: CreateOperatorDTO = {
        firstName: "Duplicate",
        firstSurname: "User",
        secondSurname: "Test",
        email: operatorsToCreate[0].email,
        password: "password123",
        phoneNumber: "321321321",
        role: OperatorRole.OPERATOR
      };

      await expect(operatorRepository.create(operatorToCreate)).rejects.toThrow();
    });
  });
});
