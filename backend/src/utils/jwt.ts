import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const generateToken = (payload: object, expiresIn: string | number = '1d') => {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_SECRET as string);
};
