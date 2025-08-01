import request from 'supertest';
import app from '../../../app';
import UserModel from '../../../models/User';
import bcrypt from 'bcrypt';
import JwtService from '../../../shared/jwt';

jest.mock('../../../models/User');
jest.mock('bcrypt');
jest.mock('../../../shared/jwt');

describe('POST /api/v1/auth/login', () => {
  const mockUser = {
    _id: 'user-123',
    id: 'user-123',
    email: 'l1@example.com',
    password: 'password',
    role: 'L1',
    name: 'Role L1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and token when credentials are valid', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (JwtService.generateToken as jest.Mock).mockReturnValue('mock-token');

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'l1@example.com',
        password: 'password',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBe('mock-token');
    expect(res.body.data.name).toBe('Role L1');
  });


  it('should return 401 when user not found', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'notfound@example.com',
        password: 'anyasasdasd',
      });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it('should return 401 when password is incorrect', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it('should return 400 when input is invalid (no email/password)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/validation failed/i);
  });
});
