import jwt from 'jsonwebtoken';
import { APP_CONFIG } from '../../constants/app';

export interface JwtPayload {
  _id: string;
  role: string;
}

class JwtService {
  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, APP_CONFIG.secret_key, { expiresIn: '1d' });
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, APP_CONFIG.secret_key) as JwtPayload;
  }
}

export default new JwtService();
