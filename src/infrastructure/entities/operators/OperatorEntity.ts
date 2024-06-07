import { OperatorDTO, OperatorRole } from "../../api/dtos/operators/operator.dto";

export interface OperatorAttributes {
  id: string;
  firstName: string,
  firstSurname: string,
  secondSurname: string | null,
  email: string,
  password: string,
  phoneNumber: string
}

export class OperatorEntity {
  id: string;
  firstName: string;
  firstSurname: string;
  secondSurname: string | null;
  email: string;
  password: string;
  phoneNumber: string;

  constructor({
    id,
    firstName,
    firstSurname,
    secondSurname,
    email,
    password,
    phoneNumber
  }: OperatorAttributes) {
    this.id = id;
    this.firstName = firstName;
    this.firstSurname = firstSurname;
    this.secondSurname = secondSurname;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
  }

  getDTO(): OperatorDTO {
    return {
      email: this.email,
      role: OperatorRole.OPERATOR
    }
  }
}
