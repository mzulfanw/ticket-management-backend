import { ApiError } from "../../../utils/api.error";
import { AuthRepository } from "../domain/auth.entity";
import status from "http-status"
import MESSAGES from "../../../constants/message";
import bcrypt from 'bcrypt';
import JwtService from "../../../shared/jwt";

export class AuthService {
  constructor(private readonly repo: AuthRepository) { }
  async login(email: string, password: string) {
    const user = await this.repo.findByEmail(email)
    const isMatch = user && await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      throw new ApiError(status.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS)
    }
    const token = JwtService.generateToken({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    })
    return { token, ...user }
  }
}