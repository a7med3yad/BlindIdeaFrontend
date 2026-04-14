import { useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, CheckCircle } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import PasswordStrengthIndicator from '../components/features/auth/PasswordStrengthIndicator';
import { useChangeForgottenPassword } from '../hooks/useAuth';
import { useAuthStore } from '../store/auth.store';
import { StepIndicator } from './ForgotPasswordPage';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '../schemas/auth.schema';

/**
 * Reset Password — Step 3 of 3
 *
 * Route: /reset-password
 * User sets a new password after verifying OTP.
 *
 * Receives { email, verified } from router state (passed by VerifyResetPage).
 * On submit → calls POST /api/Auth/change-forgotten-password with { email, newPassword, confirmPassword }
 * On success → redirect to /login with a success message.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; verified?: boolean } | null;
  const email = state?.email;
  const verified = state?.verified;

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { mutate: changeForgottenPassword, isPending: isResetting } = useChangeForgottenPassword();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const watchPassword = watch('newPassword', '');

  // Redirect protection
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Guard: must have email + verified flag from previous steps
  if (!email || !verified) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleResetPassword = (data: ResetPasswordFormData) => {
    changeForgottenPassword(
      {
        email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          // Brief success animation, then redirect
          setTimeout(() => {
            navigate('/login', {
              replace: true,
              state: { resetSuccess: true },
            });
          }, 2000);
        },
      }
    );
  };

  // ── Success state ──
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-[#22C55E]" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Password Reset Successful!
          </h2>
          <p className="text-[#555555] text-sm">
            Redirecting you to sign in...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" linkTo="/" />
          </div>
          <p className="text-sm text-[#555555]">Reset your password</p>
        </div>

        <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-8">
          <StepIndicator currentStep={3} />

          <motion.div
            key="reset-step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#E8003D]/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-[#E8003D]" />
              </div>
              <h2 className="text-lg font-bold text-white">
                Set new password
              </h2>
              <p className="text-xs text-[#555555] mt-1">
                Choose a strong password for your account
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleResetPassword)}
              className="space-y-4"
            >
              <div>
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Min. 8 characters"
                  error={errors.newPassword?.message}
                  disabled={isResetting}
                  {...register('newPassword')}
                />
                <PasswordStrengthIndicator password={watchPassword} />
              </div>

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                error={errors.confirmPassword?.message}
                disabled={isResetting}
                {...register('confirmPassword')}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isResetting}
                disabled={!isValid || isResetting}
              >
                Reset Password
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Security note */}
        <div className="mt-6 p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl">
          <p className="text-xs text-[#555555] text-center leading-relaxed">
            🔒 For security, you'll be redirected to sign in with your new
            password after resetting.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
