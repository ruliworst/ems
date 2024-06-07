import { OperatorDTO, OperatorRole } from "../../api/dtos/operators/operator.dto";
import { OperatorAttributes, OperatorEntity } from "./OperatorEntity";

export interface SupervisorAttributes extends OperatorAttributes { }

export class SupervisorEntity extends OperatorEntity {
  constructor({
    id,
    firstName,
    firstSurname,
    secondSurname,
    email,
    password,
    phoneNumber
  }: SupervisorAttributes) {
    super({
      id,
      firstName,
      firstSurname,
      secondSurname,
      email,
      password,
      phoneNumber
    });
  }

  getDTO(): OperatorDTO {
    return {
      ...super.getDTO(),
      role: OperatorRole.SUPERVISOR
    }
  }
}
