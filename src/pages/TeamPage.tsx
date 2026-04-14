import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, KeyRound, Layers, Copy, Share2 } from 'lucide-react';

import ConfirmModal from '../components/ui/ConfirmModal';
import Spinner from '../components/ui/Spinner';
import CreateTeamForm from '../components/features/team/CreateTeamForm';
import JoinTeamForm from '../components/features/team/JoinTeamForm';
import TeamCard from '../components/features/team/TeamCard';
import MemberList from '../components/features/team/MemberList';
import {
  useMyTeams,
  useTeamMembers,
  useTeamSwitch,
  useLeaveTeam,
  useDeleteTeam,
} from '../hooks/useTeam';
import { useAuthStore } from '../store/auth.store';
import PageHeader from '../components/layout/PageHeader';
import toast from 'react-hot-toast';

export default function TeamPage() {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [leaveTarget, setLeaveTarget] = useState<string | null>(null);

  const teams = useAuthStore((s) => s.teams);
  const activeTeam = useAuthStore((s) => s.activeTeam);
  const activeTeamId = useAuthStore((s) => s.activeTeamId);

  const { isLoading: isLoadingTeams } = useMyTeams();
  const { data: members, isLoading: isLoadingMembers } = useTeamMembers();
  const { mutate: switchTeam, isPending: isSwitching } = useTeamSwitch();
  const { mutate: leaveTeam, isPending: isLeaving } = useLeaveTeam();
  const { mutate: deleteTeam, isPending: isDeleting } = useDeleteTeam();

  const handleSwitch = (teamId: string) => {
    if (teamId === activeTeamId || isSwitching) return;
    switchTeam(teamId);
  };

  const handleLeave = (teamId: string) => {
    setLeaveTarget(teamId);
  };

  const confirmLeave = () => {
    if (!leaveTarget || isLeaving) return;
    leaveTeam(leaveTarget);
    setLeaveTarget(null);
  };

  const handleDelete = (teamId: string) => {
    setDeleteTarget(teamId);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteTeam(deleteTarget);
    setDeleteTarget(null);
  };

  const deleteTargetTeam = teams.find((t) => t.id === deleteTarget);
  const leaveTargetTeam = teams.find((t) => t.id === leaveTarget);

  // ── Loading state ─────────────────────────────────────────
  if (isLoadingTeams && teams.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Spinner size={32} />
            <p className="text-sm text-[#555555] mt-3">Loading teams...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Team"
        subtitle="Manage teams, invite members, and switch context instantly."
      />

      <div className="max-w-6xl mx-auto px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-8">

          {/* Team tabs */}
          {teams.length > 0 ? (
            <div className="flex items-center gap-6 border-b border-[#1A1A1A] overflow-x-auto">
              {teams.map((t) => {
                const isActive = t.id === activeTeamId;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => handleSwitch(t.id)}
                    disabled={isSwitching}
                    className={`
                      relative whitespace-nowrap py-3 text-sm font-semibold transition-colors cursor-pointer
                      ${isActive ? 'text-white' : 'text-[#555555] hover:text-[#AAAAAA]'}
                    `}
                  >
                    {t.name}
                    <span
                      className={`
                        absolute left-0 -bottom-px h-[2px] w-full transition-all
                        ${isActive ? 'bg-[#E8003D]' : 'bg-transparent'}
                      `}
                    />
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* Active team hero card */}
          {activeTeam ? (
            <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-8">
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="min-w-0">
                  <div className="text-xs font-semibold tracking-widest uppercase text-[#555555]">
                    Active team
                  </div>
                  <div className="text-2xl font-black text-white mt-2">
                    {activeTeam.name}
                  </div>
                  <div className="text-sm text-[#AAAAAA] mt-2">
                    {activeTeam.memberCount ?? 0} members
                    {' · '}
                    Created {new Date(activeTeam.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {' · '}
                    Ideas — 
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  <div className="text-xs font-semibold tracking-widest uppercase text-[#555555] mb-2">
                    Invite code
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl h-12 px-4 flex items-center">
                      <code className="font-mono text-lg font-black tracking-[0.25em] text-white">
                        {activeTeam.inviteCode}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(activeTeam.inviteCode);
                        toast.success('Invite code copied!');
                      }}
                      className="h-12 w-12 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E8003D]/40 transition-colors flex items-center justify-center text-[#AAAAAA] hover:text-white cursor-pointer"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const text = `Join my BlindIdea team with code: ${activeTeam.inviteCode}`;
                        const navAny = navigator as unknown as { share?: (data: { text: string }) => Promise<void> };
                        if (typeof navAny.share === 'function') {
                          await navAny.share({ text });
                        } else {
                          await navigator.clipboard.writeText(text);
                          toast.success('Share message copied!');
                        }
                      }}
                      className="h-12 w-12 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E8003D]/40 transition-colors flex items-center justify-center text-[#AAAAAA] hover:text-white cursor-pointer"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-[#555555] mt-2">
                    Share this code with teammates
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* ── All My Teams Section ───────────────────────────── */}
          {teams.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-[#E8003D]" />
                <h2 className="text-xl font-bold text-white">My Teams</h2>
                <span className="text-sm text-[#555555] font-normal ml-1">
                  ({teams.length})
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    isActive={team.id === activeTeamId}
                    onSwitch={handleSwitch}
                    onLeave={handleLeave}
                    onDelete={handleDelete}
                    isSwitching={isSwitching}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── Active Team Members ────────────────────────────── */}
          {activeTeam && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#AAAAAA]" />
                <h2 className="text-xl font-bold text-white">
                  Members — {activeTeam.name}
                </h2>
                {members && (
                  <span className="text-sm text-[#555555] font-normal">
                    ({members.length})
                  </span>
                )}
              </div>
              {isLoadingMembers ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner size={24} />
                </div>
              ) : (
                <MemberList members={members || []} />
              )}
            </section>
          )}

          {/* ── Join / Create Section ──────────────────────────── */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Join another team */}
              <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-[#E8003D]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Join Team</h2>
                    <p className="text-xs text-[#555555]">Enter an invite code</p>
                  </div>
                </div>
                <JoinTeamForm />
              </div>

              {/* Create new team */}
              <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#E8003D]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Create Team</h2>
                    <p className="text-xs text-[#555555]">Start a new team</p>
                  </div>
                </div>
                <CreateTeamForm />
              </div>
            </div>
          </section>

          {/* ── Leave Confirmation Modal ────────────────────────── */}
          <ConfirmModal
            isOpen={!!leaveTarget}
            title="Leave Team"
            message={`Are you sure you want to leave ${leaveTargetTeam?.name || 'this team'}? You will need a new invite code to rejoin.`}
            confirmText="Leave"
            confirmClassName="bg-[#EF4444] hover:bg-[#DC2626]"
            onConfirm={confirmLeave}
            onCancel={() => setLeaveTarget(null)}
            isLoading={isLeaving}
          />

          {/* ── Delete Confirmation Modal ──────────────────────── */}
          <ConfirmModal
            isOpen={!!deleteTarget}
            title="Delete Team"
            message={`This will permanently delete ${deleteTargetTeam?.name || 'this team'} and all its ideas. This action cannot be undone.`}
            confirmText="Delete Team"
            confirmClassName="bg-[#EF4444] hover:bg-[#DC2626]"
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
            isLoading={isDeleting}
          />
        </motion.div>
      </div>
    </div>
  );
}
