import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LoginPage } from './LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    me: vi.fn().mockResolvedValue({ success: false, error: 'No session' }),
    login: vi.fn().mockResolvedValue({
      success: true,
      data: {
        token: 'token',
        user: {
          id: 'intern-1',
          name: 'Intern User',
          email: 'intern@example.com',
          role: 'intern',
          createdAt: new Date().toISOString(),
        },
      },
    }),
    logout: vi.fn().mockResolvedValue({ success: true, data: { message: 'Logged out' } }),
  },
}));

describe('LoginPage', () => {
  it('renders and submits login credentials', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'intern@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'intern12345');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(authService.login).toHaveBeenCalledWith({
      email: 'intern@example.com',
      password: 'intern12345',
    });
  });
});
