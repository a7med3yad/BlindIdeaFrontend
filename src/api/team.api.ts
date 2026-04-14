import api from './axios';
import type {
  TeamResponseDto,
  TeamMember,
  CreateTeamRequest,
  JoinTeamRequest,
  SwitchTeamRequest,
} from '../types/team.types';

export const teamApi = {
  // ── Multi-team endpoints ──────────────────────────────
  getMyTeams: () =>
    api.get<TeamResponseDto[]>('/Team/my-teams'),

  getActiveTeam: () =>
    api.get<TeamResponseDto>('/Team/active'),

  switchTeam: (data: SwitchTeamRequest) =>
    api.post<TeamResponseDto>('/Team/switch', data),

  // ── Create / Join ─────────────────────────────────────
  create: (data: CreateTeamRequest) =>
    api.post<TeamResponseDto>('/Team/create', data),

  join: (data: JoinTeamRequest) =>
    api.post<TeamResponseDto>('/Team/join', data),

  // ── Members ───────────────────────────────────────────
  // ✅ FIX: Backend only has GET /Team/members (no teamId param)
  getMembers: () =>
    api.get<TeamMember[]>('/Team/members'),

  // ── Leave ─────────────────────────────────────────────
  // ✅ FIX: Backend requires teamId in path
  leave: (teamId: string) =>
    api.post(`/Team/leave/${teamId}`),

  // ── Delete (admin only) ───────────────────────────────
  // ✅ FIX: Backend requires teamId in path
  deleteTeam: (teamId: string) =>
    api.delete(`/Team/delete/${teamId}`),

  // ── Regenerate invite ─────────────────────────────────
  // ✅ FIX: Backend requires teamId in path
  regenerateInvite: (teamId: string) =>
    api.post<{ inviteCode: string }>(`/Team/regenerate-invite/${teamId}`),

  // ── Remove member ─────────────────────────────────────
  // ✅ FIX: Backend requires both teamId and memberId
  removeMember: (memberId: string, teamId: string) =>
    api.delete(`/Team/remove-member/${teamId}/${memberId}`),
};
