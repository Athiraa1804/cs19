/**
 * Simple role simulation — no real auth.
 * Current user role is hardcoded here for the MVP.
 * Replace with real auth context/hook in production.
 *
 * SECURITY NOTE:
 * This role simulation is only for MVP/demo UI behavior.
 * It is not real authorization.
 * Real admin permissions must be enforced by the backend using session/JWT/server-side checks.
 * Do not rely on this file for production security.
 */
export type SimulatedRole = 'intern' | 'admin';

export const CURRENT_ROLE: SimulatedRole = 'admin'; // Change to 'intern' to simulate intern view


export function isAdmin(): boolean {
  return CURRENT_ROLE === 'admin';
}

export function isIntern(): boolean {
  return CURRENT_ROLE === 'intern';
}