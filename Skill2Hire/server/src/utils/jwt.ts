import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface TokenPayload {
  id: string;
  email: string;
  fullName?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
};
