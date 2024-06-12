import "reflect-metadata";
import { container } from "tsyringe";
import { Supervisor } from "@prisma/client";
import SupervisorService from "@/src/domain/services/operators/SupervisorService";
import { CreateOperatorDTO, OperatorRole } from "@/src/infrastructure/api/dtos/operators/operator.dto";
import { SupervisorEntity } from "@/src/infrastructure/entities/operators/SupervisorEntity";
import type { OperatorRepository } from "@/src/domain/persistence/operators/OperatorRepository";

describe("SupervisorService", () => {
  let supervisorService: SupervisorService;
  let supervisorRepository: jest.Mocked<OperatorRepository<Supervisor>>;

  const mockSupervisors: Supervisor[] = [
    {
      id: "1",
      firstName: "John",
      firstSurname: "Doe",
      secondSurname: "Smith",
      email: "john.doe@example.com",
      password: "hashedPassword123",
      phoneNumber: "123456789",
    },
    {
      id: "2",
      firstName: "Jane",
      firstSurname: "Doe",
      secondSurname: "Johnson",
      email: "jane.doe@example.com",
      password: "hashedPassword123",
      phoneNumber: "987654321",
    }
  ];

  beforeEach(() => {
    supervisorRepository = {
      create: jest.fn().mockResolvedValue(mockSupervisors[0]),
      login: jest.fn().mockImplementation(async (email: string, password: string) =>
        mockSupervisors.find(supervisor => supervisor.email === email && supervisor.password === password) || null),
      getByEmail: jest.fn().mockImplementation(async (email: string) =>
        mockSupervisors.find(supervisor => supervisor.email === email) || null),
    } as unknown as jest.Mocked<OperatorRepository<Supervisor>>;

    container.registerInstance("SupervisorRepository", supervisorRepository);
    supervisorService = container.resolve(SupervisorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return a supervisor entity if the credentials are correct", async () => {
      const email = "john.doe@example.com";
      const password = "hashedPassword123";

      const result = await supervisorService.login(email, password);

      expect(result).toBeInstanceOf(SupervisorEntity);
      expect(result?.email).toBe(email);
      expect(supervisorRepository.login).toHaveBeenCalledWith(email, password);
    });

    it("should return null if the credentials are incorrect", async () => {
      const email = "john.doe@example.com";
      const password = "wrongPassword";

      const result = await supervisorService.login(email, password);

      expect(result).toBeNull();
      expect(supervisorRepository.login).toHaveBeenCalledWith(email, password);
    });

    it("should handle errors gracefully and return null", async () => {
      const email = "john.doe@example.com";
      const password = "hashedPassword123";

      supervisorRepository.login.mockRejectedValue(new Error("Repository error"));

      const result = await supervisorService.login(email, password);

      expect(result).toBeNull();
      expect(supervisorRepository.login).toHaveBeenCalledWith(email, password);
    });
  });

  describe("getByEmail", () => {
    it("should return a supervisor entity when supervisor is found", async () => {
      const email = "john.doe@example.com";
      const result = await supervisorService.getByEmail(email);

      expect(result).toBeInstanceOf(SupervisorEntity);
      expect(result).toMatchObject({
        id: mockSupervisors[0].id,
        email: mockSupervisors[0].email,
        firstName: mockSupervisors[0].firstName,
        firstSurname: mockSupervisors[0].firstSurname,
        secondSurname: mockSupervisors[0].secondSurname,
        phoneNumber: mockSupervisors[0].phoneNumber,
      });
    });

    it("should return null when supervisor is not found", async () => {
      const email = "nonexistent@example.com";
      const result = await supervisorService.getByEmail(email);

      expect(result).toBeNull();
    });

    it("should handle errors and return null", async () => {
      supervisorRepository.getByEmail.mockRejectedValueOnce(new Error("Repository error"));
      const email = "error@example.com";
      const result = await supervisorService.getByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new supervisor", async () => {
      const createSupervisorDTO: CreateOperatorDTO = {
        firstName: "John",
        firstSurname: "Doe",
        secondSurname: "Smith",
        email: "john.doe@example.com",
        password: "password123",
        phoneNumber: "123456789",
        role: OperatorRole.SUPERVISOR
      };

      const supervisorEntity = await supervisorService.create(createSupervisorDTO);

      expect(supervisorEntity).toBeInstanceOf(SupervisorEntity);
      expect(supervisorEntity).toMatchObject({
        firstName: createSupervisorDTO.firstName,
        firstSurname: createSupervisorDTO.firstSurname,
        secondSurname: createSupervisorDTO.secondSurname,
        email: createSupervisorDTO.email,
        phoneNumber: createSupervisorDTO.phoneNumber,
      });
      expect(supervisorEntity).toHaveProperty("id");
    });

    it("should throw an error when the repository throws an error", async () => {
      const createSupervisorDTO: CreateOperatorDTO = {
        firstName: "Bob",
        firstSurname: "White",
        secondSurname: "Black",
        email: "bob.white@example.com",
        password: "password123",
        phoneNumber: "321321321",
        role: OperatorRole.SUPERVISOR
      };

      supervisorRepository.create.mockRejectedValueOnce(new Error("Repository error"));

      await expect(supervisorService.create(createSupervisorDTO)).rejects.toThrow("Repository error");
    });
  });
});
