import type { ApiResponse } from '../types/apiResponse.js';
import type { LoginInput, PublicUser, RegisterInput, User } from '../types/user.js';
import { userRepository } from '../repositories/userRepository.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signToken } from '../utils/token.js';
import { loginSchema, registerSchema, zodErrors } from '../utils/authValidator.js';

export interface AuthResult {
  user: PublicUser;
  token: string;
}

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const authService = {
  async register(input: RegisterInput): Promise<ApiResponse<AuthResult>> {
    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: zodErrors(parsed.error) };
    const { name, email, password, role, adminCode } = parsed.data;

    if (!validateEmail(email)) return { success: false, error: 'A valid email is required' };
    if (role === 'admin') {
      const configuredAdminCode = process.env.ADMIN_REGISTRATION_CODE;
      if (!configuredAdminCode || adminCode !== configuredAdminCode) {
        return { success: false, error: 'Invalid admin registration code' };
      }
    }
    if (await userRepository.findByEmail(email)) return { success: false, error: 'An account with this email already exists' };

    const user = await userRepository.create({ name, email, password, role, adminCode, passwordHash: await hashPassword(password) });
    const publicUser = toPublicUser(user);
    return { success: true, data: { user: publicUser, token: signToken(publicUser) } };
  },

  async login(input: LoginInput): Promise<ApiResponse<AuthResult>> {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: zodErrors(parsed.error) };
    const { email, password } = parsed.data;
    const user = await userRepository.findByEmail(email);

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return { success: false, error: 'Invalid email or password' };
    }

    const publicUser = toPublicUser(user);
    return { success: true, data: { user: publicUser, token: signToken(publicUser) } };
  },

  async getPublicUserById(id: string): Promise<PublicUser | undefined> {
    const user = await userRepository.findById(id);
    return user ? toPublicUser(user) : undefined;
  },
};
