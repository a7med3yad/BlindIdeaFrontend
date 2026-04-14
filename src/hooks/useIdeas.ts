import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ideaApi } from '../api/idea.api';
import { useAuthStore } from '../store/auth.store';
import { getIdeaError, extractMessage } from '../utils/errorMessages';
import type { SubmitIdeaRequest, RateIdeaRequest } from '../types/idea.types';

export const useTeamIdeas = () => {
  const hasTeam = useAuthStore((s) => s.hasTeam);
  const activeTeamId = useAuthStore((s) => s.activeTeamId);

  return useQuery({
    queryKey: ['team-ideas', activeTeamId],
    queryFn: async () => {
      const response = await ideaApi.getTeamIdeas();
      return response.data;
    },
    enabled: hasTeam && !!activeTeamId,
  });
};

export const useSubmitIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitIdeaRequest) => ideaApi.submit(data),
    onSuccess: () => {
      toast.success('Idea submitted anonymously!');
      queryClient.invalidateQueries({ queryKey: ['team-ideas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const msg = extractMessage(error).toLowerCase();
      if (msg.includes('not in') && msg.includes('team')) {
        toast.error('You must join a team before submitting ideas.');
      } else if (msg.includes('title') && (msg.includes('short') || msg.includes('long') || msg.includes('required'))) {
        toast.error('Title must be between 5 and 100 characters.');
      } else if (msg.includes('content') && (msg.includes('short') || msg.includes('long') || msg.includes('required'))) {
        toast.error('Description must be between 20 and 1000 characters.');
      } else {
        toast.error(getIdeaError(error));
      }
    },
  });
};

export const useDeleteIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ideaId: string) => ideaApi.delete(ideaId),
    onSuccess: () => {
      toast.success('Idea deleted.');
      queryClient.invalidateQueries({ queryKey: ['team-ideas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const msg = extractMessage(error).toLowerCase();
      if (msg.includes('not your') || msg.includes('not the owner') || msg.includes('unauthorized')) {
        toast.error('You can only delete your own ideas.');
      } else {
        toast.error(getIdeaError(error));
      }
    },
  });
};

export const useRateIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ideaId, data }: { ideaId: string; data: RateIdeaRequest }) =>
      ideaApi.rate(ideaId, data),
    onSuccess: () => {
      toast.success('Rating submitted!');
      queryClient.invalidateQueries({ queryKey: ['team-ideas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const msg = extractMessage(error).toLowerCase();
      if (msg.includes('own idea') || msg.includes('your own') || msg.includes('cannot rate')) {
        toast.error("You can't rate your own idea.");
      } else if (msg.includes('already rated') || msg.includes('already submitted')) {
        toast.error('You have already rated this idea.');
      } else if (msg.includes('not in') && msg.includes('team')) {
        toast.error('You must be in the team to rate ideas.');
      } else if (msg.includes('rating') && (msg.includes('1') || msg.includes('5') || msg.includes('between') || msg.includes('range'))) {
        toast.error('Rating must be between 1 and 5.');
      } else {
        toast.error(getIdeaError(error));
      }
    },
  });
};

export const useRemoveRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ideaId: string) => ideaApi.removeRating(ideaId),
    onSuccess: () => {
      toast.success('Rating removed.');
      queryClient.invalidateQueries({ queryKey: ['team-ideas'] });
    },
    onError: (error: unknown) => {
      const msg = extractMessage(error).toLowerCase();
      if (msg.includes('not found') || msg.includes('no rating')) {
        toast.error('No rating found to remove.');
      } else {
        toast.error(getIdeaError(error));
      }
    },
  });
};
