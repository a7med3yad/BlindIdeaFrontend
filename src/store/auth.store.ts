import { create } from 'zustand';
import api from '../api/axios';
import type { TeamResponseDto } from '../types/team.types';

interface AuthState {
  // ── Auth ───────────────────────────────────────────────
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  role: string | null;
  isAuthenticated: boolean;

  // ── Multi-team ─────────────────────────────────────────
  teams: TeamResponseDto[];
  activeTeamId: string | null;
  activeTeam: TeamResponseDto | null;

  // ── Computed helpers (kept as getters via selectors) ────
  hasTeam: boolean;

  // ── Auth actions ───────────────────────────────────────
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  initialize: () => void;

  // ── Team actions ───────────────────────────────────────
  setTeams: (teams: TeamResponseDto[]) => void;
  setActiveTeam: (teamId: string) => void;
  addTeam: (team: TeamResponseDto) => void;
  removeTeam: (teamId: string) => void;
  updateTeam: (teamId: string, updates: Partial<TeamResponseDto>) => void;
  clearTeams: () => void;

  /** @deprecated Use setTeams/setActiveTeam instead */
  setTeam: (teamId: string | null) => void;
}

const decodeToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const email =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
      payload.email ||
      null;
    const role =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      payload.role ||
      null;
    return { email, role };
  } catch {
    return { email: null, role: null };
  }
};

/** Check if a JWT token is expired (with 30s buffer) */
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    // 30 second buffer to avoid edge cases
    return Date.now() >= (payload.exp * 1000) - 30_000;
  } catch {
    return true; // If we can't decode, treat as expired
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  email: null,
  role: null,
  isAuthenticated: false,

  // Multi-team state
  teams: [],
  activeTeamId: null,
  activeTeam: null,
  hasTeam: false,

  // ── Auth actions ───────────────────────────────────────

  login: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    const { email, role } = decodeToken(accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    set({ accessToken, refreshToken, email, role, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('activeTeamId');
    delete api.defaults.headers.common['Authorization'];
    set({
      accessToken: null,
      refreshToken: null,
      email: null,
      role: null,
      isAuthenticated: false,
      teams: [],
      activeTeamId: null,
      activeTeam: null,
      hasTeam: false,
    });
  },

  initialize: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      // ✅ FIX: Check if access token is expired before restoring session
      if (isTokenExpired(accessToken)) {
        // Token expired — clear everything and let user re-login
        // (The refresh interceptor will handle it if refreshToken is still valid)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('activeTeamId');
        return;
      }
      const { email, role } = decodeToken(accessToken);
      const activeTeamId = localStorage.getItem('activeTeamId');
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      set({
        accessToken,
        refreshToken,
        email,
        role,
        isAuthenticated: true,
        activeTeamId,
        hasTeam: !!activeTeamId,
      });
    }
  },

  // ── Multi-team actions ─────────────────────────────────

  setTeams: (teams: TeamResponseDto[]) => {
    const { activeTeamId } = get();
    const activeTeam = teams.find((t) => t.id === activeTeamId) || null;
    set({
      teams,
      activeTeam,
      hasTeam: teams.length > 0,
    });
  },

  setActiveTeam: (teamId: string) => {
    localStorage.setItem('activeTeamId', teamId);
    const { teams } = get();
    // Mark the correct team as active in the local array
    const updatedTeams = teams.map((t) => ({
      ...t,
      isActive: t.id === teamId,
    }));
    const activeTeam = updatedTeams.find((t) => t.id === teamId) || null;
    set({
      activeTeamId: teamId,
      activeTeam,
      teams: updatedTeams,
      hasTeam: true,
    });
  },

  addTeam: (team: TeamResponseDto) => {
    const { teams } = get();
    const exists = teams.some((t) => t.id === team.id);
    if (!exists) {
      set({ teams: [...teams, team], hasTeam: true });
    }
  },

  removeTeam: (teamId: string) => {
    const { teams, activeTeamId } = get();
    const filtered = teams.filter((t) => t.id !== teamId);
    const needNewActive = activeTeamId === teamId;
    const newActive = needNewActive
      ? filtered.find((t) => t.isActive) || filtered[0] || null
      : filtered.find((t) => t.id === activeTeamId) || null;

    if (newActive) {
      localStorage.setItem('activeTeamId', newActive.id);
    } else {
      localStorage.removeItem('activeTeamId');
    }

    set({
      teams: filtered,
      activeTeamId: newActive?.id || null,
      activeTeam: newActive,
      hasTeam: filtered.length > 0,
    });
  },

  updateTeam: (teamId: string, updates: Partial<TeamResponseDto>) => {
    const { teams, activeTeamId } = get();
    const updatedTeams = teams.map((t) =>
      t.id === teamId ? { ...t, ...updates } : t
    );
    const activeTeam =
      activeTeamId === teamId
        ? updatedTeams.find((t) => t.id === teamId) || null
        : get().activeTeam;
    set({ teams: updatedTeams, activeTeam });
  },

  clearTeams: () => {
    localStorage.removeItem('activeTeamId');
    set({
      teams: [],
      activeTeamId: null,
      activeTeam: null,
      hasTeam: false,
    });
  },

  // ── Legacy compat ──────────────────────────────────────
  setTeam: (teamId: string | null) => {
    if (teamId) {
      localStorage.setItem('activeTeamId', teamId);
      set({ activeTeamId: teamId, hasTeam: true });
    } else {
      localStorage.removeItem('activeTeamId');
      set({ activeTeamId: null, hasTeam: false, activeTeam: null });
    }
  },
}));
