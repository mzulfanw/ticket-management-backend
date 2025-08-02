type LoginResponsePayload = {
  token: string;
  _id: string;
  name: string;
  role: string;
};

export class LoginResponseDTO {
  token!: string;
  _id!: string;
  name!: string;
  role!: string;

  constructor(payload: LoginResponsePayload) {
    Object.assign(this, payload);
  }
}
