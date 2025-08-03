type LoginResponsePayload = {
  token: string;
  _id: string;
  name: string;
  role: string;
  email: string;
};

export class LoginResponseDTO {
  token!: string;
  _id!: string;
  name!: string;
  role!: string;
  email!: string

  constructor(payload: LoginResponsePayload) {
    Object.assign(this, payload);
  }
}
