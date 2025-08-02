import { AuthService } from '../application/auth.service';
import { AuthRepository, UserEntity } from '../domain/auth.entity';
import { ApiError } from '../../../utils/api.error';
import status from 'http-status';
import bcrypt from 'bcrypt';
import JwtService from '../../../shared/jwt';
import MESSAGES from '../../../constants/message';

jest.mock('bcrypt');
jest.mock('../../../shared/jwt');

const mockUser: UserEntity = {
  _id: 'user-1',
  email: 'test@example.com',
  password: 'password',
  role: 'L1',
  name: 'Role L1'
};

const mockRepo: AuthRepository = {
  findByEmail: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return token and user if credentials are valid', async () => {
    (mockRepo.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (JwtService.generateToken as jest.Mock).mockReturnValue('mock-token');

    const result = await authService.login('test@example.com', 'validpassword');

    expect(result).toEqual({
      token: 'mock-token',
      ...mockUser,
    });
    expect(mockRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('validpassword', mockUser.password);
    expect(JwtService.generateToken).toHaveBeenCalledWith({
      _id: mockUser._id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
    });
  });

  it('should throw UNAUTHORIZED if user not found', async () => {
    (mockRepo.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(authService.login('wrong@example.com', 'any')).rejects.toThrow(ApiError);
    await expect(authService.login('wrong@example.com', 'any')).rejects.toMatchObject({
      statusCode: status.UNAUTHORIZED,
      message: MESSAGES.AUTH.INVALID_CREDENTIALS,
    });
  });

  it('should throw UNAUTHORIZED if password mismatch', async () => {
    (mockRepo.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.login('test@example.com', 'wrongpassword')).rejects.toThrow(ApiError);
    await expect(authService.login('test@example.com', 'wrongpassword')).rejects.toMatchObject({
      statusCode: status.UNAUTHORIZED,
      message: MESSAGES.AUTH.INVALID_CREDENTIALS,
    });
  });
});
