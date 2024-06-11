import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { BaseOperatorService } from "@/src/domain/services/operators/BaseOperatorService";
import OperatorService from "@/src/domain/services/operators/OperatorService";
import SupervisorService from "@/src/domain/services/operators/SupervisorService";
import { OperatorDTO, OperatorRole } from "@/src/infrastructure/api/dtos/operators/operator.dto";
import { OperatorEntity } from "@/src/infrastructure/entities/operators/OperatorEntity";
import { SupervisorEntity } from "@/src/infrastructure/entities/operators/SupervisorEntity";

describe("BaseOperatorService", () => {
  let baseOperatorService: BaseOperatorService;
  let operatorService: DeepMockProxy<OperatorService>;
  let supervisorService: DeepMockProxy<SupervisorService>;

  beforeEach(() => {
    container.clearInstances();

    operatorService = mockDeep<OperatorService>();
    supervisorService = mockDeep<SupervisorService>();

    container.registerInstance(OperatorService, operatorService);
    container.registerInstance(SupervisorService, supervisorService);

    baseOperatorService = container.resolve(BaseOperatorService);
  });

  describe("getOperatorOrSupervisorByEmail", () => {
    it("should return an operator if the email belongs to an operator", async () => {
      const email = "operator@example.com";
      const operatorDTO: OperatorDTO = {
        id: "operator-id",
        email,
        role: OperatorRole.OPERATOR
      };

      const operatorEntity: OperatorEntity = {
        getDTO: () => operatorDTO
      } as OperatorEntity;

      operatorService.getByEmail.mockResolvedValue(operatorEntity);
      supervisorService.getByEmail.mockResolvedValue(null);

      const result = await baseOperatorService.getOperatorOrSupervisorByEmail(email);

      expect(result).toEqual(operatorDTO);
      expect(operatorService.getByEmail).toHaveBeenCalledWith(email);
      expect(supervisorService.getByEmail).not.toHaveBeenCalled();
    });

    it("should return a supervisor if the email belongs to a supervisor", async () => {
      const email = "supervisor@example.com";
      const supervisorDTO: OperatorDTO = {
        id: "supervisor-id",
        email,
        role: OperatorRole.SUPERVISOR
      };

      const supervisorEntity: SupervisorEntity = {
        getDTO: () => supervisorDTO
      } as SupervisorEntity;

      operatorService.getByEmail.mockResolvedValue(null);
      supervisorService.getByEmail.mockResolvedValue(supervisorEntity);

      const result = await baseOperatorService.getOperatorOrSupervisorByEmail(email);

      expect(result).toEqual(supervisorDTO);
      expect(operatorService.getByEmail).toHaveBeenCalledWith(email);
      expect(supervisorService.getByEmail).toHaveBeenCalledWith(email);
    });

    it("should return null if the email does not belong to either an operator or a supervisor", async () => {
      const email = "nonexistent@example.com";

      operatorService.getByEmail.mockResolvedValue(null);
      supervisorService.getByEmail.mockResolvedValue(null);

      const result = await baseOperatorService.getOperatorOrSupervisorByEmail(email);

      expect(result).toBeNull();
      expect(operatorService.getByEmail).toHaveBeenCalledWith(email);
      expect(supervisorService.getByEmail).toHaveBeenCalledWith(email);
    });
  });
});
