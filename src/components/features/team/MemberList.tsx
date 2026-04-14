import { UserX, Crown } from 'lucide-react';
import Badge from '../../ui/Badge';
import Card from '../../ui/Card';
import type { TeamMember } from '../../../types/team.types';
import { useAuthStore } from '../../../store/auth.store';
import { useRemoveMember } from '../../../hooks/useTeam';
import { avatarColorsFromEmail } from '../../../utils/avatar';

interface MemberListProps {
  members: TeamMember[];
}

export default function MemberList({ members }: MemberListProps) {
  const email = useAuthStore((s) => s.email);
  const activeTeam = useAuthStore((s) => s.activeTeam);
  const isAdmin = activeTeam?.isAdmin === true;
  const { mutate: removeMember, isPending } = useRemoveMember();

  if (members.length === 0) {
    return (
      <Card>
        <p className="text-center text-[#555555] py-4">No members found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div
          key={member.id}
          className="group flex items-center justify-between bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl px-4 py-3 hover:border-[#3A3A3A] transition-colors"
        >
          <div className="flex items-center gap-3">
            {(() => {
              const colors = avatarColorsFromEmail(member.email);
              return (
                <div
                  className="w-9 h-9 rounded-full border flex items-center justify-center text-xs font-black"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderColor: colors.border,
                  }}
                >
                  {member.email.charAt(0).toUpperCase()}
                </div>
              );
            })()}
            <div>
              <p className="text-sm text-white">
                {member.email}
                {member.email === email && (
                  <span className="text-[#555555] ml-1">(you)</span>
                )}
              </p>
              <p className="text-xs text-[#555555]">
                Joined {new Date(member.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {member.role === 'Admin' ? (
              <Badge variant="warning">
                <Crown className="w-2.5 h-2.5 mr-1" />
                Admin
              </Badge>
            ) : (
              <Badge>Member</Badge>
            )}
            {isAdmin && member.email !== email && member.role !== 'Admin' && (
              <button
                onClick={() =>
                  removeMember({
                    memberId: member.id,
                    teamId: activeTeam?.id,
                  })
                }
                disabled={isPending}
                className="p-1.5 text-[#555555] hover:text-[#EF4444] rounded-lg hover:bg-[#EF4444]/10 transition-colors disabled:opacity-50 cursor-pointer opacity-0 group-hover:opacity-100"
                title="Remove member"
              >
                <UserX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
