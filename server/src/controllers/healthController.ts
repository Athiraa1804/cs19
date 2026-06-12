import type { Request, Response } from 'express';
import type { ApiResponse } from '../types/apiResponse.js';

interface HealthData {
  status: 'ok';
}

export const healthCheck = (
  _req: Request,
  res: Response<ApiResponse<HealthData>>,
): void => {
  res.json({
    success: true,
    data: { status: 'ok' },
  });
};