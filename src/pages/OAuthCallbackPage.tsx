import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/auth.store';
import { teamApi } from '../api/team.api';
import Spinner from '../components/ui/Spinner';
import Logo from '../components/ui/Logo';

/**
 * OAuth Callback Page — handles both /oauth-callback and /external-callback
 *
 * The backend redirects here after Google/GitHub login with:
 *   /oauth-callback?accessToken=...&refreshToken=...
 *   OR /external-callback?accessToken=...&refreshToken=...
 *
 * Flow:
 *  1. Read tokens from URL query params (useSearchParams — no window.location)
 *  2. Store via auth store (localStorage)
 *  3. Clear tokens from URL (history.replaceState)
 *  4. Bootstrap teams
 *  5. Redirect to /dashboard
 *
 * If tokens are missing or an error param exists → redirect to /login
 */
export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    // Strict mode guard — prevent double execution
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      try {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const errorParam = searchParams.get('error');

        // ── Clean tokens from the URL immediately ──────────────────
        window.history.replaceState({}, document.title, window.location.pathname);

        // ── Handle error parameter from backend ────────────────────
        if (errorParam) {
          const decoded = decodeURIComponent(errorParam);
          const friendlyMessage =
            decoded === 'no_email'
              ? 'Could not retrieve your email from the provider.'
              : decoded === 'oauth_failed'
                ? 'External login failed. Please try again.'
                : 'Authentication failed. Please try again.';

          setStatus('error');
          setErrorMessage(friendlyMessage);
          toast.error(friendlyMessage);
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        // ── Validate tokens ────────────────────────────────────────
        if (!accessToken || !refreshToken) {
          setStatus('error');
          setErrorMessage('Authentication failed — no tokens received.');
          toast.error('Login failed. Please try again.');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        // ── Validate token format (basic JWT check) ────────────────
        if (accessToken.split('.').length !== 3) {
          setStatus('error');
          setErrorMessage('Invalid authentication token received.');
          toast.error('Login failed. Invalid token.');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        // ── Store tokens & set auth state ──────────────────────────
        login(accessToken, refreshToken);

        // ── Bootstrap teams (same as normal login flow) ────────────
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

        toast.success('Welcome to BlindIdea!');
        navigate('/dashboard', { replace: true });
      } catch {
        setStatus('error');
        setErrorMessage('Something went wrong during sign in.');
        toast.error('Login failed. Please try again.');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [login, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6"
      >
        <Logo size="lg" />

        {status === 'error' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <p className="text-[#EF4444] text-base font-medium mb-2">Login failed</p>
            <p className="text-[#555555] text-sm max-w-xs">{errorMessage}</p>
            <p className="text-[#555555] text-xs mt-3">Redirecting to login...</p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#E8003D]/20 animate-ping" />
              <Spinner size={32} />
            </div>
            <div className="text-center">
              <p className="text-white text-base font-medium">Completing sign in...</p>
              <p className="text-[#555555] text-sm mt-1">Please wait while we set everything up</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
