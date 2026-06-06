import type { Request, Response } from 'express';
import type { ApiResponse } from '../types/apiResponse.js';
import type { LoginInput, PublicUser, RegisterInput } from '../types/user.js';
import type { AuthResult } from '../services/authService.js';
import { authService } from '../services/authService.js';

export const register = async (
  req: Request<object, ApiResponse<AuthResult>, RegisterInput>,
  res: Response<ApiResponse<AuthResult>>,
): Promise<void> => {
  const result = await authService.register(req.body);
  if (!result.success) {
    res.status(400).json(result);
    return;
  }
  res.status(201).json(result);
};

export const login = async (
  req: Request<object, ApiResponse<AuthResult>, LoginInput>,
  res: Response<ApiResponse<AuthResult>>,
): Promise<void> => {
  const result = await authService.login(req.body);
  if (!result.success) {
    res.status(401).json(result);
    return;
  }
  res.json(result);
};

export const me = (
  req: Request,
  res: Response<ApiResponse<PublicUser>>,
): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }
  res.json({ success: true, data: req.user });
};

export const logout = (
  _req: Request,
  res: Response<ApiResponse<{ message: string }>>,
): void => {
  res.json({ success: true, data: { message: 'Logged out' } });
};
