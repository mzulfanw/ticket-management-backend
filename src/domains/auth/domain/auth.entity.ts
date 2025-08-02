export interface UserEntity {
  _id: string;
  email: string;
  password: string;
  role: 'L1' | 'L2' | 'L3';
  name: string;
}

export type SafeUserEntity = Omit<UserEntity, 'password'>

export interface AuthRepository {
  findByEmail(email: string): Promise<UserEntity | null>
}