import type { ApiResponse } from '../../../shared/types/apiResponse';
import { apiGet, apiPost } from '../../../shared/utils/apiClient';
import type { AuthResult, AuthUser, LoginInput, RegisterInput } from '../types/auth.types';

export function login(input: LoginInput): Promise<ApiResponse<AuthResult>> {
  return apiPost<AuthResult>('/api/auth/login', input);
}

export function register(input: RegisterInput): Promise<ApiResponse<AuthResult>> {
  return apiPost<AuthResult>('/api/auth/register', input);
}

export function me(): Promise<ApiResponse<AuthUser>> {
  return apiGet<AuthUser>('/api/auth/me');
}

export function logout(): Promise<ApiResponse<{ message: string }>> {
  return apiPost<{ message: string }>('/api/auth/logout');
}

export const authService = {
  login,
  register,
  me,
  logout,
};
