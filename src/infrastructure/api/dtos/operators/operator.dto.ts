export type CreateOperatorDTO = {
  firstName: string
  firstSurname: string
  secondSurname: string | null
  email: string
  password: string
  phoneNumber: string
  role: OperatorRole
};

export enum OperatorRole {
  OPERATOR,
  SUPERVISOR
}

export type OperatorDTO = {
  email: string
  role: OperatorRole
}