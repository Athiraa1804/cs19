/**
 * Centralised API client for all frontend-backend communication.
 *
 * All service-layer calls go through this module.
 * Base URL defaults to the backend server running on localhost:3001 during dev.
 *
 * In production, set VITE_API_BASE_URL env var.
 * All responses are expected to follow the ApiResponse<T> contract.
 */
import type { ApiResponse } from '../types/apiResponse.js';
import { getAuthToken } from '../../features/auth/utils/authToken';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3001';

/**
 * Typed fetch wrapper that:
 * - Always sends/receives JSON
 * - Returns ApiResponse<T> on success (data parsed from body)
 * - Returns ApiResponse<never> with success:false on network/HTTP error
 * - Never throws — callers always get a usable response
 *
 * @param path   — absolute path from server root, e.g. "/api/faqs"
 * @param options — standard RequestInit, plus optional JSON body
 */
export async function fetchApi<T>(
  path: string,
  options?: Omit<RequestInit, 'body'> & { body?: unknown },
): Promise<ApiResponse<T>> {
  const { body, ...rest } = options ?? {};

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((rest.headers as Record<string, string>) ?? {}),
  };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers,
      body: body !== undefined
        ? typeof body === 'string'
          ? body
          : JSON.stringify(body)
        : undefined,
    });

    const data = await res.json() as ApiResponse<T>;

    // Normalise: if the response already has the ApiResponse shape, return it
    if (typeof data.success === 'boolean') {
      return data;
    }

    // Fallback for malformed responses
    return { success: false, error: `Unexpected response from server (${res.status})` };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { success: false, error: message };
  }
}

/**
 * Convenience: GET request
 */
export function apiGet<T>(path: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
  return fetchApi<T>(path, { method: 'GET', headers });
}

/**
 * Convenience: POST request with JSON body
 */
export function apiPost<T>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
): Promise<ApiResponse<T>> {
  return fetchApi<T>(path, {
    method: 'POST',
    body,
    headers,
  });
}

/**
 * Convenience: PATCH request with JSON body
 */
export function apiPatch<T>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
): Promise<ApiResponse<T>> {
  return fetchApi<T>(path, {
    method: 'PATCH',
    body,
    headers,
  });
}
