import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Shield, Users, Settings } from 'lucide-react';
import { useAuthStore } from '../../../store/auth.store';
import { useTeamSwitch } from '../../../hooks/useTeam';

export default function TeamSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const teams = useAuthStore((s) => s.teams);
  const activeTeam = useAuthStore((s) => s.activeTeam);
  const { mutate: switchTeam, isPending } = useTeamSwitch();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (teams.length === 0) return null;

  const handleSwitch = (teamId: string) => {
    if (teamId === activeTeam?.id || isPending) return;
    switchTeam(teamId);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E8003D]
          rounded-lg px-4 h-9 flex items-center gap-2 text-sm
          transition-all duration-200 cursor-pointer group
        "
      >
        <Users className="w-3.5 h-3.5 text-[#E8003D]" />
        <span className="text-white font-medium max-w-[140px] truncate">
          {activeTeam?.name || 'Select Team'}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#555555] group-hover:text-[#AAAAAA] transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="
              absolute top-full right-0 mt-2 z-50
              bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl
              shadow-2xl shadow-black/40 min-w-[260px] overflow-hidden
            "
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#1A1A1A]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#555555]">
                Your Teams ({teams.length})
              </p>
            </div>

            {/* Team list */}
            <div className="py-1.5 max-h-[280px] overflow-y-auto">
              {teams.map((team) => {
                const isActive = team.id === activeTeam?.id;
                return (
                  <button
                    type="button"
                    key={team.id}
                    onClick={() => handleSwitch(team.id)}
                    disabled={isPending}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5
                      text-left transition-all duration-150 cursor-pointer
                      ${
                        isActive
                          ? 'bg-[#E8003D]/8'
                          : 'hover:bg-white/5'
                      }
                      disabled:opacity-50
                    `}
                  >
                    {/* Team icon */}
                    <div
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                        ${
                          isActive
                            ? 'bg-[#E8003D]/15 text-[#E8003D]'
                            : 'bg-[#1A1A1A] text-[#555555]'
                        }
                      `}
                    >
                      <Users className="w-3.5 h-3.5" />
                    </div>

                    {/* Team info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${
                          isActive
                            ? 'text-white font-bold'
                            : 'text-[#AAAAAA] font-medium'
                        }`}
                      >
                        {team.name}
                      </p>
                      <p className="text-[11px] text-[#555555]">
                        {team.memberCount} member{team.memberCount !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {team.isAdmin && (
                        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded-md">
                          <Shield className="w-2.5 h-2.5" />
                          Admin
                        </span>
                      )}
                      {isActive && (
                        <Check className="w-4 h-4 text-[#22C55E]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer — Manage Teams link */}
            <div className="border-t border-[#1A1A1A] px-4 py-2.5">
              <Link
                to="/team"
                onClick={() => setOpen(false)}
                className="
                  flex items-center gap-2 text-xs font-medium
                  text-[#555555] hover:text-[#AAAAAA] transition-colors
                  no-underline
                "
              >
                <Settings className="w-3 h-3" />
                Manage Teams
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
