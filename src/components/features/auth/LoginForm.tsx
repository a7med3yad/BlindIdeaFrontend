import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { loginSchema, type LoginFormData } from '../../../schemas/auth.schema';
import { useLogin } from '../../../hooks/useAuth';
import { authApi } from '../../../api/auth.api';
import { extractMessage, isOAuthOnlyError, isUnverifiedError } from '../../../utils/errorMessages';

export default function LoginForm() {
  const [oAuthOnlyError, setOAuthOnlyError] = useState(false);
  const [showVerifyWarning, setShowVerifyWarning] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const { mutate: login, isPending: isLoading } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    setOAuthOnlyError(false);
    setShowVerifyWarning(false);
    setServerError(null);
    setLoginEmail(data.email);

    login(data, {
      onError: (error: unknown) => {
        const message = extractMessage(error);
        const msg = message.toLowerCase();

        // OAuth-only account — show social login buttons UI
        if (isOAuthOnlyError(error)) {
          setOAuthOnlyError(true);
          return; // Don't show generic toast — the hook already toasted
        }

        // Unverified email — show verify warning + resend button
        if (isUnverifiedError(error)) {
          setShowVerifyWarning(true);
          toast.error('Please verify your email before logging in.');
          return;
        }

        // Wrong credentials
        if (msg.includes('invalid credentials') || msg.includes('wrong password') || msg.includes('incorrect')) {
          setServerError('Wrong email or password. Please try again.');
          return;
        }

        // No account
        if (msg.includes('not found') || msg.includes('no account') || msg.includes('does not exist')) {
          setServerError('No account found with this email.');
          return;
        }

        // Account locked
        if (msg.includes('account locked') || msg.includes('too many attempts')) {
          setServerError('Account temporarily locked. Try again in 15 minutes.');
          return;
        }

        // Generic fallback
        setServerError(message);
      },
    });
  };

  const handleInputChange = () => {
    if (oAuthOnlyError) setOAuthOnlyError(false);
    if (showVerifyWarning) setShowVerifyWarning(false);
    if (serverError) setServerError(null);
  };

  const handleResendOtp = async () => {
    if (!loginEmail) return;
    try {
      await authApi.resendOtp(loginEmail);
      toast.success('New OTP sent to your email.');
    } catch {
      toast.error('Could not resend OTP. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* OAuth-only account warning */}
      {oAuthOnlyError && (
        <div className="bg-[#1A1A1A] border border-[#E8003D]/40 rounded-xl p-5 text-center">
          <AlertCircle className="w-8 h-8 text-[#E8003D] mx-auto mb-3" />
          <p className="text-white font-semibold mb-1">
            This account uses social login
          </p>
          <p className="text-[#AAAAAA] text-sm mb-4">
            You signed up with Google or GitHub.
            Please use the same method to sign in.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => authApi.loginWithGoogle()}
              className="flex items-center gap-2 bg-white text-black h-9 px-4 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => authApi.loginWithGithub()}
              className="flex items-center gap-2 bg-[#24292F] text-white h-9 px-4 rounded-lg text-sm font-semibold hover:bg-[#3d444d] transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>
        </div>
      )}

      {/* Unverified email warning + Resend OTP */}
      {showVerifyWarning && (
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0" />
            <p className="text-sm text-[#F59E0B] font-medium">
              Your email is not verified
            </p>
          </div>
          <p className="text-xs text-[#AAAAAA] mb-3 ml-7">
            Please verify your email before logging in. Check your inbox for the OTP code.
          </p>
          <div className="flex items-center gap-3 ml-7">
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-xs text-[#E8003D] hover:underline font-medium cursor-pointer"
            >
              Resend OTP
            </button>
            <Link
              to="/verify-email"
              state={{ email: loginEmail }}
              className="text-xs text-[#AAAAAA] hover:text-white no-underline font-medium"
            >
              Go to verification →
            </Link>
          </div>
        </div>
      )}

      {/* Inline server error message */}
      {serverError && !oAuthOnlyError && !showVerifyWarning && (
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
          <p className="text-sm text-[#EF4444]">{serverError}</p>
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        disabled={isLoading}
        {...register('email', { onChange: handleInputChange })}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        disabled={isLoading}
        {...register('password', { onChange: handleInputChange })}
      />

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={isLoading}
        disabled={!isValid || isLoading}
      >
        Sign In
      </Button>
    </form>
  );
}
