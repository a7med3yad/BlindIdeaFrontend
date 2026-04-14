import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  BarChart3,
  FileText,
  Users,
  ArrowRight,
  Trophy,
  Clock,
  Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import { useAuthStore } from '../store/auth.store';
import StatsCard from '../components/features/dashboard/StatsCard';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/layout/PageHeader';
import StarRating from '../components/ui/StarRating';
import { useTeamMembers } from '../hooks/useTeam';
import { avatarColorsFromEmail } from '../utils/avatar';
import { formatTimeAgo, isWithinHours } from '../utils/time';

export default function DashboardPage() {
  const hasTeam = useAuthStore((s) => s.hasTeam);
  const activeTeam = useAuthStore((s) => s.activeTeam);
  const activeTeamId = useAuthStore((s) => s.activeTeamId);
  const email = useAuthStore((s) => s.email);
  const { data: members } = useTeamMembers();

  const {
    data: dashboard,
    isLoading,
  } = useQuery({
    queryKey: ['dashboard', activeTeamId],
    queryFn: async () => {
      try {
        const res = await dashboardApi.getDashboard();
        return res.data;
      } catch (error: any) {
        // Only show toast for server errors (500+) — other errors are expected/silent
        if (error.response?.status >= 500) {
          toast.error('Failed to load dashboard. Please refresh.');
        }
        throw error;
      }
    },
    enabled: hasTeam && !!activeTeamId,
    staleTime: 5 * 60_000,
  });


  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  // ── Loading ────────────────────────────────────────────────
  if (isLoading && hasTeam) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Spinner size={32} />
            <p className="text-sm text-[#555555] mt-3">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── No team ────────────────────────────────────────────────
  if (!hasTeam || !dashboard) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-20 h-20 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-9 h-9 text-[#555555]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Join a team to get started
            </h2>
            <p className="text-[#AAAAAA] text-base mb-8 max-w-md">
              You need to be part of a team to see your dashboard. Create or
              join a team to start sharing ideas.
            </p>
            <Link to="/team">
              <Button size="lg">
                Go to Team
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Map EXACT backend field names
  const newIdeasThisWeek =
    (dashboard.recentIdeas || []).filter((i: any) => {
      const ts = new Date(i.createdAt).getTime();
      if (Number.isNaN(ts)) return false;
      return Date.now() - ts < 7 * 24 * 60 * 60 * 1000;
    }).length || 0;

  const stats = [
    {
      label: 'Total Ideas',
      value: dashboard.ideas?.totalIdeas ?? 0,
      icon: Lightbulb,
      trend: {
        label: `+${newIdeasThisWeek} this week`,
        tone: (newIdeasThisWeek > 0 ? 'up' : 'neutral') as 'up' | 'neutral',
      },
    },
    {
      label: 'Total Ratings',
      value: dashboard.ideas?.totalRatings ?? 0,
      icon: Trophy,
    },
    {
      label: 'Avg Rating',
      value:
        dashboard.ideas?.overallAverageRating > 0
          ? dashboard.ideas.overallAverageRating.toFixed(1)
          : '—',
      icon: BarChart3,
    },
    {
      label: 'My Ideas',
      value: dashboard.ideas?.ideasSubmittedByMe ?? 0,
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Dashboard"
        subtitle={
          activeTeam
            ? `Viewing insights for ${activeTeam.name}`
            : "Your team's idea insights at a glance."
        }
        action={(
          <Link to="/ideas">
            <Button size="sm" className="h-10 px-5 rounded-lg text-sm font-semibold">
              New Idea
            </Button>
          </Link>
        )}
      />

      <div className="max-w-6xl mx-auto px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-8">

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatsCard key={stat.label} {...stat} index={i} />
            ))}
          </div>

          {/* Top Rated + Recent Ideas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Rated Ideas */}
            <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-white">
                  Top Rated Ideas
                </h2>
              </div>
              {dashboard.topIdeas?.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.topIdeas.map((idea: any, i: number) => (
                    <div
                      key={idea.id}
                      className="flex items-center justify-between bg-[#1A1A1A] rounded-xl px-4 py-3 border border-[#2A2A2A]/50 hover:border-[#E8003D]/25 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                            i === 0
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#AAAAAA]'
                          }`}
                        >
                          #{i + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white text-sm font-semibold truncate">
                            {idea.title}
                          </div>
                          <div className="text-xs text-[#555555] mt-0.5">
                            {formatTimeAgo(idea.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StarRating value={Math.round(idea.averageRating || 0)} readonly size={16} />
                        <span className="text-[#AAAAAA] text-sm font-bold tabular-nums">
                          {(idea.averageRating || 0).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#555555] text-sm text-center py-8">
                  No rated ideas yet
                </p>
              )}
            </div>

            {/* Recent Ideas */}
            <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-[#AAAAAA]" />
                <h2 className="text-lg font-bold text-white">Recent Ideas</h2>
              </div>
              {dashboard.recentIdeas?.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.recentIdeas.map((idea: any) => (
                    <div
                      key={idea.id}
                      className="flex items-center justify-between bg-[#1A1A1A] rounded-xl px-4 py-3 border border-[#2A2A2A]/50 hover:border-[#E8003D]/25 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-white text-sm font-semibold truncate">
                          {idea.title}
                        </div>
                        <div className="text-[#555555] text-xs mt-0.5">
                          {formatTimeAgo(idea.createdAt)}
                        </div>
                      </div>
                      {isWithinHours(idea.createdAt, 24) ? (
                        <span className="ml-3 shrink-0 h-6 px-2.5 rounded-md text-[11px] font-semibold bg-[#E8003D]/10 text-[#E8003D] border border-[#E8003D]/25">
                          New
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#555555] text-sm text-center py-8">
                  No ideas yet
                </p>
              )}
            </div>
          </div>

          {/* Active Team Card */}
          {activeTeam && (
            <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Active Team</h2>
                {activeTeam.isAdmin && (
                  <Badge variant="warning">Admin</Badge>
                )}
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-[#1A1A1A] rounded-xl flex items-center justify-center border border-[#2A2A2A] flex-shrink-0">
                  <Users className="w-6 h-6 text-[#E8003D]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {activeTeam.name}
                  </h3>
                  <p className="text-[#AAAAAA] text-sm">
                    {activeTeam.memberCount ?? 0} member
                    {activeTeam.memberCount !== 1 ? 's' : ''}
                    {' · '}
                    Created {formatDate(activeTeam.createdAt)}
                  </p>
                </div>
              </div>

              {members && members.length > 0 ? (
                <div className="flex items-center justify-between gap-6 mb-6">
                  <div className="flex -space-x-2">
                    {members.slice(0, 6).map((m: any) => {
                      const colors = avatarColorsFromEmail(m.email);
                      return (
                        <div
                          key={m.id}
                          className="w-9 h-9 rounded-full border border-[#2A2A2A] flex items-center justify-center text-xs font-black"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            borderColor: colors.border,
                          }}
                          title={m.email}
                        >
                          {String(m.email || '?').charAt(0).toUpperCase()}
                        </div>
                      );
                    })}
                    {members.length > 6 ? (
                      <div className="w-9 h-9 rounded-full border border-[#2A2A2A] bg-[#1A1A1A] flex items-center justify-center text-xs font-bold text-[#AAAAAA]">
                        +{members.length - 6}
                      </div>
                    ) : null}
                  </div>
                  {email ? (
                    <div className="text-right min-w-0">
                      <div className="text-xs text-[#555555]">You</div>
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <div className="text-sm text-white font-semibold truncate max-w-[260px]">
                          {email}
                        </div>
                        {activeTeam.isAdmin ? (
                          <span className="h-6 px-2.5 rounded-md text-[11px] font-semibold bg-[#E8003D]/10 text-[#E8003D] border border-[#E8003D]/25">
                            Admin
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Invite Code with copy button */}
              <div>
                <label className="text-xs font-medium text-[#555555] uppercase tracking-wider mb-2 block">
                  Invite Code
                </label>
                <div className="flex items-center gap-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 h-12">
                  <code className="text-[#E8003D] font-mono font-bold text-lg flex-1 tracking-widest">
                    {activeTeam.inviteCode}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeTeam.inviteCode);
                      toast.success('Invite code copied!');
                    }}
                    className="text-[#555555] hover:text-white transition-colors p-1 cursor-pointer"
                    aria-label="Copy invite code"
                    title="Copy invite code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
