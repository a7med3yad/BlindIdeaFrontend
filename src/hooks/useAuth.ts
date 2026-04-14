import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth.api';
import { teamApi } from '../api/team.api';
import { useAuthStore } from '../store/auth.store';
import {
  getRegisterError,
  getAuthError,
  getVerifyEmailError,
  getForgotPasswordError,
  getResetPasswordError,
  getChangePasswordError,

} from '../utils/errorMessages';
import type {
  RegisterRequest,
  LoginRequest,
  VerifyEmailRequest,
  VerifyResetRequest,
  ChangePasswordRequest,
} from '../types/auth.types';

/**
 * After login/verify we fetch all teams and set the active one.
 * This keeps the store populated so every protected page already has data.
 */
async function bootstrapTeams() {
  try {
    const teamsRes = await teamApi.getMyTeams();
    const teams = teamsRes.data;
    useAuthStore.getState().setTeams(teams);

    const active = teams.find((t) => t.isActive) || teams[0];
    if (active) {
      useAuthStore.getState().setActiveTeam(active.id);
    }
  } catch {
    useAuthStore.getState().clearTeams();
  }
}

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (_, variables) => {
      toast.success('Account created! Check your email for the OTP.');
      navigate('/verify-email', { state: { email: variables.email } });
    },
    onError: (error: unknown) => {
      toast.error(getRegisterError(error));
    },
  });
};

export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authApi.verifyEmail(data),
    onSuccess: async (response) => {
      const { accessToken, refreshToken } = response.data;
      login(accessToken, refreshToken);
      await bootstrapTeams();
      toast.success('Email verified! You can now log in.');
      navigate('/dashboard');
    },
    onError: (error: unknown) => {
      const msg = getVerifyEmailError(error);

      // If already verified, show success and redirect
      if (msg.includes('already verified')) {
        toast.success(msg);
        return; // caller will handle redirect
      }

      toast.error(msg);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (response) => {
      const { accessToken, refreshToken } = response.data;
      login(accessToken, refreshToken);
      await bootstrapTeams();
      toast.success('Welcome back!');
      navigate('/dashboard');
    },
    // Error handling is done in LoginForm.tsx for context-specific UI
    // (OAuth-only, verify warning, etc.)
    onError: (error: unknown) => {
      // Only toast generic auth errors here — LoginForm overrides with onError callback
      const msg = getAuthError(error);
      toast.error(msg);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      toast.success('Password reset code sent to your email.');
    },
    onError: (error: unknown) => {
      toast.error(getForgotPasswordError(error));
    },
  });
};

export const useVerifyReset = () => {
  return useMutation({
    mutationFn: (data: VerifyResetRequest) => authApi.verifyReset(data),
    onSuccess: () => {
      toast.success('Password reset successfully! You can now log in.');
    },
    onError: (error: unknown) => {
      toast.error(getResetPasswordError(error));
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully.');
    },
    onError: (error: unknown) => {
      toast.error(getChangePasswordError(error));
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = authStore.refreshToken;
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    },
    onSuccess: () => {
      authStore.logout();
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/login');
    },
    onError: () => {
      // Even if logout API fails, clear local state
      authStore.logout();
      queryClient.clear();
      navigate('/login');
    },
  });
};
