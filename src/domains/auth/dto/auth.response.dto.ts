type LoginResponsePayload = {
  token: string;
  id: string;
  name: string;
  role: string;
};

export class LoginResponseDTO {
  token!: string;
  id!: string;
  name!: string;
  role!: string;

  constructor(payload: LoginResponsePayload) {
    Object.assign(this, payload);
  }
}
