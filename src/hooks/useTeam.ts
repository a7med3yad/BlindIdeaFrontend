import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { teamApi } from '../api/team.api';
import { useAuthStore } from '../store/auth.store';
import { getTeamError, extractMessage } from '../utils/errorMessages';
import type { CreateTeamRequest, JoinTeamRequest } from '../types/team.types';

// ── Fetch all user's teams ──────────────────────────────

export const useMyTeams = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['my-teams'],
    queryFn: async () => {
      const response = await teamApi.getMyTeams();
      useAuthStore.getState().setTeams(response.data);
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  });
};

/** @deprecated Use useMyTeams instead */
export const useMyTeam = () => {
  const hasTeam = useAuthStore((s) => s.hasTeam);

  return useQuery({
    queryKey: ['my-teams'],
    queryFn: async () => {
      const response = await teamApi.getMyTeams();
      useAuthStore.getState().setTeams(response.data);
      // Return the active team for backward compat
      const active = response.data.find((t) => t.isActive) || response.data[0];
      return active || null;
    },
    enabled: hasTeam,
    staleTime: 5 * 60_000,
  });
};

// ── Members of active team ──────────────────────────────

export const useTeamMembers = () => {
  const activeTeamId = useAuthStore((s) => s.activeTeamId);

  return useQuery({
    queryKey: ['team-members', activeTeamId],
    queryFn: async () => {
      const response = await teamApi.getMembers();
      return response.data;
    },
    enabled: !!activeTeamId,
    staleTime: 5 * 60_000,
  });
};

// ── Switch active team ──────────────────────────────────

export const useTeamSwitch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => {
      // Optimistic: update store immediately
      useAuthStore.getState().setActiveTeam(teamId);
      return teamApi.switchTeam({ teamId });
    },
    onSuccess: () => {
      const activeTeam = useAuthStore.getState().activeTeam;
      toast.success(`Switched to ${activeTeam?.name || 'team'}`);
      // Refetch data that depends on active team
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['team-ideas'] });
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['my-teams'] });
    },
    onError: (error) => {
      const msg = extractMessage(error).toLowerCase();
      if (msg.includes('not a member')) {
        toast.error('You are not a member of this team.');
      } else {
        toast.error(getTeamError(error));
      }
      // Refetch to restore correct state
      queryClient.invalidateQueries({ queryKey: ['my-teams'] });
    },
  });
};

// ── Create team ─────────────────────────────────────────

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamRequest) => teamApi.create(data),
    onSuccess: (response) => {
      const newTeam = response.data;
      useAuthStore.getState().addTeam(newTeam);
      useAuthStore.getState().setActiveTeam(newTeam.id);
      toast.success('Team created successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-teams'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['team-ideas'] });
    },
    onError: (error) => {
      const msg = extractMessage(error).toLowerCase();
      if (msg.includes('already exists') || msg.includes('name taken')) {
        toast.error('A team with this name already exists.');
      } else if (msg.includes('too short') || msg.includes('too long') || msg.includes('name must')) {
        toast.error('Team name must be between 3 and 50 characters.');
      } else {
        toast.error(getTeamError(error));
      }
    },
  });
};

// ── Join team ───────────────────────────────────────────

export const useJoinTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JoinTeamRequest) => teamApi.join(data),
    onSuccess: (response) => {
      const joinedTeam = response.data;
      useAuthStore.getState().addTeam(joinedTeam);
      useAuthStore.getState().setActiveTeam(joinedTeam.id);
      toast.success('You have joined the team!');
      queryClient.invalidateQueries({ queryKey: ['my-teams'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['team-ideas'] });
    },
    onError: (error) => {
      const msg = extractMessage(error).toLowerCase();
      if (msg.includes('invalid invite') || msg.includes('invalid code') || msg.includes('not found')) {
        toast.error('Invalid invite code. Please check and try again.');
      } else if (msg.includes('already') && msg.includes('member')) {
        toast.error('You are already a member of this team.');
      } else if (msg.includes('expired')) {
        toast.error('This invite code has expired.');
      } else {
        toast.error(getTeamError(error));
      }
    },
  });
};

// ── Leave team ──────────────────────────────────────────

export const useLeaveTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // ✅ FIX: teamId is now required (no ghost endpoint)
    mutationFn: (teamId: string) => teamApi.leave(teamId),
    onSuccess: (_data, teamId) => {
      useAuthStore.getState().removeTeam(teamId);
      toast.success('You have left the team.');
      queryClient.invalidateQueries({ queryKey: ['my-teams'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['team-ideas'] });
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
    onError: (error) => {
      const msg = extractMessage(error).toLowerCase();
      if (msg.includes('admin') && (msg.includes('cannot') || msg.includes('leave'))) {
        toast.error('Admins cannot leave. Delete the team or transfer admin first.');
      } else {
        toast.error(getTeamError(error));
      }
    },
  });
};

// ── Delete team (admin) ─────────────────────────────────

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // ✅ FIX: teamId is now required (no ghost endpoint)
    mutationFn: (teamId: string) => teamApi.deleteTeam(teamId),
    onSuccess: (_data, teamId) => {
      useAuthStore.getState().removeTeam(teamId);
      toast.success('Team deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['my-teams'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['team-ideas'] });
    },
    onError: (error) => {
      const msg = extractMessage(error).toLowerCase();
      if (msg.includes('not admin') || msg.includes('unauthorized')) {
        toast.error('Only the team admin can delete the team.');
      } else {
        toast.error(getTeamError(error));
      }
    },
  });
};

// ── Regenerate invite code ──────────────────────────────

export const useRegenerateInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // ✅ FIX: teamId is now required
    mutationFn: (teamId: string) => teamApi.regenerateInvite(teamId),
    onSuccess: (response, teamId) => {
      if (response.data?.inviteCode) {
        useAuthStore.getState().updateTeam(teamId, {
          inviteCode: response.data.inviteCode,
        });
      }
      toast.success('New invite code generated!');
      queryClient.invalidateQueries({ queryKey: ['my-teams'] });
    },
    onError: (error) => {
      const msg = extractMessage(error).toLowerCase();
      if (msg.includes('not admin')) {
        toast.error('Only admins can regenerate the invite code.');
      } else {
        toast.error(getTeamError(error));
      }
    },
  });
};

// ── Remove member ───────────────────────────────────────

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // ✅ FIX: both teamId and memberId are now required
    mutationFn: ({ memberId, teamId }: { memberId: string; teamId: string }) =>
      teamApi.removeMember(memberId, teamId),
    onSuccess: () => {
      toast.success('Member removed from the team.');
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['my-teams'] });
    },
    onError: (error) => {
      const msg = extractMessage(error).toLowerCase();
      if (msg.includes('cannot remove') && msg.includes('admin')) {
        toast.error('You cannot remove the team admin.');
      } else if (msg.includes('not admin')) {
        toast.error('Only admins can remove members.');
      } else {
        toast.error(getTeamError(error));
      }
    },
  });
};
