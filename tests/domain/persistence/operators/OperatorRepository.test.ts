import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";
import { CreateOperatorDTO } from "@/src/infrastructure/api/dtos/operators/operator.dto";
import bcrypt from "bcrypt";

describe("OperatorRepository", () => {
  let operatorRepository: OperatorRepository;
  let prisma: PrismaClient = new PrismaClient();

  const operatorsToCreate: CreateOperatorDTO[] = [
    {
      firstName: "John",
      firstSurname: "Doe",
      secondSurname: "Smith",
      email: "john.doe@example.com",
      password: "password123",
      phoneNumber: "123456789"
    },
    {
      firstName: "Jane",
      firstSurname: "Doe",
      secondSurname: "Johnson",
      email: "jane.doe@example.com",
      password: "password123",
      phoneNumber: "987654321"
    }
  ];

  beforeAll(async () => {
    operatorRepository = container.resolve("OperatorRepository");
    await prisma.operator.createMany({ data: operatorsToCreate });
  });

  describe("create", () => {
    it("should create a new operator", async () => {
      // Arrange.
      const operatorToCreate: CreateOperatorDTO = {
        firstName: "Alice",
        firstSurname: "Brown",
        secondSurname: "Davis",
        email: "alice.brown@example.com",
        password: "password123",
        phoneNumber: "123123123"
      };

      // Act.
      const createdOperator = await operatorRepository.create(operatorToCreate);

      // Assert.
      expect(createdOperator).toHaveProperty("id");
      expect(typeof createdOperator.id).toBe("string");

      const foundOperator = await prisma.operator.findUnique({ where: { id: createdOperator.id } });
      expect(foundOperator).not.toBeNull();
      expect(foundOperator).toMatchObject({
        ...operatorToCreate,
        password: expect.any(String)
      });
      const isPasswordHashed = await bcrypt.compare(operatorToCreate.password, createdOperator.password);
      expect(isPasswordHashed).toBe(true);
    });

    it("should throw an error when creating an operator with an existing email", async () => {
      // Arrange.
      const operatorToCreate: CreateOperatorDTO = {
        firstName: "Duplicate",
        firstSurname: "User",
        secondSurname: "Test",
        email: operatorsToCreate[0].email,
        password: "password123",
        phoneNumber: "321321321"
      };

      // Act & Assert.
      await expect(operatorRepository.create(operatorToCreate)).rejects.toThrow("Unique constraint failed on the fields: (`email`)");
    });
  });
});
