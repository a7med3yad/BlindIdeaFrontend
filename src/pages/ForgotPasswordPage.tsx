import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import Logo from '../components/ui/Logo';
import ForgotPasswordForm from '../components/features/auth/ForgotPasswordForm';
import { useForgotPassword } from '../hooks/useAuth';
import { useAuthStore } from '../store/auth.store';
import { useNavigate, Navigate } from 'react-router-dom';

/**
 * Forgot Password — Step 1 of 3
 *
 * Route: /forgot-password
 * User enters their email → backend sends OTP → redirect to /verify-reset
 */
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { mutate: forgotPassword, isPending: isSending } = useForgotPassword();

  // Redirect protection: if already logged in, don't show this page
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleEmailSubmit = (email: string) => {
    forgotPassword(email, {
      onSuccess: () => {
        // Pass email to the next step via router state
        navigate('/verify-reset', { state: { email } });
      },
    });
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
          {/* Step indicator */}
          <StepIndicator currentStep={1} />

          <motion.div
            key="forgot-step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#E8003D]/10 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-7 h-7 text-[#E8003D]" />
              </div>
              <h2 className="text-lg font-bold text-white">Enter your email</h2>
              <p className="text-xs text-[#555555] mt-1">
                We'll send a verification code to reset your password
              </p>
            </div>
            <ForgotPasswordForm
              onSubmit={handleEmailSubmit}
              isLoading={isSending}
            />
          </motion.div>
        </div>

        {/* Back to login link */}
        <p className="text-center text-sm text-[#555555] mt-6">
          Remember your password?{' '}
          <Link
            to="/login"
            className="text-[#E8003D] hover:underline no-underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// ── Reusable step indicator ──

export function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            s === currentStep
              ? 'w-8 bg-[#E8003D]'
              : s < currentStep
              ? 'w-6 bg-[#E8003D]/50'
              : 'w-6 bg-[#2A2A2A]'
          }`}
        />
      ))}
    </div>
  );
}
