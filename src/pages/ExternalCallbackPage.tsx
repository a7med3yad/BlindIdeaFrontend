import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/auth.store';
import { teamApi } from '../api/team.api';
import Spinner from '../components/ui/Spinner';

export default function ExternalCallbackPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The backend redirects to /external-callback with tokens as query params
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const errorParam = params.get('error');

        // Check for error parameter from backend redirect
        if (errorParam) {
          const decodedError = decodeURIComponent(errorParam);

          if (decodedError === 'no_email') {
            toast.error('Could not get your email from Google/GitHub.');
          } else {
            toast.error('Google/GitHub login failed. Please try again.');
          }

          setError(decodedError);
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        if (accessToken && refreshToken) {
          login(accessToken, refreshToken);

          // Bootstrap teams after OAuth login (same as normal login)
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
        } else {
          toast.error('Google/GitHub login failed. Please try again.');
          setError('Authentication failed. No tokens received.');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
        }
      } catch {
        toast.error('Google/GitHub login failed. Please try again.');
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [login, navigate]);

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center">
      {error ? (
        <div className="text-center">
          <p className="text-[#EF4444] text-lg mb-2">Login failed</p>
          <p className="text-[#555555] text-sm">Redirecting to login...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Spinner size={32} />
          <p className="text-[#AAAAAA] text-base">Completing sign in...</p>
        </div>
      )}
    </div>
  );
}
