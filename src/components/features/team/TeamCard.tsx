import { Copy, RefreshCw, Users, Shield, Check, ArrowRightLeft, LogOut, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Badge from '../../ui/Badge';
import type { TeamResponseDto } from '../../../types/team.types';
import { useRegenerateInvite } from '../../../hooks/useTeam';

interface TeamCardProps {
  team: TeamResponseDto;
  isActive: boolean;
  onSwitch?: (teamId: string) => void;
  onLeave?: (teamId: string) => void;
  onDelete?: (teamId: string) => void;
  isSwitching?: boolean;
}

export default function TeamCard({
  team,
  isActive,
  onSwitch,
  onLeave,
  onDelete,
  isSwitching,
}: TeamCardProps) {
  const { mutate: regenerate, isPending: isRegenerating } = useRegenerateInvite();

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(team.inviteCode);
      toast.success('Invite code copied!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div
      className={`
        bg-[#0D0D0D] border rounded-xl p-5 space-y-4 transition-all duration-200
        ${isActive ? 'border-[#E8003D]/40 shadow-lg shadow-[#E8003D]/5' : 'border-[#2A2A2A] hover:border-[#3A3A3A]'}
      `}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center shrink-0
              ${isActive ? 'bg-[#E8003D]/15' : 'bg-[#1A1A1A]'}
            `}
          >
            <Users className={`w-5 h-5 ${isActive ? 'text-[#E8003D]' : 'text-[#555555]'}`} />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{team.name}</h3>
            <p className="text-xs text-[#555555]">
              {team.memberCount} member{team.memberCount !== 1 ? 's' : ''}
              {' · '}
              Created {new Date(team.createdAt).toLocaleDateString()}
              {team.joinedAt && (
                <>
                  {' · '}
                  Joined {new Date(team.joinedAt).toLocaleDateString()}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 shrink-0">
          {isActive && <Badge variant="success"><Check className="w-2.5 h-2.5 mr-1" />Active</Badge>}
          {team.isAdmin && <Badge variant="warning"><Shield className="w-2.5 h-2.5 mr-1" />Admin</Badge>}
        </div>
      </div>

      {/* Invite code row */}
      <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-lg px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#555555] mr-1">Invite:</span>
        <code className="text-sm font-mono text-white tracking-wider flex-1 truncate">
          {team.inviteCode}
        </code>
        <button
          onClick={copyCode}
          className="p-1.5 text-[#555555] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          title="Copy invite code"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        {team.isAdmin && (
          <button
            onClick={() => regenerate(team.id)}
            disabled={isRegenerating}
            className="p-1.5 text-[#555555] hover:text-[#E8003D] rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
            title="Regenerate invite code"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        {!isActive && onSwitch && (
          <button
            onClick={() => onSwitch(team.id)}
            disabled={isSwitching}
            className="
              flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold
              bg-[#E8003D] text-white hover:bg-[#CC0035] transition-all
              disabled:opacity-50 cursor-pointer
            "
          >
            <ArrowRightLeft className="w-3 h-3" />
            Switch
          </button>
        )}
        {!team.isAdmin && onLeave && (
          <button
            onClick={() => onLeave(team.id)}
            className="
              flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold
              text-[#AAAAAA] border border-[#2A2A2A] hover:text-white hover:border-[#3A3A3A]
              transition-all cursor-pointer
            "
          >
            <LogOut className="w-3 h-3" />
            Leave
          </button>
        )}
        {team.isAdmin && onDelete && (
          <button
            onClick={() => onDelete(team.id)}
            className="
              flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold
              text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/10
              transition-all cursor-pointer
            "
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
