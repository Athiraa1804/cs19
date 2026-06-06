import jwt from 'jsonwebtoken';
import type { PublicUser } from '../types/user.js';

interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  role: PublicUser['role'];
}

const TOKEN_TTL_SECONDS = Number(process.env.JWT_TTL_SECONDS ?? 60 * 60 * 24 * 7);

function secret(): string {
  return process.env.JWT_SECRET ?? 'dev-secret-change-before-production';
}

export function signToken(user: PublicUser): string {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return jwt.sign(payload, secret(), { expiresIn: TOKEN_TTL_SECONDS });
}

export function verifyToken(token: string): PublicUser | null {
  try {
    const payload = jwt.verify(token, secret()) as TokenPayload;
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      createdAt: '',
    };
  } catch {
    return null;
  }
}
