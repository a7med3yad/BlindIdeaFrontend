import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock, Mail, Shield, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { useChangePassword, useLogout } from '../hooks/useAuth';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '../schemas/auth.schema';
import PageHeader from '../components/layout/PageHeader';
import ConfirmModal from '../components/ui/ConfirmModal';
import Button from '../components/ui/Button';
import { avatarColorsFromEmail } from '../utils/avatar';

export default function ProfilePage() {
  const email = useAuthStore((s) => s.email);
  const role = useAuthStore((s) => s.role);
  const accessToken = useAuthStore((s) => s.accessToken);
  const { mutate: changePassword, isPending } = useChangePassword();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const newPassword = watch('newPassword', '');

  const memberSince = useMemo(() => {
    if (!accessToken) return null;
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const iat = payload.iat;
      if (!iat) return null;
      const d = new Date(Number(iat) * 1000);
      if (Number.isNaN(d.getTime())) return null;
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } catch {
      return null;
    }
  }, [accessToken]);

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: '#EF4444' };
    if (score === 2) return { level: 2, label: 'Fair', color: '#F59E0B' };
    if (score === 3) return { level: 3, label: 'Good', color: '#FACC15' };
    return { level: 4, label: 'Strong', color: '#22C55E' };
  };

  const strength = getPasswordStrength(newPassword);
  const avatar = avatarColorsFromEmail(email);

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => reset() }
    );
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Profile"
        subtitle="Manage your account settings."
      />

      <div className="max-w-3xl mx-auto px-8 py-8 space-y-6">

        {/* Account Information Card */}
        <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl border flex items-center justify-center text-xl font-black"
              style={{
                backgroundColor: avatar.bg,
                borderColor: avatar.border,
                color: avatar.text,
              }}
            >
              {String(email || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#555555]">
                Account
              </div>
              <div className="text-white text-lg font-black mt-1 truncate">
                {email}
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span
                  className={`h-6 px-2.5 rounded-md text-[11px] font-semibold border ${
                    role === 'Admin'
                      ? 'bg-[#E8003D]/10 text-[#E8003D] border-[#E8003D]/25'
                      : 'bg-[#1A1A1A] text-[#AAAAAA] border-[#2A2A2A]'
                  }`}
                >
                  {role === 'Admin' ? 'Admin' : 'User'}
                </span>
                <span className="text-xs text-[#555555]">
                  Member since {memberSince || '—'}
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[#555555]">
              <Mail className="w-4 h-4" />
              <Shield className="w-4 h-4" />
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#1A1A1A] rounded-xl flex items-center justify-center border border-[#2A2A2A]">
              <Lock className="w-5 h-5 text-[#E8003D]" />
            </div>
            <h2 className="text-lg font-bold text-white">Change Password</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#AAAAAA] mb-2 block">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                disabled={isPending}
                {...register('currentPassword')}
                className="w-full h-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 text-white placeholder-[#555555] focus:border-[#E8003D] focus:outline-none"
              />
              {errors.currentPassword && (
                <p className="text-xs text-[#EF4444] mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-[#AAAAAA] mb-2 block">
                New Password
              </label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                disabled={isPending}
                {...register('newPassword')}
                className="w-full h-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 text-white placeholder-[#555555] focus:border-[#E8003D] focus:outline-none"
              />
              {errors.newPassword && (
                <p className="text-xs text-[#EF4444] mt-1">
                  {errors.newPassword.message}
                </p>
              )}
              {newPassword ? (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        className="h-1.5 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            seg <= strength.level ? strength.color : '#2A2A2A',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: strength.color }}>
                    {strength.label}
                  </p>
                </div>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-[#AAAAAA] mb-2 block">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Re-enter new password"
                disabled={isPending}
                {...register('confirmPassword')}
                className="w-full h-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 text-white placeholder-[#555555] focus:border-[#E8003D] focus:outline-none"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-[#EF4444] mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" fullWidth isLoading={isPending} disabled={!isValid || isPending}>
              Update Password
            </Button>
          </form>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-[#0D0D0D] border border-[#EF4444]/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            <h2 className="text-lg font-bold text-[#EF4444]">Danger Zone</h2>
          </div>
          <p className="text-[#AAAAAA] text-sm mb-2">
            Logging out will end your current session.
          </p>
          <p className="text-[#555555] text-xs mb-6">
            This action cannot be undone.
          </p>

          <button
            type="button"
            onClick={() => setConfirmSignOut(true)}
            disabled={isLoggingOut}
            className="w-full h-12 bg-transparent border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-lg font-semibold text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>

        {/* Sign Out Confirm Modal */}
        <ConfirmModal
          isOpen={confirmSignOut}
          title="Confirm sign out"
          message="Are you sure you want to sign out? You'll need to sign in again to access your teams and ideas."
          confirmText="Sign Out"
          confirmClassName="bg-[#EF4444] hover:bg-[#DC2626]"
          onConfirm={() => {
            setConfirmSignOut(false);
            logout();
          }}
          onCancel={() => setConfirmSignOut(false)}
          isLoading={isLoggingOut}
        />
      </div>
    </div>
  );
}
