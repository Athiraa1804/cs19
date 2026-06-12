/**
 * Standard API response envelope used across all backend routes.
 * Every route handler must return this shape — either { success: true, data: T }
 * or { success: false, error: string }.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}