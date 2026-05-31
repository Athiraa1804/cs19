/**
 * Simple role simulation — no real auth.
 * Current user role is hardcoded here for the MVP.
 * Replace with real auth context/hook in production.
 */
export type SimulatedRole = 'intern' | 'admin';

export const CURRENT_ROLE: SimulatedRole = 'admin'; // Change to 'intern' to simulate i


export function isAdmin(): boolean {
  return CURRENT_ROLE === 'admin';
}

export function isIntern(): boolean {
  return CURRENT_ROLE === 'intern';
}