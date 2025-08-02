import type { Request, Response } from "express";
import { AuthService } from "../application/auth.service";
import MESSAGES from "../../../constants/message";
import { LoginResponseDTO } from "../dto/auth.response.dto";
import jwtService from "../../../shared/jwt"
import { ApiSuccess } from "../../../utils/api.success";

export class AuthController {
  constructor(private readonly authService: AuthService) { }
  async login(req: Request, res: Response) {
    const body = req.body
    const result = await this.authService.login(body.email, body.password)
    const token = jwtService.generateToken({
      _id: result._id,
      email: result.email,
      name: result.name,
      role: result.role
    })
    const response = new LoginResponseDTO({ _id: result._id, name: result.name, role: result.role, token: token })
    return new ApiSuccess(response, MESSAGES.AUTH.SUCCESS_LOGIN).send(res)
  }
}