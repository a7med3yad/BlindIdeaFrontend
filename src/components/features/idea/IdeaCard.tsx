import { Trash2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import StarRating from '../../ui/StarRating';
import { useRateIdea, useDeleteIdea, useRemoveRating } from '../../../hooks/useIdeas';
import type { Idea } from '../../../types/idea.types';
import { formatTimeAgo } from '../../../utils/time';

interface IdeaCardProps {
  idea: Idea;
  index?: number;
}

export default function IdeaCard({ idea, index = 0 }: IdeaCardProps) {
  const { mutate: rateIdea } = useRateIdea();
  const { mutate: deleteIdea, isPending: isDeleting } = useDeleteIdea();
  const { mutate: removeRating } = useRemoveRating();

  const handleRate = (score: number) => {
    if (score === idea.userRating) {
      removeRating(idea.id);
    } else {
      rateIdea({ ideaId: idea.id, data: { score } });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#E8003D]/30 hover:shadow-[0_0_40px_rgba(232,0,61,0.06)] transition-all duration-200 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-black text-white leading-tight truncate">
              {idea.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs text-[#555555]">{formatTimeAgo(idea.createdAt)}</span>
              {idea.isOwner ? (
                <span className="h-6 px-2.5 rounded-md text-[11px] font-semibold bg-[#E8003D]/10 text-[#E8003D] border border-[#E8003D]/25">
                  Your idea
                </span>
              ) : idea.userRating ? (
                <span className="h-6 px-2.5 rounded-md text-[11px] font-semibold bg-white/5 text-[#AAAAAA] border border-[#2A2A2A]">
                  Rated {idea.userRating}★
                </span>
              ) : null}
            </div>
          </div>
          {idea.isOwner && (
            <button
              onClick={() => deleteIdea(idea.id)}
              disabled={isDeleting}
              className="p-1.5 text-[#555555] hover:text-[#EF4444] rounded-lg hover:bg-[#EF4444]/10 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              title="Delete idea"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-[#AAAAAA] text-sm leading-relaxed line-clamp-3">
          {idea.content}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[#2A2A2A]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#F59E0B]" fill="#F59E0B" />
              <span className="text-sm font-semibold text-white">
                {idea.averageRating > 0 ? idea.averageRating.toFixed(1) : '—'}
              </span>
              <span className="text-xs text-[#555555]">
                ({idea.totalRatings})
              </span>
            </div>
            {!idea.isOwner ? (
              <span className="text-xs text-[#555555]">
                Your rating
              </span>
            ) : null}
          </div>

          {idea.isOwner ? (
            <div className="text-xs text-[#555555] font-medium">
              You can’t rate your own idea
            </div>
          ) : (
            <StarRating
              value={idea.userRating ?? 0}
              onChange={handleRate}
              size={16}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
