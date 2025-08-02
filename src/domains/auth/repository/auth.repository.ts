import UserModel from "../../../models/User";
import { AuthRepository, UserEntity } from "../domain/auth.entity";

export class UserRepository implements AuthRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await UserModel.findOne({ email })
    if (!user) return null
    return {
      _id: user.id,
      email: user.email,
      password: user.password,
      role: user.role,
      name: user.name
    }
  }
}