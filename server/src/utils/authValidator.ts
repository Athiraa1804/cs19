import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('A valid email is required').transform((email) => email.toLowerCase()),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  role: z.enum(['intern', 'admin']),
  adminCode: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('A valid email is required').transform((email) => email.toLowerCase()),
  password: z.string().min(1, 'Password is required'),
});

export function zodErrors(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join('; ');
}
