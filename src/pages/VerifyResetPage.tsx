import { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Logo from '../components/ui/Logo';
import OtpForm from '../components/features/auth/OtpForm';
import { useAuthStore } from '../store/auth.store';
import { useVerifyReset } from '../hooks/useAuth';
import { authApi } from '../api/auth.api';
import { StepIndicator } from './ForgotPasswordPage';
import toast from 'react-hot-toast';
import { extractMessage } from '../utils/errorMessages';

/**
 * Verify Reset Code — Step 2 of 3
 *
 * Route: /verify-reset
 * User enters the OTP sent to their email.
 * On success → backend verifies the OTP → navigates to /reset-password with { email } in state.
 */
export default function VerifyResetPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { mutate: verifyReset, isPending: isVerifying } = useVerifyReset();
  const [isResending, setIsResending] = useState(false);

  // Redirect protection
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Guard: must have email from the forgot-password step
  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleOtpSubmit = (otp: string) => {
    verifyReset(
      { email, otp },
      {
        onSuccess: () => {
          // OTP verified — proceed to password reset
          navigate('/reset-password', { state: { email, verified: true } });
        },
      }
    );
  };

  const handleResendOtp = async () => {
    if (isResending) return;
    setIsResending(true);
    try {
      await authApi.forgotPassword(email);
      toast.success('New reset code sent to your email.');
    } catch (error: unknown) {
      const msg = extractMessage(error).toLowerCase();
      if (msg.includes('too many') || msg.includes('wait')) {
        toast.error('Too many requests. Please wait before trying again.');
      } else {
        toast.error(extractMessage(error));
      }
    } finally {
      setIsResending(false);
    }
  };

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
          <StepIndicator currentStep={2} />

          <motion.div
            key="verify-reset-step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#E8003D]/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-[#E8003D]" />
              </div>
              <h2 className="text-lg font-bold text-white">
                Enter verification code
              </h2>
              <p className="text-xs text-[#555555] mt-1">
                We sent a 6-digit code to{' '}
                <span className="text-white font-medium">{email}</span>
              </p>
            </div>

            <OtpForm
              onSubmit={handleOtpSubmit}
              isLoading={isVerifying}
              onResend={handleResendOtp}
              countdownSeconds={300}
            />
          </motion.div>
        </div>

        {/* Back link */}
        <p className="text-center text-sm text-[#555555] mt-6">
          Didn't receive a code?{' '}
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-[#E8003D] hover:underline font-medium bg-transparent border-none cursor-pointer"
          >
            Try a different email
          </button>
        </p>
      </motion.div>
    </div>
  );
}
