/**
 * @deprecated Team state is now consolidated into useAuthStore.
 * This file exists only for backward compatibility.
 * Use `useAuthStore` selectors: teams, activeTeam, activeTeamId, etc.
 */
import { useAuthStore } from './auth.store';

/** @deprecated Use useAuthStore instead */
export const useTeamStore = {
  getState: () => ({
    team: useAuthStore.getState().activeTeam,
    setTeam: (team: any) => {
      if (team) {
        useAuthStore.getState().addTeam(team);
        useAuthStore.getState().setActiveTeam(team.id);
      }
    },
    clearTeam: () => useAuthStore.getState().clearTeams(),
  }),
};
